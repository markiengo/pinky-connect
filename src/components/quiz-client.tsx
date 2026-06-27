"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { RenderedContent } from "@/components/rendered-content";
import { saveQuizAttempt, type QuizQuestion, type AnswerSubmission } from "@/lib/quiz";
import type { PreviousAttempt } from "@/lib/history";
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw, Trophy, BookOpen, History, ChevronDown, ChevronUp, Clock, PencilLine, ClipboardCheck } from "lucide-react";
import Link from "next/link";

interface QuizClientProps {
  deThiId: string;
  title: string;
  subjectName: string;
  questions: QuizQuestion[];
  previousAttempt?: PreviousAttempt | null;
}

type Phase = "mode-selection" | "answering" | "feedback" | "essay-revealed" | "complete" | "review";
type QuizMode = "practice" | "test";

interface AnswerRecord {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean | null;
}

export function QuizClient({ deThiId, questions, previousAttempt }: QuizClientProps) {
  const [mode, setMode] = useState<QuizMode | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("mode-selection");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [essayAnswer, setEssayAnswer] = useState("");
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [submitWarning, setSubmitWarning] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; total: number; percentage: number } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyDismissed, setHistoryDismissed] = useState(false);

  // Test mode timer
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(45);
  const totalTimeSeconds = timeLimitMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(totalTimeSeconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isTestMode = mode === "test";

  // Start timer when entering test mode answering
  useEffect(() => {
    if (isTestMode && phase === "answering") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isTestMode, phase]);

  const question = questions[currentIndex];
  const progress = ((currentIndex + (phase !== "answering" ? 1 : 0)) / questions.length) * 100;
  const answeredIds = new Set(answers.map((a) => a.questionId));

  const handleMCQSelect = useCallback(
    (index: number) => {
      if (phase !== "answering") return;
      setSelectedOption(index);
      setSubmitWarning(null);
      // In test mode, immediately save answer (no confirm step)
      if (isTestMode) {
        const isCorrect = question.options?.[index] === question.correctAnswer;
        setAnswers((prev) => {
          const filtered = prev.filter((a) => a.questionId !== question.id);
          return [...filtered, {
            questionId: question.id,
            userAnswer: question.options?.[index] ?? "",
            isCorrect,
          }];
        });
      }
    },
    [phase, isTestMode, question]
  );

  const handleConfirmMCQ = useCallback(() => {
    if (phase !== "answering" || selectedOption === null) return;
    const isCorrect = question.options?.[selectedOption] === question.correctAnswer;
    setPhase("feedback");
    setAnswers((prev) => {
      if (prev.some((a) => a.questionId === question.id)) return prev;
      return [
        ...prev,
        {
          questionId: question.id,
          userAnswer: question.options?.[selectedOption] ?? "",
          isCorrect,
        },
      ];
    });
  }, [phase, selectedOption, question]);

  const handleTestSubmit = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSaving(true);
    setSaveError(null);
    // Fill in unanswered questions
    const allAnswers: AnswerSubmission[] = questions.map((q) => {
      const existing = answers.find((a) => a.questionId === q.id);
      if (existing) return existing;
      return { questionId: q.id, userAnswer: "", isCorrect: q.type === "mcq" ? false : null };
    });
    const res = await saveQuizAttempt(deThiId, allAnswers, "test");
    setSaving(false);
    if ("error" in res) {
      setSaveError(res.error);
      return;
    }
    setResult({ score: res.score, total: res.total, percentage: res.percentage });
    setPhase("complete");
  }, [answers, questions, deThiId]);

  const allAnswered = answers.length === questions.length;

  const handleTestSubmitClick = useCallback(() => {
    if (!allAnswered) {
      setSubmitWarning(`Bạn cần trả lời tất cả câu hỏi trước khi nộp bài. Còn ${questions.length - answers.length} câu chưa trả lời.`);
      return;
    }
    setSubmitWarning(null);
    handleTestSubmit();
  }, [allAnswered, handleTestSubmit, questions.length, answers.length]);

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (isTestMode && phase === "answering" && timeLeft === 0) {
      handleTestSubmit();
    }
  }, [isTestMode, phase, timeLeft, handleTestSubmit]);

  const handleEssaySubmit = useCallback(() => {
    if (phase !== "answering" || !essayAnswer.trim()) return;
    setSubmitWarning(null);
    if (isTestMode) {
      // In test mode, just save the answer without revealing
      setAnswers((prev) => {
        const filtered = prev.filter((a) => a.questionId !== question.id);
        return [...filtered, {
          questionId: question.id,
          userAnswer: essayAnswer.trim(),
          isCorrect: null,
        }];
      });
      setEssayAnswer("");
      return;
    }
    setPhase("essay-revealed");
    setAnswers((prev) => [
      ...prev,
      {
        questionId: question.id,
        userAnswer: essayAnswer.trim(),
        isCorrect: null,
      },
    ]);
  }, [phase, essayAnswer, question, isTestMode]);

  const handleNext = useCallback(async () => {
    if (phase === "review") {
      if (currentIndex + 1 >= questions.length) {
        setPhase("complete");
      } else {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        const nextQ = questions[nextIdx];
        const nextAns = answers.find((a) => a.questionId === nextQ.id);
        if (nextQ.type === "mcq" && nextQ.options && nextAns) {
          const optIdx = nextQ.options.indexOf(nextAns.userAnswer);
          setSelectedOption(optIdx >= 0 ? optIdx : null);
        } else {
          setSelectedOption(null);
        }
      }
      return;
    }
    if (currentIndex + 1 >= questions.length) {
      setSaving(true);
      setSaveError(null);
      const submissions: AnswerSubmission[] = answers;
      const res = await saveQuizAttempt(deThiId, submissions, mode ?? "practice");
      setSaving(false);
      if ("error" in res) {
        setSaveError(res.error);
        return;
      }
      setResult({ score: res.score, total: res.total, percentage: res.percentage });
      setPhase("complete");
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      const nextQ = questions[nextIdx];
      const nextAns = answers.find((a) => a.questionId === nextQ.id);
      if (nextQ.type === "mcq" && nextQ.options && nextAns) {
        const optIdx = nextQ.options.indexOf(nextAns.userAnswer);
        setSelectedOption(optIdx >= 0 ? optIdx : null);
      } else {
        setSelectedOption(null);
      }
      setEssayAnswer("");
      setPhase("answering");
    }
  }, [phase, currentIndex, questions.length, answers, deThiId, mode, questions]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      const prevAnswer = answers.find((a) => a.questionId === questions[prevIdx]?.id);
      if (prevAnswer) {
        if (questions[prevIdx].type === "mcq" && questions[prevIdx].options) {
          const optIdx = questions[prevIdx].options!.indexOf(prevAnswer.userAnswer);
          setSelectedOption(optIdx >= 0 ? optIdx : null);
        }
        if (phase === "review") {
          setPhase("review");
        } else if (isTestMode) {
          setPhase("answering");
        } else {
          setPhase(questions[prevIdx].type === "mcq" ? "feedback" : "essay-revealed");
        }
      } else {
        setSelectedOption(null);
        setEssayAnswer("");
        setPhase("answering");
      }
    }
  }, [currentIndex, answers, questions, isTestMode, phase]);

  const handleJumpTo = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      const targetQuestion = questions[index];
      const existingAnswer = answers.find((a) => a.questionId === targetQuestion.id);
      if (existingAnswer) {
        if (targetQuestion.type === "mcq" && targetQuestion.options) {
          const optIdx = targetQuestion.options!.indexOf(existingAnswer.userAnswer);
          setSelectedOption(optIdx >= 0 ? optIdx : null);
        }
        if (phase === "review") {
          setPhase("review");
        } else if (isTestMode) {
          setPhase("answering");
        } else {
          setPhase(targetQuestion.type === "mcq" ? "feedback" : "essay-revealed");
        }
      } else {
        setSelectedOption(null);
        setEssayAnswer("");
        setPhase("answering");
      }
    },
    [answers, questions, isTestMode, phase]
  );

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setEssayAnswer("");
    setAnswers([]);
    setPhase("answering");
    setResult(null);
    setSaveError(null);
    setSubmitWarning(null);
    setTimeLeft(timeLimitMinutes * 60);
  }, [timeLimitMinutes]);

  // ── Mode selection screen ──
  if (phase === "mode-selection") {
    return (
      <div className="max-w-[640px] mx-auto">
        {/* Previous attempt summary */}
        {previousAttempt && !historyDismissed && (
          <div
            className="rounded-[16px] mb-6 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(159,122,234,0.06) 0%, rgba(244,137,154,0.04) 100%)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="grid place-items-center w-9 h-9 rounded-[10px] flex-shrink-0"
                  style={{ background: "rgba(159,122,234,0.12)" }}
                >
                  <History className="w-4 h-4" style={{ color: "#7C6FDB" }} />
                </div>
                <div>
                  <p className="font-sans font-bold text-[14px]" style={{ color: "var(--foreground)" }}>
                    Lần làm gần nhất
                  </p>
                  <p className="font-sans text-[12px]" style={{ color: "var(--muted-foreground)" }}>
                    {previousAttempt.score}/{previousAttempt.totalQuestions} đúng &middot; {Math.round(previousAttempt.percentage)}%
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHistoryDismissed(true)}
                className="font-sans font-semibold text-[12px] rounded-[8px] px-3 py-2 transition-colors"
                style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
              >
                Bỏ qua
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h2
            className="font-serif font-normal mb-2"
            style={{ fontSize: "28px", color: "var(--foreground)" }}
          >
            Chọn chế độ làm bài
          </h2>
          <p
            className="font-sans"
            style={{ fontSize: "15px", color: "var(--muted-foreground)" }}
          >
            Bạn muốn làm bài này theo cách nào?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Practice mode card */}
          <button
            onClick={() => {
              setMode("practice");
              setPhase("answering");
            }}
            className="group rounded-[16px] p-6 text-left transition-transform duration-300 hover:-translate-y-[4px] btn-press float-reveal glass-card-pink"
            style={{ animationDelay: "0ms" }}
          >
            <div
              className="grid place-items-center w-12 h-12 rounded-[12px] mb-4"
              style={{ background: "rgba(244,137,154,0.12)" }}
            >
              <BookOpen className="w-6 h-6" style={{ color: "#F4899A" }} />
            </div>
            <h3
              className="font-sans font-bold mb-2"
              style={{ fontSize: "18px", color: "var(--foreground)" }}
            >
              Practice Mode
            </h3>
            <p
              className="font-sans leading-[1.6] mb-4"
              style={{ fontSize: "14px", color: "var(--muted-foreground)" }}
            >
              Làm từng câu, xem đáp án và lời giải ngay sau khi xác nhận. Học qua từng bước.
            </p>
            <span
              className="font-sans font-semibold text-[13px] inline-flex items-center gap-1.5 transition-[gap] duration-200 group-hover:gap-2"
              style={{ color: "#F4899A" }}
            >
              Bắt đầu luyện tập
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>

          {/* Test mode card */}
          <div
            className="group rounded-[16px] p-6 text-left transition-transform duration-300 hover:-translate-y-[4px] btn-press float-reveal glass-card-pink"
            style={{ animationDelay: "80ms" }}
          >
            <div
              className="grid place-items-center w-12 h-12 rounded-[12px] mb-4"
              style={{ background: "rgba(124,111,219,0.12)" }}
            >
              <ClipboardCheck className="w-6 h-6" style={{ color: "#7C6FDB" }} />
            </div>
            <h3
              className="font-sans font-bold mb-2"
              style={{ fontSize: "18px", color: "var(--foreground)" }}
            >
              Test Mode
            </h3>
            <p
              className="font-sans leading-[1.6] mb-4"
              style={{ fontSize: "14px", color: "var(--muted-foreground)" }}
            >
              Làm toàn bộ đề thi trong thời gian giới hạn. Xem kết quả và lời giải sau khi nộp bài.
            </p>

            {/* Time limit selector */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4" style={{ color: "#7C6FDB" }} />
                <span className="font-sans font-medium text-[13px]" style={{ color: "#7C6FDB" }}>
                  Thời gian làm bài
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {[40, 45, 50, 55, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      setTimeLimitMinutes(mins);
                      setTimeLeft(mins * 60);
                    }}
                    className="font-sans font-semibold text-[13px] rounded-full px-3.5 py-1.5 transition-[background,color,box-shadow] duration-150 btn-press"
                    style={
                      timeLimitMinutes === mins
                        ? {
                            background: "#7C6FDB",
                            color: "#FFFFFF",
                            boxShadow: "0 4px 16px rgba(124,111,219,0.25)",
                          }
                        : {
                            background: "var(--card)",
                            color: "var(--foreground)",
                            border: "1px solid var(--border)",
                          }
                    }
                  >
                    {mins} phút
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setMode("test");
                setTimeLeft(timeLimitMinutes * 60);
                setPhase("answering");
              }}
              className="font-sans font-semibold text-[13px] inline-flex items-center gap-1.5 transition-[gap] duration-200 group-hover:gap-2"
              style={{ color: "#7C6FDB" }}
            >
              Bắt đầu thi
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Completion screen ──
  if (phase === "complete" && result) {
    const mcqCount = answers.filter((a) => a.isCorrect !== null).length;
    const correctCount = answers.filter((a) => a.isCorrect === true).length;
    const isGoodScore = result.percentage >= 70;

    return (
      <div className="max-w-[640px] mx-auto">
        <div className="rounded-[16px] p-8 text-center glass-card-pink float-reveal">
          <div
            className="grid place-items-center w-16 h-16 rounded-[12px] mx-auto mb-4"
            style={{
              background: isGoodScore ? "rgba(244,137,154,0.12)" : "rgba(244,137,154,0.12)",
            }}
          >
            <Trophy
              className="w-8 h-8"
              style={{ color: isGoodScore ? "#F4899A" : "#F4899A" }}
            />
          </div>

          <h2
            className="font-serif font-normal mb-2"
            style={{ fontSize: "28px", color: "var(--foreground)" }}
          >
            Hoàn thành bài thi!
          </h2>

          <p
            className="font-serif font-normal mb-1"
            style={{ fontSize: "24px", color: "var(--foreground)" }}
          >
            Bạn đúng {correctCount}/{mcqCount} câu
          </p>
          <p
            className="font-sans font-medium mb-6"
            style={{ fontSize: "14px", color: "var(--muted-foreground)" }}
          >
            ({answers.length} câu tổng cộng · {result.percentage}%)
          </p>

          {/* Score bar */}
          <div
            className="h-3 rounded-full overflow-hidden mb-6"
            style={{ background: "var(--secondary)" }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{
                width: `${result.percentage}%`,
                background: isGoodScore ? "#F4899A" : "#F4899A",
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isTestMode && (
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setPhase("review");
                }}
                className="font-sans font-semibold text-[14px] rounded-[12px] px-6 py-3 transition-transform duration-200 btn-press inline-flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #F4899A 0%, #7C6FDB 100%)", color: "#FFFFFF", boxShadow: "0 4px 16px rgba(244,137,154,0.25)" }}
              >
                <BookOpen className="w-4 h-4" />
                Xem đáp án
              </button>
            )}
            <button
              onClick={handleRestart}
              className="font-sans font-semibold text-[14px] rounded-[12px] px-6 py-3 transition-transform duration-200 btn-press inline-flex items-center justify-center gap-2 glass-card"
              style={{ color: "var(--foreground)" }}
            >
              <RotateCcw className="w-4 h-4" />
              Làm lại
            </button>
            <Link
              href="/dashboard"
              className="font-sans font-semibold text-[14px] rounded-[12px] px-6 py-3 transition-transform duration-200 btn-press inline-flex items-center justify-center gap-2 glass-card"
              style={{ color: "var(--foreground)" }}
            >
              <BookOpen className="w-4 h-4" />
              Về dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (saveError) {
    return (
      <div className="max-w-[640px] mx-auto">
        <div className="rounded-[16px] p-6 text-center glass-card-pink float-reveal">
          <p
            className="font-sans font-semibold mb-3"
            style={{ fontSize: "14px", color: "#F4899A" }}
          >
            {saveError}
          </p>
          <button
            onClick={handleNext}
            className="font-sans font-semibold text-[14px] rounded-[12px] px-5 py-2.5 btn-press"
            style={{ background: "linear-gradient(135deg, #F4899A 0%, #7C6FDB 100%)", color: "#FFFFFF" }}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // ── Question display with desktop right panel ──
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
      {/* ── Main question area ── */}
      <div className="min-w-0">
        {/* Previous attempt summary */}
        {previousAttempt && !historyDismissed && (
          <div
            className="rounded-[16px] mb-6 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(159,122,234,0.06) 0%, rgba(244,137,154,0.04) 100%)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="grid place-items-center w-9 h-9 rounded-[10px] flex-shrink-0"
                  style={{ background: "rgba(159,122,234,0.12)" }}
                >
                  <History className="w-4 h-4" style={{ color: "#7C6FDB" }} />
                </div>
                <div>
                  <p className="font-sans font-bold text-[14px]" style={{ color: "var(--foreground)" }}>
                    Lần làm gần nhất
                  </p>
                  <p className="font-sans text-[12px]" style={{ color: "var(--muted-foreground)" }}>
                    {previousAttempt.score}/{previousAttempt.totalQuestions} đúng &middot; {Math.round(previousAttempt.percentage)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHistory((v) => !v)}
                  className="font-sans font-semibold text-[12px] rounded-[8px] px-3 py-2 transition-colors inline-flex items-center gap-1.5"
                  style={{ background: "rgba(159,122,234,0.08)", color: "#7C6FDB" }}
                >
                  {showHistory ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      Ẩn chi tiết
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      Xem chi tiết
                    </>
                  )}
                </button>
                <button
                  onClick={() => setHistoryDismissed(true)}
                  className="font-sans font-semibold text-[12px] rounded-[8px] px-3 py-2 transition-colors"
                  style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
                >
                  Bỏ qua
                </button>
              </div>
            </div>

            {/* Expandable detail */}
            {showHistory && (
              <div
                className="px-5 pb-5 pt-1 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <p className="font-sans font-semibold text-[12px] uppercase tracking-wider mb-3 mt-3" style={{ color: "var(--muted-foreground)" }}>
                  Kết quả từng câu
                </p>
                <div className="space-y-2">
                  {questions.map((q, i) => {
                    const prevAnswer = previousAttempt.answers.find((a) => a.questionId === q.id);
                    const isCorrect = prevAnswer?.isCorrect === true;
                    const isWrong = prevAnswer?.isCorrect === false;
                    const isEssay = prevAnswer?.isCorrect === null;

                    return (
                      <button
                        key={q.id}
                        onClick={() => handleJumpTo(i)}
                        className="w-full flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition-colors text-left"
                        style={{ background: "var(--card)" }}
                      >
                        <span
                          className="flex-shrink-0 grid place-items-center w-7 h-7 rounded-full font-sans font-bold text-[11px]"
                          style={{
                            background: isCorrect
                              ? "rgba(91,140,90,0.12)"
                              : isWrong
                                ? "rgba(192,86,86,0.12)"
                                : isEssay
                                  ? "rgba(159,122,234,0.12)"
                                  : "var(--secondary)",
                            color: isCorrect
                              ? "#5B8C5A"
                              : isWrong
                                ? "#C05656"
                                : isEssay
                                  ? "#7C6FDB"
                                  : "var(--muted-foreground)",
                          }}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : isWrong ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            i + 1
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans font-medium text-[13px] truncate" style={{ color: "var(--foreground)" }}>
                            Câu {i + 1}
                          </p>
                          <p className="font-sans text-[11px] truncate" style={{ color: "var(--muted-foreground)" }}>
                            {isCorrect
                              ? "Đúng"
                              : isWrong
                                ? `Sai - đã chọn: ${prevAnswer?.userAnswer || "(trống)"}`
                                : isEssay
                                  ? "Tự luận - đã nộp"
                                  : "Chưa trả lời"}
                          </p>
                        </div>
                        <span
                          className="flex-shrink-0 font-sans font-semibold text-[11px] px-2 py-1 rounded-full"
                          style={{
                            background: isCorrect
                              ? "rgba(91,140,90,0.10)"
                              : isWrong
                                ? "rgba(192,86,86,0.10)"
                                : isEssay
                                  ? "rgba(159,122,234,0.10)"
                                  : "var(--secondary)",
                            color: isCorrect
                              ? "#5B8C5A"
                              : isWrong
                                ? "#C05656"
                                : isEssay
                                  ? "#7C6FDB"
                                  : "var(--muted-foreground)",
                          }}
                        >
                          {isCorrect ? "Đúng" : isWrong ? "Sai" : isEssay ? "Tự luận" : "Bỏ qua"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progress bar + timer */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span
              className="font-sans font-semibold text-[13px]"
              style={{ color: "var(--foreground)" }}
            >
              Câu {currentIndex + 1} / {questions.length}
            </span>
            <div className="flex items-center gap-3">
              {isTestMode && phase === "answering" && (
                <span
                  className="font-sans font-semibold text-[13px] inline-flex items-center gap-1.5"
                  style={{ color: timeLeft < 60 ? "#C05656" : "#7C6FDB" }}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                </span>
              )}
              <span
                className="font-sans font-medium text-[12px]"
                style={{ color: "var(--muted-foreground)" }}
              >
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "var(--secondary)" }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-300 dream-progress"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-[16px] p-8 mb-4 glass-card-pink">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="font-sans font-medium text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{
                background: question.type === "mcq" ? "rgba(244,137,154,0.12)" : "rgba(244,137,154,0.12)",
                color: question.type === "mcq" ? "#F4899A" : "#F4899A",
              }}
            >
              {question.type === "mcq" ? "Trắc nghiệm" : "Tự luận"}
            </span>
          </div>

          <div
            className="font-serif leading-[1.7]"
            style={{ fontSize: "19px", color: "var(--foreground)", fontFamily: '"EB Garamond", Garamond, serif' }}
          >
            <RenderedContent content={question.content} />
          </div>
        </div>

        {/* MCQ options */}
        {question.type === "mcq" && question.options && (
          <div className="space-y-2.5 mb-4">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = option === question.correctAnswer;
              const showFeedback = phase === "feedback" || phase === "review";

              let bg = "var(--card)";
              let border = "var(--border)";
              let color = "var(--foreground)";

              if (showFeedback && isCorrect) {
                bg = "rgba(91,140,90,0.08)";
                border = "#5B8C5A";
                color = "#5B8C5A";
              } else if (showFeedback && isSelected && !isCorrect) {
                bg = "rgba(192,86,86,0.08)";
                border = "#C05656";
                color = "#C05656";
              } else if (showFeedback) {
                bg = "var(--card)";
                border = "var(--border)";
                color = "var(--muted-foreground)";
              } else if (isSelected) {
                bg = "rgba(159,122,234,0.06)";
                border = "#9F7AEA";
                color = "var(--foreground)";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleMCQSelect(index)}
                  disabled={phase !== "answering" && phase !== "review"}
                  className="w-full text-left p-4 rounded-[8px] border-2 transition-[background,border-color,color,opacity] duration-200 btn-press"
                  style={{
                    background: bg,
                    borderColor: border,
                    color: color,
                    cursor: phase === "answering" ? "pointer" : "default",
                    opacity: showFeedback && !isCorrect && !isSelected ? 0.6 : 1,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 grid place-items-center w-7 h-7 rounded-full font-sans font-bold text-[12px]"
                      style={{
                        background:
                          showFeedback && isCorrect
                            ? "#5B8C5A"
                            : showFeedback && isSelected && !isCorrect
                              ? "#C05656"
                              : "rgba(244,137,154,0.08)",
                        color:
                          showFeedback && (isCorrect || (isSelected && !isCorrect))
                            ? "var(--primary-foreground)"
                            : "var(--muted-foreground)",
                      }}
                    >
                      {showFeedback && isCorrect ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : showFeedback && isSelected && !isCorrect ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </span>
                    <div className="flex-1 font-sans font-medium leading-[1.5] pt-0.5" style={{ fontSize: "14px" }}>
                      <RenderedContent content={option} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* MCQ confirm button (practice mode only) */}
        {question.type === "mcq" && phase === "answering" && !isTestMode && (
          <div className="mb-4">
            <button
              onClick={handleConfirmMCQ}
              disabled={selectedOption === null}
              className="font-sans font-semibold text-[14px] rounded-[12px] px-6 py-3 transition-[background,box-shadow] duration-200 btn-press inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: selectedOption !== null ? "linear-gradient(135deg, #F4899A 0%, #7C6FDB 100%)" : "var(--secondary)", color: selectedOption !== null ? "#FFFFFF" : "var(--muted-foreground)", boxShadow: selectedOption !== null ? "0 4px 16px rgba(244,137,154,0.25)" : "none" }}
            >
              <CheckCircle2 className="w-4 h-4" />
              Xác nhận
            </button>
          </div>
        )}

        {/* MCQ inline explanation box (after submit or in review) */}
        {question.type === "mcq" && (phase === "feedback" || phase === "review") && selectedOption !== null && (
          <div className="mb-4 rounded-[16px] p-6 float-reveal" style={{ background: "var(--card)", border: "2px solid rgba(244,137,154,0.2)" }}>
            {/* Correct/incorrect banner */}
            {question.options?.[selectedOption] === question.correctAnswer ? (
              <div
                className="rounded-[12px] p-4 mb-5 flex items-center gap-3"
                style={{ background: "rgba(244,137,154,0.08)", border: "1px solid rgba(244,137,154,0.2)" }}
              >
                <div
                  className="grid place-items-center w-10 h-10 rounded-full flex-shrink-0"
                  style={{ background: "#F4899A" }}
                >
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-sans font-bold text-[16px]" style={{ color: "#F4899A" }}>
                    Chính xác!
                  </p>
                  <p className="font-sans text-[13px]" style={{ color: "var(--muted-foreground)" }}>
                    Bạn đã chọn đáp án đúng.
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="rounded-[12px] p-4 mb-5 flex items-center gap-3"
                style={{ background: "rgba(244,137,154,0.08)", border: "1px solid rgba(244,137,154,0.2)" }}
              >
                <div
                  className="grid place-items-center w-10 h-10 rounded-full flex-shrink-0"
                  style={{ background: "#F4899A" }}
                >
                  <XCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-sans font-bold text-[16px]" style={{ color: "#F4899A" }}>
                    Chưa đúng
                  </p>
                  <div className="font-sans text-[13px]" style={{ color: "var(--muted-foreground)" }}>
                    Đáp án đúng: <span className="font-semibold" style={{ color: "var(--foreground)" }}><RenderedContent content={question.correctAnswer} /></span>
                  </div>
                </div>
              </div>
            )}

            {/* Explanation */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4" style={{ color: "#F4899A" }} />
                <p className="font-sans font-semibold text-[13px] uppercase tracking-wider" style={{ color: "#F4899A" }}>
                  Lời giải chi tiết
                </p>
              </div>
              <div
                className="font-serif leading-[1.7]"
                style={{ fontSize: "17px", color: "var(--foreground)", fontFamily: '"EB Garamond", Garamond, serif' }}
              >
                <RenderedContent content={question.explanation || "Chưa có lời giải cho câu hỏi này."} />
              </div>
            </div>
          </div>
        )}

        {/* Essay input */}
        {question.type === "essay" && (
          <div className="mb-4">
            {phase === "answering" && !isTestMode && (
              <>
                <textarea
                  value={essayAnswer}
                  onChange={(e) => setEssayAnswer(e.target.value)}
                  placeholder="Nhập câu trả lời của bạn..."
                  rows={6}
                  className="w-full p-4 rounded-[8px] font-sans text-[14px] leading-[1.6] outline-none transition-[border-color,box-shadow] resize-y"
                  style={{
                    background: "var(--card)",
                    border: "2px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
                <button
                  onClick={handleEssaySubmit}
                  disabled={!essayAnswer.trim()}
                  className="font-sans font-semibold text-[14px] rounded-[8px] px-6 py-3 transition-transform duration-200 btn-press inline-flex items-center gap-2 disabled:opacity-50"
                  style={{ background: "#F4899A", color: "#FFFFFF" }}
                >
                  Nộp câu trả lời
                </button>
              </>
            )}
            {phase === "answering" && isTestMode && (
              <>
                {answers.find((a) => a.questionId === question.id) ? (
                  <div className="space-y-3">
                    <div
                      className="rounded-[8px] p-4"
                      style={{ border: "2px solid rgba(124,111,219,0.3)", background: "rgba(124,111,219,0.04)" }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p
                          className="font-sans font-medium text-[11px] uppercase tracking-wider"
                          style={{ color: "#7C6FDB" }}
                        >
                          Đã lưu
                        </p>
                        <button
                          onClick={() => {
                            const existing = answers.find((a) => a.questionId === question.id);
                            if (existing) {
                              setEssayAnswer(existing.userAnswer);
                              setAnswers((prev) => prev.filter((a) => a.questionId !== question.id));
                            }
                          }}
                          className="font-sans font-semibold text-[12px] rounded-[6px] px-3 py-1.5 transition-colors"
                          style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
                        >
                          Sửa câu trả lời
                        </button>
                      </div>
                      <div
                        className="font-sans font-medium leading-[1.6] whitespace-pre-wrap"
                        style={{ fontSize: "15px", color: "var(--foreground)" }}
                      >
                        {answers.find((a) => a.questionId === question.id)?.userAnswer}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={essayAnswer}
                      onChange={(e) => setEssayAnswer(e.target.value)}
                      placeholder="Nhập câu trả lời của bạn..."
                      rows={6}
                      className="w-full p-4 rounded-[8px] font-sans text-[14px] leading-[1.6] outline-none transition-[border-color,box-shadow] resize-y"
                      style={{
                        background: "var(--card)",
                        border: "2px solid var(--border)",
                        color: "var(--foreground)",
                      }}
                    />
                    <button
                      onClick={handleEssaySubmit}
                      disabled={!essayAnswer.trim()}
                      className="font-sans font-semibold text-[14px] rounded-[8px] px-6 py-3 transition-transform duration-200 btn-press inline-flex items-center gap-2 disabled:opacity-50"
                      style={{ background: "#7C6FDB", color: "#FFFFFF" }}
                    >
                      Lưu câu trả lời
                    </button>
                  </>
                )}
              </>
            )}

            {(phase === "essay-revealed" || phase === "review") && (
              <div className="space-y-4">
                {/* User's answer */}
                <div
                  className="rounded-[8px] p-4"
                  style={{ border: "2px solid var(--border)", background: "var(--card)" }}
                >
                  <p
                    className="font-sans font-medium text-[11px] uppercase tracking-wider mb-2"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Câu trả lời của bạn
                  </p>
                  <div
                    className="font-sans font-medium leading-[1.6] whitespace-pre-wrap"
                    style={{ fontSize: "17px", color: "var(--foreground)" }}
                  >
                    {phase === "review"
                      ? (answers.find((a) => a.questionId === question.id)?.userAnswer || "(trống)")
                      : essayAnswer}
                  </div>
                </div>

                {/* Model answer */}
                <div
                  className="rounded-[8px] p-4"
                  style={{
                    border: "2px solid rgba(244,137,154,0.3)",
                    background: "rgba(244,137,154,0.06)",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4" style={{ color: "#F4899A" }} />
                    <p
                      className="font-sans font-medium text-[11px] uppercase tracking-wider"
                      style={{ color: "#F4899A" }}
                    >
                      Đáp án mẫu
                    </p>
                  </div>
                  <div
                    className="font-sans font-medium leading-[1.6]"
                    style={{ fontSize: "17px", color: "var(--foreground)" }}
                  >
                    <RenderedContent content={question.correctAnswer} />
                  </div>
                </div>

                {/* Essay explanation */}
                {question.explanation && (
                  <div
                    className="rounded-[8px] p-4"
                    style={{
                      border: "2px solid rgba(244,137,154,0.2)",
                      background: "rgba(244,137,154,0.03)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4" style={{ color: "#F4899A" }} />
                      <p className="font-sans font-semibold text-[13px] uppercase tracking-wider" style={{ color: "#F4899A" }}>
                        Lời giải chi tiết
                      </p>
                    </div>
                    <div
                      className="font-serif leading-[1.7]"
                      style={{ fontSize: "17px", color: "var(--foreground)", fontFamily: '"EB Garamond", Garamond, serif' }}
                    >
                      <RenderedContent content={question.explanation} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Submit warning (test mode) */}
        {submitWarning && isTestMode && phase === "answering" && (
          <div
            className="rounded-[12px] px-4 py-3 mb-3 flex items-center justify-between"
            style={{ background: "rgba(244,137,154,0.08)", border: "1px solid rgba(244,137,154,0.2)" }}
          >
            <p className="font-sans font-medium text-[13px]" style={{ color: "#F4899A" }}>
              {submitWarning}
            </p>
            <button
              onClick={() => setSubmitWarning(null)}
              className="font-sans font-semibold text-[12px] rounded-[6px] px-2.5 py-1"
              style={{ background: "rgba(244,137,154,0.12)", color: "#F4899A" }}
            >
              Đóng
            </button>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center gap-3">
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="font-sans font-semibold text-[14px] rounded-[12px] px-5 py-3 transition-transform duration-200 btn-press inline-flex items-center gap-2 glass-card"
              style={{ color: "var(--foreground)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Trước
            </button>
          )}
          {isTestMode && phase === "answering" && (
            <div className="ml-auto flex items-center gap-3">
              {!allAnswered && (
                <span className="font-sans text-[12px]" style={{ color: "var(--muted-foreground)" }}>
                  Đã trả lời {answers.length}/{questions.length}
                </span>
              )}
              <button
                onClick={handleTestSubmitClick}
                disabled={saving}
                className="font-sans font-semibold text-[14px] rounded-[12px] px-6 py-3 transition-[background,box-shadow] duration-200 btn-press inline-flex items-center gap-2 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #F4899A 0%, #7C6FDB 100%)", color: "#FFFFFF", boxShadow: "0 4px 16px rgba(244,137,154,0.25)" }}
              >
                {saving ? "Đang lưu..." : "Nộp bài"}
                {!saving && <ClipboardCheck className="w-4 h-4" />}
              </button>
            </div>
          )}
          {isTestMode && phase === "answering" && currentIndex + 1 < questions.length && (
            <button
              onClick={handleNext}
              className="font-sans font-semibold text-[14px] rounded-[12px] px-5 py-3 transition-transform duration-200 btn-press inline-flex items-center gap-2 glass-card"
              style={{ color: "var(--foreground)" }}
            >
              Câu tiếp theo
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {!isTestMode && phase !== "answering" && (
            <button
              onClick={handleNext}
              disabled={saving}
              className="font-sans font-semibold text-[14px] rounded-[12px] px-6 py-3 transition-[background,box-shadow] duration-200 btn-press inline-flex items-center gap-2 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #F4899A 0%, #7C6FDB 100%)", color: "#FFFFFF", boxShadow: "0 4px 16px rgba(244,137,154,0.25)" }}
            >
              {saving
                ? "Đang lưu..."
                : currentIndex + 1 >= questions.length
                  ? "Xem kết quả"
                  : "Câu tiếp theo"}
              {!saving && <ArrowRight className="w-4 h-4" />}
            </button>
          )}
          {phase === "review" && (
            <button
              onClick={() => {
                if (currentIndex + 1 >= questions.length) {
                  setPhase("complete");
                } else {
                  handleNext();
                }
              }}
              className="font-sans font-semibold text-[14px] rounded-[12px] px-6 py-3 transition-[background,box-shadow] duration-200 btn-press inline-flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #F4899A 0%, #7C6FDB 100%)", color: "#FFFFFF", boxShadow: "0 4px 16px rgba(244,137,154,0.25)" }}
            >
              {currentIndex + 1 >= questions.length ? "Quay lại kết quả" : "Câu tiếp theo"}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Right panel: Question map (desktop only) ── */}
      <aside className="hidden lg:block">
        <div className="sticky top-0 rounded-[16px] p-5 glass-card-pink">
          <h3
            className="font-sans font-semibold text-[14px] mb-4"
            style={{ color: "var(--foreground)" }}
          >
            Bản đồ câu hỏi
          </h3>

          {/* Question grid */}
          <div className="grid grid-cols-5 gap-2 mb-5">
            {questions.map((q, i) => {
              const isAnswered = answeredIds.has(q.id);
              const isCurrent = i === currentIndex;
              const answer = answers.find((a) => a.questionId === q.id);
              const isCorrect = answer?.isCorrect === true;
              const isWrong = answer?.isCorrect === false;
              const showResult = !isTestMode || phase === "review";

              let bg = "var(--secondary)";
              let color = "var(--muted-foreground)";
              if (showResult && isCorrect) { bg = "#5B8C5A"; color = "#FFFFFF"; }
              else if (showResult && isWrong) { bg = "#C05656"; color = "#FFFFFF"; }
              else if (isAnswered) { bg = "#9F7AEA"; color = "#FFFFFF"; }
              if (isCurrent) { bg = "var(--foreground)"; color = "var(--primary-foreground)"; }

              return (
                <button
                  key={q.id}
                  onClick={() => handleJumpTo(i)}
                  className="grid place-items-center w-9 h-9 rounded-[6px] font-sans font-semibold text-[12px] transition-[background,color] duration-150 btn-press"
                  style={{ background: bg, color: color }}
                  title={`Câu ${i + 1}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="space-y-2 mb-5">
            {(!isTestMode || phase === "review") && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-[3px]" style={{ background: "#5B8C5A" }} />
                  <span className="font-sans text-[12px]" style={{ color: "var(--muted-foreground)" }}>Đúng</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-[3px]" style={{ background: "#C05656" }} />
                  <span className="font-sans text-[12px]" style={{ color: "var(--muted-foreground)" }}>Sai</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-[3px]" style={{ background: "#9F7AEA" }} />
              <span className="font-sans text-[12px]" style={{ color: "var(--muted-foreground)" }}>Đã trả lời</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-[3px]" style={{ background: "var(--secondary)" }} />
              <span className="font-sans text-[12px]" style={{ color: "var(--muted-foreground)" }}>Chưa trả lời</span>
            </div>
          </div>

          {/* Stats */}
          <div
            className="pt-4 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-sans text-[12px]" style={{ color: "var(--muted-foreground)" }}>
                Đã trả lời
              </span>
              <span className="font-sans font-semibold text-[13px]" style={{ color: "var(--foreground)" }}>
                {answers.length}/{questions.length}
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "var(--secondary)" }}
            >
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{
                  width: `${(answers.length / questions.length) * 100}%`,
                  background: "#F4899A",
                }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile question map (horizontal scroll) ── */}
      <div className="lg:hidden -mx-4 px-4 pb-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {questions.map((q, i) => {
            const isAnswered = answeredIds.has(q.id);
            const isCurrent = i === currentIndex;
            const answer = answers.find((a) => a.questionId === q.id);
            const isCorrect = answer?.isCorrect === true;
            const isWrong = answer?.isCorrect === false;
            const showResult = !isTestMode || phase === "review";

            let bg = "var(--secondary)";
            let color = "var(--muted-foreground)";
            if (showResult && isCorrect) { bg = "#5B8C5A"; color = "#FFFFFF"; }
            else if (showResult && isWrong) { bg = "#C05656"; color = "#FFFFFF"; }
            else if (isAnswered) { bg = "#9F7AEA"; color = "#FFFFFF"; }
            if (isCurrent) { bg = "var(--foreground)"; color = "var(--primary-foreground)"; }

            return (
              <button
                key={q.id}
                onClick={() => handleJumpTo(i)}
                className="grid place-items-center w-8 h-8 rounded-[6px] font-sans font-semibold text-[11px] flex-shrink-0"
                style={{ background: bg, color: color }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
