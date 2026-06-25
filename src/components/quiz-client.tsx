"use client";

import { useState, useCallback } from "react";
import { RenderedContent } from "@/components/rendered-content";
import { saveQuizAttempt, type QuizQuestion, type AnswerSubmission } from "@/lib/quiz";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, BookOpen } from "lucide-react";
import Link from "next/link";

interface QuizClientProps {
  deThiId: string;
  title: string;
  subjectName: string;
  questions: QuizQuestion[];
}

type Phase = "answering" | "feedback" | "essay-revealed" | "complete";

interface AnswerRecord {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean | null;
}

export function QuizClient({ deThiId, title, subjectName, questions }: QuizClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [essayAnswer, setEssayAnswer] = useState("");
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; total: number; percentage: number } | null>(null);

  const question = questions[currentIndex];
  const progress = ((currentIndex + (phase !== "answering" ? 1 : 0)) / questions.length) * 100;

  const handleMCQSelect = useCallback(
    (index: number) => {
      if (phase !== "answering") return;
      setSelectedOption(index);
      const isCorrect = question.options?.[index] === question.correctAnswer;
      setPhase("feedback");
      setAnswers((prev) => [
        ...prev,
        {
          questionId: question.id,
          userAnswer: question.options?.[index] ?? "",
          isCorrect,
        },
      ]);
    },
    [phase, question]
  );

  const handleEssaySubmit = useCallback(() => {
    if (phase !== "answering" || !essayAnswer.trim()) return;
    setPhase("essay-revealed");
    setAnswers((prev) => [
      ...prev,
      {
        questionId: question.id,
        userAnswer: essayAnswer.trim(),
        isCorrect: null,
      },
    ]);
  }, [phase, essayAnswer, question]);

  const handleNext = useCallback(async () => {
    if (currentIndex + 1 >= questions.length) {
      // Quiz complete — save attempt
      setSaving(true);
      setSaveError(null);
      const submissions: AnswerSubmission[] = answers;
      const res = await saveQuizAttempt(deThiId, submissions);
      setSaving(false);
      if ("error" in res) {
        setSaveError(res.error);
        return;
      }
      setResult({ score: res.score, total: res.total, percentage: res.percentage });
      setPhase("complete");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setEssayAnswer("");
      setPhase("answering");
    }
  }, [currentIndex, questions.length, answers, deThiId]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setEssayAnswer("");
    setAnswers([]);
    setPhase("answering");
    setResult(null);
    setSaveError(null);
  }, []);

  // ── Completion screen ──
  if (phase === "complete" && result) {
    const mcqCount = answers.filter((a) => a.isCorrect !== null).length;
    const correctCount = answers.filter((a) => a.isCorrect === true).length;
    const isGoodScore = result.percentage >= 70;

    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-surface rounded-card shadow-[var(--shadow-panel)] p-8 text-center">
          <div
            className={`grid place-items-center w-16 h-16 rounded-2xl mx-auto mb-4 ${
              isGoodScore ? "bg-good text-good-ink" : "bg-c-pink text-ink"
            }`}
          >
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight mb-2">
            Hoàn thành bài thi!
          </h2>

          <p className="font-serif text-3xl font-semibold mb-1">
            Bạn đúng {correctCount}/{mcqCount} câu
          </p>
          <p className="text-sm font-semibold text-text-muted mb-6">
            ({answers.length} câu tổng cộng · {result.percentage}%)
          </p>

          {/* Score bar */}
          <div className="h-3 rounded-full bg-surface-2 overflow-hidden mb-6">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isGoodScore ? "bg-good" : "bg-accent-pink"
              }`}
              style={{ width: `${result.percentage}%` }}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-pill bg-ink text-on-ink text-sm font-extrabold transition-all hover:-translate-y-px hover:shadow-[var(--shadow-pop)]"
            >
              <RotateCcw className="w-4 h-4" />
              Làm lại
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-pill bg-surface border border-line text-sm font-extrabold transition-all hover:-translate-y-px hover:shadow-[var(--shadow-pop)]"
            >
              <BookOpen className="w-4 h-4" />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (saveError) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-bad/30 border border-bad/40 rounded-card p-6 text-center">
          <p className="font-bold text-bad-ink mb-2">{saveError}</p>
          <button
            onClick={handleNext}
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-pill bg-ink text-on-ink text-sm font-extrabold"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // ── Question display ──
  return (
    <div className="max-w-2xl">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-ink/70">
            Câu {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-xs font-bold text-text-muted">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-surface-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent-pink transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-surface rounded-card shadow-[var(--shadow-soft)] p-6 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-pill bg-surface-2 text-[10px] font-extrabold text-text-muted uppercase tracking-wide">
            {question.type === "mcq" ? "Trắc nghiệm" : "Tự luận"}
          </span>
        </div>

        <div className="text-[15px] leading-relaxed">
          <RenderedContent content={question.content} />
        </div>
      </div>

      {/* MCQ options */}
      {question.type === "mcq" && question.options && (
        <div className="space-y-2.5 mb-4">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = option === question.correctAnswer;
            const showFeedback = phase === "feedback";

            let optionClass =
              "bg-surface border-line hover:border-accent-pink/50 hover:-translate-y-px";

            if (showFeedback && isCorrect) {
              optionClass = "bg-good/20 border-good text-good-ink";
            } else if (showFeedback && isSelected && !isCorrect) {
              optionClass = "bg-bad/20 border-bad text-bad-ink";
            } else if (showFeedback) {
              optionClass = "bg-surface border-line opacity-60";
            }

            return (
              <button
                key={index}
                onClick={() => handleMCQSelect(index)}
                disabled={phase !== "answering"}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${optionClass} ${
                  phase === "answering" ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex-shrink-0 grid place-items-center w-7 h-7 rounded-full text-xs font-extrabold ${
                      showFeedback && isCorrect
                        ? "bg-good text-good-ink"
                        : showFeedback && isSelected && !isCorrect
                          ? "bg-bad text-bad-ink"
                          : "bg-surface-2 text-ink/60"
                    }`}
                  >
                    {showFeedback && isCorrect ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : showFeedback && isSelected && !isCorrect ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </span>
                  <div className="flex-1 text-sm font-medium leading-relaxed pt-0.5">
                    <RenderedContent content={option} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Essay input */}
      {question.type === "essay" && (
        <div className="mb-4">
          {phase === "answering" && (
            <>
              <textarea
                value={essayAnswer}
                onChange={(e) => setEssayAnswer(e.target.value)}
                placeholder="Nhập câu trả lời của bạn..."
                rows={6}
                className="w-full p-4 rounded-2xl bg-surface border-2 border-line text-sm font-medium leading-relaxed outline-none transition-all focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/30 resize-y"
              />
              <button
                onClick={handleEssaySubmit}
                disabled={!essayAnswer.trim()}
                className="mt-3 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-pill bg-ink text-on-ink text-sm font-extrabold transition-all hover:-translate-y-px hover:shadow-[var(--shadow-pop)] disabled:opacity-50 disabled:translate-y-0"
              >
                Nộp câu trả lời
              </button>
            </>
          )}

          {phase === "essay-revealed" && (
            <div className="space-y-4">
              {/* User's answer */}
              <div className="rounded-2xl border-2 border-line bg-surface p-4">
                <p className="text-xs font-extrabold text-text-muted uppercase tracking-wide mb-2">
                  Câu trả lời của bạn
                </p>
                <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {essayAnswer}
                </div>
              </div>

              {/* Model answer */}
              <div className="rounded-2xl border-2 border-good/40 bg-good/10 p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-good-ink" />
                  <p className="text-xs font-extrabold text-good-ink uppercase tracking-wide">
                    Đáp án mẫu
                  </p>
                </div>
                <div className="text-sm font-medium leading-relaxed">
                  <RenderedContent content={question.correctAnswer} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MCQ feedback: show correct answer if wrong */}
      {phase === "feedback" && question.type === "mcq" && selectedOption !== null && (
        <div className="mb-4">
          {question.options?.[selectedOption] === question.correctAnswer ? (
            <div className="rounded-2xl border-2 border-good/40 bg-good/10 p-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-good-ink flex-shrink-0" />
              <p className="text-sm font-bold text-good-ink">Chính xác!</p>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-bad/40 bg-bad/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-bad-ink flex-shrink-0" />
                <p className="text-sm font-bold text-bad-ink">Chưa đúng. Đáp án đúng là:</p>
              </div>
              <div className="text-sm font-medium leading-relaxed pl-7">
                <RenderedContent content={question.correctAnswer} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Next button */}
      {phase !== "answering" && (
        <button
          onClick={handleNext}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-pill bg-ink text-on-ink text-sm font-extrabold transition-all hover:-translate-y-px hover:shadow-[var(--shadow-pop)] disabled:opacity-60"
        >
          {saving
            ? "Đang lưu..."
            : currentIndex + 1 >= questions.length
              ? "Xem kết quả"
              : "Câu tiếp theo"}
          {!saving && <ArrowRight className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
