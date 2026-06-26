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
  bestSubject: string | null;
  recentAttempts: HistoryEntry[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const session = await getSession();
  if (!session) {
    return { totalAttempts: 0, avgScore: 0, bestSubject: null, recentAttempts: [] };
  }

  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: session.userId },
    include: {
      deThi: { include: { subject: true } },
    },
    orderBy: { completedAt: "desc" },
  });

  if (attempts.length === 0) {
    return { totalAttempts: 0, avgScore: 0, bestSubject: null, recentAttempts: [] };
  }

  const avgScore = Math.round(
    attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length
  );

  const bySubject = new Map<string, { name: string; total: number; count: number }>();
  for (const a of attempts) {
    const key = a.subjectId;
    const existing = bySubject.get(key);
    if (existing) {
      existing.total += a.percentage;
      existing.count += 1;
    } else {
      bySubject.set(key, { name: a.deThi.subject.name, total: a.percentage, count: 1 });
    }
  }

  let bestSubject: string | null = null;
  let bestAvg = 0;
  for (const [, v] of bySubject) {
    const avg = v.total / v.count;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestSubject = v.name;
    }
  }

  const recentAttempts = attempts.slice(0, 5).map((a) => ({
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

  return { totalAttempts: attempts.length, avgScore, bestSubject, recentAttempts };
}
