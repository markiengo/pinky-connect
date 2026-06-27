"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export interface QuizQuestion {
  id: string;
  type: "mcq" | "essay";
  content: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string;
  orderIndex: number;
}

export interface QuizData {
  deThiId: string;
  title: string;
  subjectName: string;
  subjectSlug: string;
  source: string;
  questions: QuizQuestion[];
}

export async function getQuizData(deThiId: string): Promise<QuizData | null> {
  const deThi = await prisma.deThi.findUnique({
    where: { id: deThiId },
    include: {
      subject: true,
      deThiQuestions: {
        include: { question: true },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!deThi) return null;

  return {
    deThiId: deThi.id,
    title: deThi.title,
    subjectName: deThi.subject.name,
    subjectSlug: deThi.subject.slug,
    source: deThi.source,
    questions: deThi.deThiQuestions.map((dq) => ({
      id: dq.question.id,
      type: dq.question.type as "mcq" | "essay",
      content: dq.question.content,
      options: dq.question.options ? (JSON.parse(dq.question.options) as string[]) : null,
      correctAnswer: dq.question.correctAnswer,
      explanation: dq.question.explanation,
      orderIndex: dq.orderIndex,
    })),
  };
}

export interface AnswerSubmission {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean | null;
}

export async function saveQuizAttempt(
  deThiId: string,
  answers: AnswerSubmission[],
  mode: "practice" | "test" = "practice"
): Promise<{ attemptId: string; score: number; total: number; percentage: number } | { error: string }> {
  const session = await getSession();
  if (!session) {
    return { error: "Bạn cần đăng nhập để lưu kết quả." };
  }

  const deThi = await prisma.deThi.findUnique({
    where: { id: deThiId },
    include: { subject: true },
  });

  if (!deThi) {
    return { error: "Đề thi không tồn tại." };
  }

  const mcqAnswers = answers.filter((a) => a.isCorrect !== null);
  const correctCount = mcqAnswers.filter((a) => a.isCorrect === true).length;
  const totalQuestions = answers.length;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const attempt = await prisma.$transaction(async (tx) => {
    const createdAttempt = await tx.quizAttempt.create({
      data: {
        userId: session.userId,
        deThiId: deThi.id,
        subjectId: deThi.subjectId,
        mode,
        score: correctCount,
        totalQuestions,
        percentage,
      },
    });

    if (answers.length > 0) {
      await tx.quizAnswer.createMany({
        data: answers.map((answer) => ({
          attemptId: createdAttempt.id,
          questionId: answer.questionId,
          userAnswer: answer.userAnswer,
          isCorrect: answer.isCorrect,
        })),
      });
    }

    return createdAttempt;
  });

  return {
    attemptId: attempt.id,
    score: correctCount,
    total: totalQuestions,
    percentage,
  };
}

export async function getAvailableDeThi() {
  const [deThiList, subjects, counts] = await Promise.all([
    prisma.deThi.findMany({
      include: {
        subject: true,
        _count: { select: { deThiQuestions: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.subject.findMany({ orderBy: { name: "asc" } }),
    prisma.deThi.groupBy({
      by: ["subjectId"],
      _count: { id: true },
    }),
  ]);

  const countBySubjectId = Object.fromEntries(
    counts.map((c) => [c.subjectId, c._count.id]),
  );

  return {
    deThi: deThiList.map((d) => ({
      id: d.id,
      title: d.title,
      source: d.source,
      subjectName: d.subject.name,
      subjectSlug: d.subject.slug,
      questionCount: d._count.deThiQuestions,
      tags: JSON.parse(d.tags) as string[],
    })),
    subjects: subjects.map((s) => ({
      slug: s.slug,
      label: s.name,
      count: countBySubjectId[s.id] || 0,
    })),
  };
}
