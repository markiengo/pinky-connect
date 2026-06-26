"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export interface HistoryEntry {
  id: string;
  deThiId: string;
  deThiTitle: string;
  subjectName: string;
  subjectSlug: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: Date;
}

export async function getQuizHistory(): Promise<HistoryEntry[]> {
  const session = await getSession();
  if (!session) return [];

  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: session.userId },
    include: {
      deThi: { include: { subject: true } },
    },
    orderBy: { completedAt: "desc" },
  });

  return attempts.map((a) => ({
    id: a.id,
    deThiId: a.deThiId,
    deThiTitle: a.deThi.title,
    subjectName: a.deThi.subject.name,
    subjectSlug: a.deThi.subject.slug,
    score: a.score,
    totalQuestions: a.totalQuestions,
    percentage: a.percentage,
    completedAt: a.completedAt,
  }));
}

export interface PreviousAttemptAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean | null;
}

export interface PreviousAttempt {
  id: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: Date;
  answers: PreviousAttemptAnswer[];
}

export async function getPreviousAttempt(deThiId: string): Promise<PreviousAttempt | null> {
  const session = await getSession();
  if (!session) return null;

  try {
    const attempt = await prisma.quizAttempt.findFirst({
      where: { userId: session.userId, deThiId },
      include: { answers: true },
      orderBy: { completedAt: "desc" },
      take: 1,
    });

    if (!attempt) return null;

    return {
      id: attempt.id,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage: attempt.percentage,
      completedAt: attempt.completedAt,
      answers: attempt.answers.map((a) => ({
        questionId: a.questionId,
        userAnswer: a.userAnswer,
        isCorrect: a.isCorrect,
      })),
    };
  } catch {
    return null;
  }
}

export interface ScoreProgressionPoint {
  date: Date;
  percentage: number;
  title: string;
}

export async function getScoreProgression(): Promise<ScoreProgressionPoint[]> {
  const session = await getSession();
  if (!session) return [];

  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: session.userId },
    include: { deThi: true },
    orderBy: { completedAt: "asc" },
  });

  return attempts.map((a) => ({
    date: a.completedAt,
    percentage: a.percentage,
    title: a.deThi.title,
  }));
}

export interface SubjectAverage {
  subjectName: string;
  subjectSlug: string;
  averagePercentage: number;
  attemptCount: number;
}

export async function getSubjectAverages(): Promise<SubjectAverage[]> {
  const session = await getSession();
  if (!session) return [];

  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: session.userId },
    include: { subject: true },
  });

  const bySubject = new Map<string, { name: string; slug: string; total: number; count: number }>();

  for (const a of attempts) {
    const key = a.subjectId;
    const existing = bySubject.get(key);
    if (existing) {
      existing.total += a.percentage;
      existing.count += 1;
    } else {
      bySubject.set(key, {
        name: a.subject.name,
        slug: a.subject.slug,
        total: a.percentage,
        count: 1,
      });
    }
  }

  return Array.from(bySubject.values()).map((s) => ({
    subjectName: s.name,
    subjectSlug: s.slug,
    averagePercentage: Math.round(s.total / s.count),
    attemptCount: s.count,
  }));
}

export interface DashboardStats {
  totalAttempts: number;
  avgScore: number;
  bestScore: number;
  bestSubject: string | null;
  recentAttempts: HistoryEntry[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const session = await getSession();
  if (!session) {
    return { totalAttempts: 0, avgScore: 0, bestScore: 0, bestSubject: null, recentAttempts: [] };
  }

  const where = { userId: session.userId };
  const [stats, recentAttempts, bestSubjectGroup] = await Promise.all([
    prisma.quizAttempt.aggregate({
      where,
      _count: { id: true },
      _avg: { percentage: true },
      _max: { percentage: true },
    }),
    prisma.quizAttempt.findMany({
      where,
      select: {
        id: true,
        deThiId: true,
        score: true,
        totalQuestions: true,
        percentage: true,
        completedAt: true,
        deThi: {
          select: {
            title: true,
            subject: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { completedAt: "desc" },
      take: 5,
    }),
    prisma.quizAttempt.groupBy({
      where,
      by: ["subjectId"],
      _avg: { percentage: true },
      orderBy: { _avg: { percentage: "desc" } },
      take: 1,
    }),
  ]);

  const totalAttempts = stats._count.id;
  if (totalAttempts === 0) {
    return { totalAttempts: 0, avgScore: 0, bestScore: 0, bestSubject: null, recentAttempts: [] };
  }

  const bestSubject = bestSubjectGroup[0]
    ? (
        await prisma.subject.findUnique({
          where: { id: bestSubjectGroup[0].subjectId },
          select: { name: true },
        })
      )?.name ?? null
    : null;

  const recent = recentAttempts.map((a) => ({
    id: a.id,
    deThiId: a.deThiId,
    deThiTitle: a.deThi.title,
    subjectName: a.deThi.subject.name,
    subjectSlug: a.deThi.subject.slug,
    score: a.score,
    totalQuestions: a.totalQuestions,
    percentage: a.percentage,
    completedAt: a.completedAt,
  }));

  return {
    totalAttempts,
    avgScore: Math.round(stats._avg.percentage ?? 0),
    bestScore: Math.round(stats._max.percentage ?? 0),
    bestSubject,
    recentAttempts: recent,
  };
}
