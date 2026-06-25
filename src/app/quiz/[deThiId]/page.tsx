import { notFound } from "next/navigation";
import { getQuizData } from "@/lib/quiz";
import { AppShell } from "@/components/app-shell";
import { QuizClient } from "@/components/quiz-client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ deThiId: string }>;
}) {
  const { deThiId } = await params;
  const quiz = await getQuizData(deThiId);

  if (!quiz) {
    notFound();
  }

  return (
    <AppShell>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-text-muted hover:text-ink transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </Link>

      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-c-lilac text-[11px] font-extrabold text-ink mb-2">
          {quiz.subjectName}
        </span>
        <h1 className="font-display text-2xl font-bold tracking-tight leading-tight">
          {quiz.title}
        </h1>
        {quiz.source && (
          <p className="mt-1 text-sm text-text-muted font-medium">{quiz.source}</p>
        )}
      </div>

      <QuizClient
        deThiId={quiz.deThiId}
        title={quiz.title}
        subjectName={quiz.subjectName}
        questions={quiz.questions}
      />
    </AppShell>
  );
}
