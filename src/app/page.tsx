import { BookOpen, ArrowRight, ArrowUpRight, Star, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { getSession } from "@/lib/session";

const statCards = [
  { n: "3", label: "môn học\nsẵn sàng", color: "bg-c-pink", href: "/practice" },
  { n: "8", label: "đề thi\ntrong kho", color: "bg-c-mint", href: "/practice" },
  { n: "60", label: "câu hỏi\nđã soạn", color: "bg-c-lilac", href: "/practice" },
] as const;

interface SubjectCard {
  tag: string;
  title: string;
  meta: string;
  color: string;
  rating: string;
  isTop?: boolean;
}

const subjectCards: SubjectCard[] = [
  {
    tag: "Kế toán",
    title: "Đề thi Nguyên lý Kế toán – FTU",
    meta: "ĐH Ngoại thương",
    color: "bg-c-pink",
    rating: "10 câu",
  },
  {
    tag: "Tài chính",
    title: "Đề thi Tài chính – Tiền tệ – HVNH",
    meta: "Học viện Ngân hàng",
    color: "bg-c-cream border border-ink/7",
    rating: "9 câu",
  },
  {
    tag: "Quản trị",
    title: "Đề thi Quản trị Marketing – ĐH Mở TP.HCM",
    meta: "ĐH Mở TP.HCM",
    color: "bg-c-lilac",
    rating: "9 câu",
  },
  {
    tag: "Ngân hàng",
    title: "Đề thi Ngân hàng Thương mại – ĐH Kinh tế Đà Nẵng",
    meta: "ĐH Kinh tế Đà Nẵng",
    color: "bg-c-blue",
    rating: "7 câu",
    isTop: true,
  },
];

export default async function Home() {
  const session = await getSession();
  return (
    <AppShell username={session?.username}>
      {/* ── Greeting ── */}
      <h1 className="mb-1 font-serif font-medium text-[clamp(40px,4.4vw,58px)] leading-[1.02] tracking-[-0.015em]">
        Xin chào{session ? `, ${session.username}` : ""}<span className="inline-block text-[0.72em] origin-[70%_75%] animate-[wave_2.4s_ease_0.9s_2]">{" "}👋</span>
      </h1>
      <Link
        href="/practice"
        className="inline-flex items-center gap-2 mt-1.5 mb-6 text-[15.5px] font-bold text-text-muted transition-all duration-150 hover:text-ink hover:gap-3 group"
      >
        Tìm đề thi phù hợp với bài đang học
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </Link>

      {/* ── Stat pills ── */}
      <div className="grid grid-cols-3 gap-3.5 mb-6">
        {statCards.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`relative flex flex-col min-h-[120px] p-4 rounded-card ${s.color} transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[var(--shadow-pop)]`}
          >
            <span className="font-display text-[clamp(28px,3vw,40px)] font-bold leading-none tracking-tight">
              {s.n}
            </span>
            <span className="mt-auto text-[12.5px] font-semibold leading-tight text-ink/60 whitespace-pre-line">
              {s.label}
            </span>
            <span className="absolute top-3.5 right-3.5 text-ink/30">
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.6} />
            </span>
          </Link>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-2 items-center mb-6 overflow-hidden">
        {["Tất cả", "Kế toán", "Tài chính", "Quản trị"].map((label, i) => (
          <button
            key={label}
            className={`inline-flex items-center gap-2 h-11 px-[18px] rounded-pill text-[13px] font-bold whitespace-nowrap transition-all duration-150 ${
              i === 0
                ? "bg-ink text-on-ink"
                : "bg-white/90 border border-white/60 text-ink hover:bg-surface hover:-translate-y-px"
            }`}
          >
            {i === 0 && <LayoutGrid className="w-[15px] h-[15px]" />}
            {label}
          </button>
        ))}
      </div>

      <p className="mb-3.5 text-[13px] font-extrabold text-ink">
        Đề thi mới nhất
      </p>

      {/* ── Subject cards grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
        {subjectCards.map((card) => (
          <Link
            key={card.title}
            href="/practice"
            className={`relative flex flex-col min-h-[168px] p-4 rounded-card ${card.color} transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[var(--shadow-pop)]`}
          >
            {/* top row */}
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-[7px] rounded-pill bg-surface text-[11px] font-extrabold text-ink">
                <BookOpen className="w-3 h-3" />
                {card.tag}
              </span>
              <span className="inline-flex items-center gap-[5px] px-2.5 py-1.5 rounded-pill bg-surface text-[11px] font-extrabold">
                {card.isTop ? (
                  <>🏆 {card.rating}</>
                ) : (
                  <>
                    <Star className="w-[11px] h-[11px] text-star fill-star" />
                    {card.rating}
                  </>
                )}
              </span>
            </div>

            {/* title */}
            <h3 className="mt-3.5 mb-1.5 font-display text-[17.5px] font-bold leading-[1.22] tracking-[-0.01em] max-w-[92%]">
              {card.title}
            </h3>

            {/* footer */}
            <div className="mt-auto flex items-end justify-between">
              <span className="text-[11.5px] font-semibold text-ink/60">
                {card.meta}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* ── CTA strip ── */}
      <div className="flex items-center gap-4 p-5 rounded-card bg-surface shadow-[var(--shadow-soft)] mb-6 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-3xl flex-shrink-0">📖</span>
          <div className="min-w-0">
            <b className="block text-sm font-extrabold leading-tight">
              Kho đề thi từ các kỳ thi quốc gia
            </b>
            <p className="mt-1 text-[13px] font-medium text-text-muted leading-snug">
              Tìm kiếm, luyện tập và xem kết quả ngay lập tức.
            </p>
          </div>
        </div>
        <Link
          href="/practice"
          className="inline-flex items-center justify-center h-12 px-6 rounded-pill bg-surface text-[13.5px] font-extrabold transition-all duration-[280ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-px hover:shadow-[var(--shadow-pop)] whitespace-nowrap"
        >
          Xem tất cả
        </Link>
      </div>
    </AppShell>
  );
}
