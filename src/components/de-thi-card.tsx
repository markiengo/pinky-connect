import Link from "next/link";
import { BookOpen, FileText, ArrowRight, Sparkles } from "lucide-react";

export interface DeThiCardData {
  id: string;
  title: string;
  subject: string;
  subjectSlug: string;
  questionCount: number;
  questionTypes: ("mcq" | "essay")[];
  matchReason: string;
  matchedTags: string[];
  score: number;
}

const subjectColors: Record<string, string> = {
  ke_toan: "bg-c-pink",
  tai_chinh_ngan_hang: "bg-c-mint",
  quan_tri_kinh_doanh: "bg-c-lilac",
};

function getQuestionTypeLabel(types: ("mcq" | "essay")[]): string {
  if (types.length === 0) return "—";
  if (types.includes("mcq") && types.includes("essay")) return "Trắc nghiệm + Tự luận";
  if (types.includes("mcq")) return "Trắc nghiệm";
  return "Tự luận";
}

export function DeThiCard({ card }: { card: DeThiCardData }) {
  const colorClass = subjectColors[card.subjectSlug] ?? "bg-c-cream";

  return (
    <Link
      href={`/quiz/${card.id}`}
      className={`relative flex flex-col min-h-[160px] p-4 rounded-card ${colorClass} transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[var(--shadow-pop)] group`}
    >
      {/* top row */}
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-[7px] rounded-pill bg-surface text-[11px] font-extrabold text-ink">
          <BookOpen className="w-3 h-3" />
          {card.subject}
        </span>
        <span className="inline-flex items-center gap-[5px] px-2.5 py-1.5 rounded-pill bg-surface text-[11px] font-extrabold">
          <FileText className="w-[11px] h-[11px]" />
          {card.questionCount} câu
        </span>
      </div>

      {/* title */}
      <h3 className="mt-3 mb-1.5 font-display text-[16px] font-bold leading-[1.22] tracking-[-0.01em]">
        {card.title}
      </h3>

      {/* type */}
      <p className="text-[11.5px] font-semibold text-ink/60 mb-2">
        {getQuestionTypeLabel(card.questionTypes)}
      </p>

      {/* match reason */}
      <div className="mt-auto flex items-start gap-2 p-2.5 rounded-[14px] bg-surface/80">
        <Sparkles className="w-3.5 h-3.5 text-accent-deep flex-shrink-0 mt-0.5" />
        <p className="text-[11.5px] font-medium leading-snug text-ink/75">
          {card.matchReason}
        </p>
      </div>

      {/* start quiz */}
      <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-pill bg-ink text-on-ink text-[11px] font-extrabold">
          Làm quiz
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}
