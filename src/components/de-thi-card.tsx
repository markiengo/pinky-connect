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
  ke_toan: "#9F7AEA",
  tai_chinh_ngan_hang: "#7C6FDB",
  quan_tri_kinh_doanh: "#F4899A",
};

function getQuestionTypeLabel(types: ("mcq" | "essay")[]): string {
  if (types.length === 0) return "—";
  if (types.includes("mcq") && types.includes("essay")) return "Trắc nghiệm + Tự luận";
  if (types.includes("mcq")) return "Trắc nghiệm";
  return "Tự luận";
}

export function DeThiCard({ card }: { card: DeThiCardData }) {
  const color = subjectColors[card.subjectSlug] ?? "#9F7AEA";

  return (
    <Link
      href={`/quiz/${card.id}`}
      className="relative flex flex-col min-h-[160px] p-4 rounded-[12px] transition-all duration-200 hover:-translate-y-[3px] group"
      style={{ background: color }}
    >
      {/* top row */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-[7px] rounded-full text-[11px] font-bold"
          style={{ background: "rgba(255,255,255,0.9)", color: "#1E1B3A" }}
        >
          <BookOpen className="w-3 h-3" />
          {card.subject}
        </span>
        <span
          className="inline-flex items-center gap-[5px] px-2.5 py-1.5 rounded-full text-[11px] font-bold"
          style={{ background: "rgba(255,255,255,0.9)", color: "#1E1B3A" }}
        >
          <FileText className="w-[11px] h-[11px]" />
          {card.questionCount} câu
        </span>
      </div>

      {/* title */}
      <h3
        className="mt-3 mb-1.5 font-sans font-bold leading-[1.22] tracking-[-0.01em]"
        style={{ fontSize: "16px", color: "#FFFFFF" }}
      >
        {card.title}
      </h3>

      {/* type */}
      <p
        className="font-sans font-semibold mb-2"
        style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.7)" }}
      >
        {getQuestionTypeLabel(card.questionTypes)}
      </p>

      {/* match reason */}
      <div
        className="mt-auto flex items-start gap-2 p-2.5 rounded-[14px]"
        style={{ background: "rgba(255,255,255,0.15)" }}
      >
        <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#FFFFFF" }} />
        <p
          className="font-sans font-medium leading-snug"
          style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.85)" }}
        >
          {card.matchReason}
        </p>
      </div>

      {/* start quiz */}
      <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <span
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold"
          style={{ background: "#1E1B3A", color: "#FFFFFF" }}
        >
          Làm quiz
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}
