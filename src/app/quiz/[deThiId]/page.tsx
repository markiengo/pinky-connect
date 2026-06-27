import { notFound, redirect } from "next/navigation";
import { getQuizData } from "@/lib/quiz";
import { getPreviousAttempt, type PreviousAttempt } from "@/lib/history";
import { AppShell } from "@/components/app-shell";
import { QuizClient } from "@/components/quiz-client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/session";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ deThiId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { deThiId } = await params;
  const quiz = await getQuizData(deThiId);

  if (!quiz) {
    notFound();
  }

  const previousAttempt = await getPreviousAttempt(deThiId);

  return (
    <AppShell username={session.username}>
      <Link
        href="/library"
        className="inline-flex items-center gap-1.5 font-sans font-medium text-[13px] mb-4 transition-colors"
        style={{ color: "var(--muted-foreground)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại thư viện
      </Link>

      <div className="mb-6">
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full font-sans font-medium text-[11px] uppercase tracking-wider mb-2"
          style={{
            background: "rgba(244,137,154,0.12)",
            color: "#F4899A",
          }}
        >
          {quiz.subjectName}
        </span>
        <h1
          className="font-serif font-normal leading-tight tracking-[-0.01em]"
          style={{ fontSize: "clamp(22px, 3vw, 28px)", color: "var(--foreground)" }}
        >
          {quiz.title}
        </h1>
        {quiz.source && (
          <p
            className="mt-1 font-sans font-medium text-[13px]"
            style={{ color: "var(--muted-foreground)" }}
          >
            {quiz.source}
          </p>
        )}
      </div>

      <QuizClient
        deThiId={quiz.deThiId}
        title={quiz.title}
        subjectName={quiz.subjectName}
        questions={quiz.questions}
        previousAttempt={previousAttempt as PreviousAttempt | null}
      />
    </AppShell>
  );
}
