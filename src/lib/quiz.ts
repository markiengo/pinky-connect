"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export interface QuizQuestion {
  id: string;
  type: "mcq" | "essay";
  content: string;
  options: string[] | null;
  correctAnswer: string;
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
      questions: {
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
    questions: deThi.questions.map((q) => ({
      id: q.id,
      type: q.type as "mcq" | "essay",
      content: q.content,
      options: q.options ? (JSON.parse(q.options) as string[]) : null,
      correctAnswer: q.correctAnswer,
      orderIndex: q.orderIndex,
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
  answers: AnswerSubmission[]
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

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: session.userId,
      deThiId: deThi.id,
      subjectId: deThi.subjectId,
      score: correctCount,
      totalQuestions,
      percentage,
    },
  });

  for (const answer of answers) {
    await prisma.quizAnswer.create({
      data: {
        attemptId: attempt.id,
        questionId: answer.questionId,
        userAnswer: answer.userAnswer,
        isCorrect: answer.isCorrect,
      },
    });
  }

  return {
    attemptId: attempt.id,
    score: correctCount,
    total: totalQuestions,
    percentage,
  };
}

export async function getAvailableDeThi() {
  const deThiList = await prisma.deThi.findMany({
    include: {
      subject: true,
      _count: { select: { questions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return deThiList.map((d) => ({
    id: d.id,
    title: d.title,
    source: d.source,
    subjectName: d.subject.name,
    subjectSlug: d.subject.slug,
    questionCount: d._count.questions,
    tags: JSON.parse(d.tags) as string[],
  }));
}
