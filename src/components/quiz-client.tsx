"use client";

import { useState, useCallback } from "react";
import { RenderedContent } from "@/components/rendered-content";
import { saveQuizAttempt, type QuizQuestion, type AnswerSubmission } from "@/lib/quiz";
import type { PreviousAttempt } from "@/lib/history";
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw, Trophy, BookOpen, History, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

interface QuizClientProps {
  deThiId: string;
  title: string;
  subjectName: string;
  questions: QuizQuestion[];
  previousAttempt?: PreviousAttempt | null;
}

type Phase = "answering" | "feedback" | "essay-revealed" | "complete";

interface AnswerRecord {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean | null;
}

export function QuizClient({ deThiId, questions, previousAttempt }: QuizClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [essayAnswer, setEssayAnswer] = useState("");
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; total: number; percentage: number } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyDismissed, setHistoryDismissed] = useState(false);

  const question = questions[currentIndex];
  const progress = ((currentIndex + (phase !== "answering" ? 1 : 0)) / questions.length) * 100;
  const answeredIds = new Set(answers.map((a) => a.questionId));

  const handleMCQSelect = useCallback(
    (index: number) => {
      if (phase !== "answering") return;
      setSelectedOption(index);
    },
    [phase]
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
        setPhase(questions[prevIdx].type === "mcq" ? "feedback" : "essay-revealed");
      } else {
        setSelectedOption(null);
        setEssayAnswer("");
        setPhase("answering");
      }
    }
  }, [currentIndex, answers, questions]);

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
        setPhase(targetQuestion.type === "mcq" ? "feedback" : "essay-revealed");
      } else {
        setSelectedOption(null);
        setEssayAnswer("");
        setPhase("answering");
      }
    },
    [answers, questions]
  );

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
            style={{ fontSize: "28px", color: "#1E1B3A" }}
          >
            Hoàn thành bài thi!
          </h2>

          <p
            className="font-serif font-normal mb-1"
            style={{ fontSize: "24px", color: "#1E1B3A" }}
          >
            Bạn đúng {correctCount}/{mcqCount} câu
          </p>
          <p
            className="font-sans font-medium mb-6"
            style={{ fontSize: "14px", color: "#5C5875" }}
          >
            ({answers.length} câu tổng cộng · {result.percentage}%)
          </p>

          {/* Score bar */}
          <div
            className="h-3 rounded-full overflow-hidden mb-6"
            style={{ background: "#E8E4F2" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${result.percentage}%`,
                background: isGoodScore ? "#F4899A" : "#F4899A",
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="font-sans font-semibold text-[14px] rounded-[12px] px-6 py-3 transition-all duration-200 btn-press inline-flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #F4899A 0%, #7C6FDB 100%)", color: "#FFFFFF", boxShadow: "0 4px 16px rgba(244,137,154,0.25)" }}
            >
              <RotateCcw className="w-4 h-4" />
              Làm lại
            </button>
            <Link
              href="/dashboard"
              className="font-sans font-semibold text-[14px] rounded-[12px] px-6 py-3 transition-all duration-200 btn-press inline-flex items-center justify-center gap-2 glass-card"
              style={{ color: "#1E1B3A" }}
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
              border: "1px solid rgba(159,122,234,0.15)",
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
                  <p className="font-sans font-bold text-[14px]" style={{ color: "#1E1B3A" }}>
                    Lần làm gần nhất
                  </p>
                  <p className="font-sans text-[12px]" style={{ color: "#5C5875" }}>
                    {previousAttempt.score}/{previousAttempt.totalQuestions} đúng &middot; {Math.round(previousAttempt.percentage)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHistory((v) => !v)}
                  className="font-sans font-semibold text-[12px] rounded-[8px] px-3 py-2 transition-all inline-flex items-center gap-1.5"
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
                  className="font-sans font-semibold text-[12px] rounded-[8px] px-3 py-2 transition-all"
                  style={{ background: "rgba(30,27,58,0.06)", color: "#5C5875" }}
                >
                  Bỏ qua
                </button>
              </div>
            </div>

            {/* Expandable detail */}
            {showHistory && (
              <div
                className="px-5 pb-5 pt-1 border-t"
                style={{ borderColor: "rgba(159,122,234,0.12)" }}
              >
                <p className="font-sans font-semibold text-[12px] uppercase tracking-wider mb-3 mt-3" style={{ color: "#8F8AA3" }}>
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
                        className="w-full flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition-all hover:bg-white/60 text-left"
                        style={{ background: "rgba(255,255,255,0.4)" }}
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
                                  : "#E8E4F2",
                            color: isCorrect
                              ? "#5B8C5A"
                              : isWrong
                                ? "#C05656"
                                : isEssay
                                  ? "#7C6FDB"
                                  : "#8F8AA3",
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
                          <p className="font-sans font-medium text-[13px] truncate" style={{ color: "#1E1B3A" }}>
                            Câu {i + 1}
                          </p>
                          <p className="font-sans text-[11px] truncate" style={{ color: "#5C5875" }}>
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
                                  : "rgba(30,27,58,0.06)",
                            color: isCorrect
                              ? "#5B8C5A"
                              : isWrong
                                ? "#C05656"
                                : isEssay
                                  ? "#7C6FDB"
                                  : "#8F8AA3",
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

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span
              className="font-sans font-semibold text-[13px]"
              style={{ color: "#1E1B3A" }}
            >
              Câu {currentIndex + 1} / {questions.length}
            </span>
            <span
              className="font-sans font-medium text-[12px]"
              style={{ color: "#5C5875" }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "#E8E4F2" }}
          >
            <div
              className="h-full rounded-full transition-all duration-300 dream-progress"
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
            style={{ fontSize: "19px", color: "#1E1B3A", fontFamily: '"EB Garamond", Garamond, serif' }}
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
              const showFeedback = phase === "feedback";

              let bg = "#FFFFFF";
              let border = "#D9D3E6";
              let color = "#1E1B3A";

              if (showFeedback && isCorrect) {
                bg = "rgba(91,140,90,0.08)";
                border = "#5B8C5A";
                color = "#5B8C5A";
              } else if (showFeedback && isSelected && !isCorrect) {
                bg = "rgba(192,86,86,0.08)";
                border = "#C05656";
                color = "#C05656";
              } else if (showFeedback) {
                bg = "#FFFFFF";
                border = "#D9D3E6";
                color = "#8F8AA3";
              } else if (isSelected) {
                bg = "rgba(159,122,234,0.06)";
                border = "#9F7AEA";
                color = "#1E1B3A";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleMCQSelect(index)}
                  disabled={phase !== "answering"}
                  className="w-full text-left p-4 rounded-[8px] border-2 transition-all duration-200 btn-press"
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
                            ? "#FFFFFF"
                            : "#5C5875",
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

        {/* MCQ confirm button */}
        {question.type === "mcq" && phase === "answering" && (
          <div className="mb-4">
            <button
              onClick={handleConfirmMCQ}
              disabled={selectedOption === null}
              className="font-sans font-semibold text-[14px] rounded-[12px] px-6 py-3 transition-all duration-200 btn-press inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: selectedOption !== null ? "linear-gradient(135deg, #F4899A 0%, #7C6FDB 100%)" : "#E8E4F2", color: selectedOption !== null ? "#FFFFFF" : "#8F8AA3", boxShadow: selectedOption !== null ? "0 4px 16px rgba(244,137,154,0.25)" : "none" }}
            >
              <CheckCircle2 className="w-4 h-4" />
              Xác nhận
            </button>
          </div>
        )}

        {/* MCQ inline explanation box (after submit) */}
        {question.type === "mcq" && phase === "feedback" && selectedOption !== null && (
          <div className="mb-4 rounded-[16px] p-6 float-reveal" style={{ background: "#FFFFFF", border: "2px solid rgba(244,137,154,0.2)" }}>
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
                  <p className="font-sans text-[13px]" style={{ color: "#5C5875" }}>
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
                  <div className="font-sans text-[13px]" style={{ color: "#5C5875" }}>
                    Đáp án đúng: <span className="font-semibold" style={{ color: "#1E1B3A" }}><RenderedContent content={question.correctAnswer} /></span>
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
                style={{ fontSize: "17px", color: "#1E1B3A", fontFamily: '"EB Garamond", Garamond, serif' }}
              >
                <RenderedContent content={question.explanation || "Chưa có lời giải cho câu hỏi này."} />
              </div>
            </div>
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
                  className="w-full p-4 rounded-[8px] font-sans text-[14px] leading-[1.6] outline-none transition-all resize-y"
                  style={{
                    background: "#FFFFFF",
                    border: "2px solid #D9D3E6",
                    color: "#1E1B3A",
                  }}
                />
                <button
                  onClick={handleEssaySubmit}
                  disabled={!essayAnswer.trim()}
                  className="font-sans font-semibold text-[14px] rounded-[8px] px-6 py-3 transition-all duration-200 btn-press inline-flex items-center gap-2 disabled:opacity-50"
                  style={{ background: "#F4899A", color: "#FFFFFF" }}
                >
                  Nộp câu trả lời
                </button>
              </>
            )}

            {phase === "essay-revealed" && (
              <div className="space-y-4">
                {/* User's answer */}
                <div
                  className="rounded-[8px] p-4"
                  style={{ border: "2px solid #D9D3E6", background: "#FFFFFF" }}
                >
                  <p
                    className="font-sans font-medium text-[11px] uppercase tracking-wider mb-2"
                    style={{ color: "#5C5875" }}
                  >
                    Câu trả lời của bạn
                  </p>
                  <div
                    className="font-sans font-medium leading-[1.6] whitespace-pre-wrap"
                    style={{ fontSize: "17px", color: "#1E1B3A" }}
                  >
                    {essayAnswer}
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
                    style={{ fontSize: "17px", color: "#1E1B3A" }}
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
                      style={{ fontSize: "17px", color: "#1E1B3A", fontFamily: '"EB Garamond", Garamond, serif' }}
                    >
                      <RenderedContent content={question.explanation} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center gap-3">
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="font-sans font-semibold text-[14px] rounded-[12px] px-5 py-3 transition-all duration-200 btn-press inline-flex items-center gap-2 glass-card"
              style={{ color: "#1E1B3A" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Trước
            </button>
          )}
          {phase !== "answering" && (
            <button
              onClick={handleNext}
              disabled={saving}
              className="font-sans font-semibold text-[14px] rounded-[12px] px-6 py-3 transition-all duration-200 btn-press inline-flex items-center gap-2 disabled:opacity-60"
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
        </div>
      </div>

      {/* ── Right panel: Question map (desktop only) ── */}
      <aside className="hidden lg:block">
        <div className="sticky top-0 rounded-[16px] p-5 glass-card-pink">
          <h3
            className="font-sans font-semibold text-[14px] mb-4"
            style={{ color: "#1E1B3A" }}
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

              let bg = "#E8E4F2";
              let color = "#5C5875";
              if (isCorrect) { bg = "#5B8C5A"; color = "#FFFFFF"; }
              else if (isWrong) { bg = "#C05656"; color = "#FFFFFF"; }
              else if (isAnswered) { bg = "#9F7AEA"; color = "#FFFFFF"; }
              if (isCurrent) { bg = "#1E1B3A"; color = "#FFFFFF"; }

              return (
                <button
                  key={q.id}
                  onClick={() => handleJumpTo(i)}
                  className="grid place-items-center w-9 h-9 rounded-[6px] font-sans font-semibold text-[12px] transition-all duration-150 btn-press"
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
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-[3px]" style={{ background: "#5B8C5A" }} />
              <span className="font-sans text-[12px]" style={{ color: "#5C5875" }}>Đúng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-[3px]" style={{ background: "#C05656" }} />
              <span className="font-sans text-[12px]" style={{ color: "#5C5875" }}>Sai</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-[3px]" style={{ background: "#9F7AEA" }} />
              <span className="font-sans text-[12px]" style={{ color: "#5C5875" }}>Đã trả lời (tự luận)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-[3px]" style={{ background: "#E8E4F2" }} />
              <span className="font-sans text-[12px]" style={{ color: "#5C5875" }}>Chưa trả lời</span>
            </div>
          </div>

          {/* Stats */}
          <div
            className="pt-4 border-t"
            style={{ borderColor: "#D9D3E6" }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-sans text-[12px]" style={{ color: "#5C5875" }}>
                Đã trả lời
              </span>
              <span className="font-sans font-semibold text-[13px]" style={{ color: "#1E1B3A" }}>
                {answers.length}/{questions.length}
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "#E8E4F2" }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
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

            let bg = "#E8E4F2";
            let color = "#5C5875";
            if (isCorrect) { bg = "#5B8C5A"; color = "#FFFFFF"; }
            else if (isWrong) { bg = "#C05656"; color = "#FFFFFF"; }
            else if (isAnswered) { bg = "#9F7AEA"; color = "#FFFFFF"; }
            if (isCurrent) { bg = "#1E1B3A"; color = "#FFFFFF"; }

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
