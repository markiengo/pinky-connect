"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { detectPrimarySubject, getSubjectName } from "@/lib/subject-detection";
import { redirect } from "next/navigation";

export interface StudySubjectInput {
  name: string;
  examDate: string; // ISO date string
  dailyHours: number;
  color?: string;
}

export interface StudySubjectWithSessions {
  id: string;
  name: string;
  examDate: Date;
  dailyHours: number;
  totalHours: number;
  color: string;
  sessions: StudySession[];
}

export interface StudySession {
  id: string;
  subjectId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  status: "planned" | "done" | "skipped";
  deThiId: string | null;
  description: string | null;
  subject: {
    id: string;
    name: string;
    color: string;
  };
}

export interface AlternativeSlot {
  date: string; // ISO date
  startTime: string; // ISO
  endTime: string; // ISO
  reason: string;
}

const SUBJECT_COLORS = [
  "#9F7AEA",
  "#A8E6CF",
  "#F4899A",
  "#4ECDC4",
  "#5B5FA8",
  "#FFD93D",
  "#FF6B6B",
  "#95E1D3",
];

export async function requireCalendarAccess(): Promise<{ userId: string; plan: string } | null> {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, plan: true },
  });

  if (!user) return null;
  return { userId: user.id, plan: user.plan };
}

export async function getCurrentUserPlan() {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, plan: true, username: true },
  });
  return user;
}

export async function getStudyPlan(): Promise<{
  planId: string;
  subjects: StudySubjectWithSessions[];
} | null> {
  const access = await requireCalendarAccess();
  if (!access) redirect("/login");

  const plan = await prisma.studyPlan.findUnique({
    where: { userId: access.userId },
    include: {
      subjects: {
        include: {
          sessions: {
            orderBy: { startTime: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!plan) return null;

  return {
    planId: plan.id,
    subjects: plan.subjects.map((s: typeof plan.subjects[0]) => ({
      ...s,
      sessions: s.sessions.map((session: typeof s.sessions[0]) => ({
        ...session,
        status: session.status as "planned" | "done" | "skipped",
        subject: {
          id: s.id,
          name: s.name,
          color: s.color,
        },
      })),
    })),
  };
}

const AVAILABLE_HOURS_PER_DAY = 10.5; // 3 frames: 7-11 (4h) + 13:30-17 (3.5h) + 19-22 (3h)

export async function createStudyPlan(subjects: StudySubjectInput[]) {
  const access = await requireCalendarAccess();
  if (!access) redirect("/login");
  if (access.plan !== "premium") {
    return { error: "Tính năng này chỉ dành cho gói Premium." };
  }

  // Validate total daily hours don't exceed available study time
  const totalDailyHours = subjects.reduce((sum, s) => sum + s.dailyHours, 0);
  if (totalDailyHours > AVAILABLE_HOURS_PER_DAY) {
    return {
      error: `Tổng giờ học các môn trong ngày là ${totalDailyHours}h, vượt quá khung thời gian có sẵn (${AVAILABLE_HOURS_PER_DAY}h). Vui lòng giảm số giờ học.`,
    };
  }

  // Delete existing plan if any
  await prisma.studyPlan.deleteMany({ where: { userId: access.userId } });

  const plan = await prisma.studyPlan.create({
    data: { userId: access.userId },
  });

  const createdSubjects: StudySubjectWithSessions[] = [];

  for (let i = 0; i < subjects.length; i++) {
    const input = subjects[i];
    const examDate = new Date(input.examDate);
    const today = stripTime(new Date());
    const daysRemaining = Math.max(1, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const totalHours = Math.round(input.dailyHours * daysRemaining * 10) / 10;
    const color = input.color || SUBJECT_COLORS[i % SUBJECT_COLORS.length];

    const subject = await prisma.studySubject.create({
      data: {
        planId: plan.id,
        name: input.name.trim(),
        examDate,
        dailyHours: input.dailyHours,
        totalHours,
        color,
      },
    });

    createdSubjects.push({
      ...subject,
      sessions: [],
    });
  }

  await generateSchedule(plan.id);

  return { success: true };
}

export async function updateStudySession(
  sessionId: string,
  updates: { startTime?: string; endTime?: string; status?: StudySession["status"] }
) {
  const access = await requireCalendarAccess();
  if (!access) redirect("/login");
  if (access.plan !== "premium") {
    return { error: "Tính năng này chỉ dành cho gói Premium." };
  }

  const existing = await prisma.studySession.findFirst({
    where: { id: sessionId },
    include: { plan: true },
  });

  if (!existing || existing.plan.userId !== access.userId) {
    return { error: "Không tìm thấy lịch học." };
  }

  const data: {
    startTime?: Date;
    endTime?: Date;
    status?: StudySession["status"];
  } = {};

  if (updates.startTime) data.startTime = new Date(updates.startTime);
  if (updates.endTime) data.endTime = new Date(updates.endTime);
  if (updates.status) data.status = updates.status;

  await prisma.studySession.update({
    where: { id: sessionId },
    data,
  });

  return { success: true };
}

export async function deleteStudySessionWithSuggestion(sessionId: string): Promise<{
  success: boolean;
  suggestion?: AlternativeSlot;
  error?: string;
}> {
  const access = await requireCalendarAccess();
  if (!access) redirect("/login");
  if (access.plan !== "premium") {
    return { success: false, error: "Tính năng này chỉ dành cho gói Premium." };
  }

  const existing = await prisma.studySession.findFirst({
    where: { id: sessionId },
    include: { plan: true, subject: true },
  });

  if (!existing || existing.plan.userId !== access.userId) {
    return { success: false, error: "Không tìm thấy lịch học." };
  }

  const durationHours =
    (existing.endTime.getTime() - existing.startTime.getTime()) / (1000 * 60 * 60);

  await prisma.studySession.delete({ where: { id: sessionId } });

  const suggestion = await findAlternativeSlot(
    existing.planId,
    existing.subjectId,
    durationHours,
    existing.subject.examDate
  );

  return { success: true, suggestion };
}

// ─── Smart Schedule Algorithm ─────────────────────────────────────
// Time frames: Morning 7:00-11:00, Afternoon 13:30-17:00, Evening 19:00-22:00
// Breaks: 30 min between sessions within a frame
// All times snap to :00/:15/:30/:45
// Max 2h per session for focus

const TIME_FRAMES = [
  { startHour: 7, startMin: 0, endHour: 11, endMin: 0 },   // Morning
  { startHour: 13, startMin: 30, endHour: 17, endMin: 0 },  // Afternoon
  { startHour: 19, startMin: 0, endHour: 22, endMin: 0 },   // Evening
];

const BREAK_MINUTES = 30;
const MAX_SESSION_HOURS = 2;
const MIN_SESSION_MINUTES = 30;

function snapToQuarter(minutesFromMidnight: number): number {
  return Math.round(minutesFromMidnight / 15) * 15;
}

export async function generateSchedule(planId: string) {
  const plan = await prisma.studyPlan.findUnique({
    where: { id: planId },
    include: { subjects: true },
  });
  if (!plan) return;

  // Clear existing sessions
  await prisma.studySession.deleteMany({ where: { planId } });

  const today = stripTime(new Date());

  // Find the latest exam date to know how many days we need to schedule
  const latestExam = plan.subjects.reduce((max, s) => {
    const d = stripTime(s.examDate);
    return d > max ? d : max;
  }, today);

  // Track remaining hours per subject
  const subjectState = plan.subjects.map((s) => ({
    id: s.id,
    name: s.name,
    dailyHours: s.dailyHours,
    remainingHours: s.totalHours,
    examDate: stripTime(s.examDate),
    deThiId: undefined as string | undefined,
  }));

  // Pre-fetch deThi IDs for subjects
  for (const ss of subjectState) {
    const slug = detectPrimarySubject(ss.name);
    if (slug) {
      const deThi = await prisma.deThi.findFirst({
        where: { subject: { slug } },
        orderBy: { createdAt: "asc" },
        select: { id: true },
      });
      ss.deThiId = deThi?.id;
    }
  }

  const sessions: {
    subjectId: string;
    title: string;
    startTime: Date;
    endTime: Date;
    deThiId?: string;
  }[] = [];

  // Schedule day by day
  const currentDate = new Date(today);

  while (currentDate <= latestExam && subjectState.some((s) => s.remainingHours > 0.01)) {
    // Get subjects that still need hours and haven't passed exam date
    const activeSubjects = subjectState
      .filter((s) => s.remainingHours > 0.01 && currentDate <= s.examDate)
      .sort((a, b) => a.examDate.getTime() - b.examDate.getTime()); // prioritize earlier exams

    if (activeSubjects.length === 0) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // Build chunks: split each subject's daily hours into max-2h sessions
    type Chunk = { subjectId: string; name: string; deThiId?: string; minutes: number };
    const chunkQueues: Chunk[][] = activeSubjects.map((subj) => {
      const todayHours = Math.min(subj.dailyHours, subj.remainingHours);
      const totalMinutes = Math.round(todayHours * 60);
      const chunks: Chunk[] = [];
      let remaining = totalMinutes;
      while (remaining > 0) {
        const chunkMin = Math.min(remaining, MAX_SESSION_HOURS * 60);
        chunks.push({
          subjectId: subj.id,
          name: subj.name,
          deThiId: subj.deThiId,
          minutes: chunkMin,
        });
        remaining -= chunkMin;
      }
      return chunks;
    });

    // Interleave chunks across subjects for variety
    const interleaved: Chunk[] = [];
    let hasMore = true;
    while (hasMore) {
      hasMore = false;
      for (const queue of chunkQueues) {
        if (queue.length > 0) {
          interleaved.push(queue.shift()!);
          hasMore = true;
        }
      }
    }

    // Assign interleaved chunks to frames round-robin
    const frameAssignments: Chunk[][] = TIME_FRAMES.map(() => []);
    interleaved.forEach((chunk, idx) => {
      const frameIdx = idx % TIME_FRAMES.length;
      frameAssignments[frameIdx].push(chunk);
    });

    // For each frame, schedule its assigned chunks sequentially
    for (let frameIdx = 0; frameIdx < TIME_FRAMES.length; frameIdx++) {
      const frame = TIME_FRAMES[frameIdx];
      const frameStartMin = frame.startHour * 60 + frame.startMin;
      const frameEndMin = frame.endHour * 60 + frame.endMin;

      const chunksInFrame = frameAssignments[frameIdx];
      if (chunksInFrame.length === 0) continue;

      let cursor = frameStartMin;

      for (let ci = 0; ci < chunksInFrame.length; ci++) {
        const chunk = chunksInFrame[ci];
        const subj = subjectState.find((s) => s.id === chunk.subjectId)!;
        if (subj.remainingHours <= 0.01) continue;

        let sessionMin = snapToQuarter(chunk.minutes);
        if (sessionMin < MIN_SESSION_MINUTES) {
          if (frameEndMin - cursor < MIN_SESSION_MINUTES) break;
          sessionMin = Math.min(MIN_SESSION_MINUTES, snapToQuarter(frameEndMin - cursor));
        }

        // Fit within frame
        if (cursor + sessionMin > frameEndMin) {
          sessionMin = snapToQuarter(frameEndMin - cursor);
          if (sessionMin < MIN_SESSION_MINUTES) break;
        }

        const sessionStartMin = snapToQuarter(cursor);
        const sessionEndMin = sessionStartMin + sessionMin;
        if (sessionEndMin > frameEndMin) break;

        const startTime = new Date(currentDate);
        startTime.setHours(0, 0, 0, 0);
        startTime.setMinutes(sessionStartMin);

        const endTime = new Date(currentDate);
        endTime.setHours(0, 0, 0, 0);
        endTime.setMinutes(sessionEndMin);

        sessions.push({
          subjectId: subj.id,
          title: `Ôn ${subj.name}`,
          startTime,
          endTime,
          deThiId: subj.deThiId,
        });

        const sessionHours = sessionMin / 60;
        subj.remainingHours = Math.round((subj.remainingHours - sessionHours) * 100) / 100;

        // Move cursor past session + break (no break after last chunk in frame)
        const isLast = ci === chunksInFrame.length - 1;
        cursor = sessionEndMin + (isLast ? 0 : BREAK_MINUTES);
        if (cursor >= frameEndMin) break;
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  await prisma.studySession.createMany({
    data: sessions.map((s) => ({
      planId,
      subjectId: s.subjectId,
      title: s.title,
      startTime: s.startTime,
      endTime: s.endTime,
      deThiId: s.deThiId || null,
    })),
  });
}

async function findAlternativeSlot(
  planId: string,
  subjectId: string,
  durationHours: number,
  examDate: Date
): Promise<AlternativeSlot | undefined> {
  const subject = await prisma.studySubject.findUnique({
    where: { id: subjectId },
  });
  if (!subject) return undefined;

  const plan = await prisma.studyPlan.findUnique({
    where: { id: planId },
    include: { sessions: true },
  });
  if (!plan) return undefined;

  const today = stripTime(new Date());
  const limit = stripTime(examDate);
  const durationMin = snapToQuarter(Math.round(durationHours * 60));

  for (let offset = 0; offset <= 6; offset++) {
    const candidate = new Date(today);
    candidate.setDate(candidate.getDate() + offset);
    if (candidate > limit) break;

    // Get all sessions on this candidate day
    const daySessions = plan.sessions
      .filter((s) => isSameDay(s.startTime, candidate))
      .map((s) => ({
        startMin: s.startTime.getHours() * 60 + s.startTime.getMinutes(),
        endMin: s.endTime.getHours() * 60 + s.endTime.getMinutes(),
      }))
      .sort((a, b) => a.startMin - b.startMin);

    // Try each time frame
    for (const frame of TIME_FRAMES) {
      const frameStartMin = frame.startHour * 60 + frame.startMin;
      const frameEndMin = frame.endHour * 60 + frame.endMin;

      // Find a free slot within this frame
      let cursor = frameStartMin;
      for (const used of daySessions) {
        if (used.startMin - cursor >= durationMin) {
          // Found a gap
          const startMin = snapToQuarter(cursor);
          if (startMin + durationMin <= used.startMin && startMin + durationMin <= frameEndMin) {
            const startTime = new Date(candidate);
            startTime.setHours(0, 0, 0, 0);
            startTime.setMinutes(startMin);
            const endTime = new Date(candidate);
            endTime.setHours(0, 0, 0, 0);
            endTime.setMinutes(startMin + durationMin);

            return {
              date: candidate.toISOString(),
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
              reason: `Bạn còn ${Math.ceil((limit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} ngày trước kỳ thi. Chuyển buổi học này sang ${formatDate(candidate)} lúc ${pad2(startTime.getHours())}:${pad2(startTime.getMinutes())} để không bỏ lỡ nội dung.`,
            };
          }
        }
        cursor = Math.max(cursor, used.endMin + BREAK_MINUTES);
      }

      // Check after last session
      const startMin = snapToQuarter(cursor);
      if (startMin + durationMin <= frameEndMin) {
        const startTime = new Date(candidate);
        startTime.setHours(0, 0, 0, 0);
        startTime.setMinutes(startMin);
        const endTime = new Date(candidate);
        endTime.setHours(0, 0, 0, 0);
        endTime.setMinutes(startMin + durationMin);

        return {
          date: candidate.toISOString(),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          reason: `Bạn còn ${Math.ceil((limit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} ngày trước kỳ thi. Chuyển buổi học này sang ${formatDate(candidate)} lúc ${pad2(startTime.getHours())}:${pad2(startTime.getMinutes())} để không bỏ lỡ nội dung.`,
        };
      }
    }
  }

  return undefined;
}

function stripTime(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${day}/${month}`;
}

export async function getSuggestedSubjectName(name: string): Promise<string | null> {
  const slug = detectPrimarySubject(name);
  if (!slug) return null;
  return getSubjectName(slug) || null;
}

export async function getSuggestedDeThi(subjectName: string) {
  const slug = detectPrimarySubject(subjectName);
  if (!slug) return null;

  const deThi = await prisma.deThi.findFirst({
    where: { subject: { slug } },
    orderBy: { createdAt: "asc" },
    include: { subject: true, _count: { select: { deThiQuestions: true } } },
  });

  return deThi;
}
