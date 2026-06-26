import Link from "next/link";

interface DePaneCardProps {
  id: string;
  title: string;
  subjectName: string;
  subjectSlug: string;
  questionCount: number;
  source: string;
  tags: string[];
  artworkColor: string;
}

function SubjectArtwork({ slug, color }: { slug: string; color: string }) {
  const patterns: Record<string, React.ReactNode> = {
    "ke-toan": (
      <>
        {/* Ledger lines pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.12]" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="ledger" x="0" y="0" width="40" height="32" patternUnits="userSpaceOnUse">
              <line x1="0" y1="8" x2="40" y2="8" stroke="#FFFFFF" strokeWidth="1" />
              <line x1="0" y1="16" x2="40" y2="16" stroke="#FFFFFF" strokeWidth="1" />
              <line x1="0" y1="24" x2="40" y2="24" stroke="#FFFFFF" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ledger)" />
        </svg>
        {/* Abacus beads */}
        <div className="absolute top-[15%] left-[10%] flex gap-2 opacity-40">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full" style={{ background: "#FFFFFF", boxShadow: `0 2px 8px ${color}66` }} />
          ))}
        </div>
        {/* Large numeral */}
        <span className="absolute bottom-[5%] right-[8%] font-serif text-[72px] leading-none opacity-[0.15]" style={{ color: "#FFFFFF" }}>¥</span>
      </>
    ),
    "tai-chinh-ngan-hang": (
      <>
        {/* Candlestick chart pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.15]" preserveAspectRatio="xMidYMid slice">
          <g stroke="#FFFFFF" strokeWidth="1.5" fill="none">
            <line x1="20%" y1="20%" x2="20%" y2="75%" />
            <rect x="16%" y="35%" width="8%" height="25%" fill="#FFFFFF" fillOpacity="0.3" />
            <line x1="45%" y1="15%" x2="45%" y2="65%" />
            <rect x="41%" y="25%" width="8%" height="30%" fill="#FFFFFF" fillOpacity="0.3" />
            <line x1="70%" y1="25%" x2="70%" y2="80%" />
            <rect x="66%" y="40%" width="8%" height="30%" fill="#FFFFFF" fillOpacity="0.3" />
          </g>
        </svg>
        {/* Coin circles */}
        <div className="absolute top-[12%] right-[12%] w-20 h-20 rounded-full border-[3px] opacity-25" style={{ borderColor: "#FFFFFF" }} />
        <div className="absolute top-[18%] right-[18%] w-12 h-12 rounded-full border-[2px] opacity-30" style={{ borderColor: "#FFFFFF" }} />
        {/* Dollar sign */}
        <span className="absolute bottom-[8%] left-[10%] font-serif text-[64px] leading-none opacity-[0.15]" style={{ color: "#FFFFFF" }}>$</span>
      </>
    ),
    "quan-tri-kinh-doanh": (
      <>
        {/* Growth arrow pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.15]" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
          <polyline points="20,160 60,120 100,130 140,70 180,50" fill="none" stroke="#FFFFFF" strokeWidth="2" />
          <polygon points="180,50 170,55 175,62" fill="#FFFFFF" />
          <line x1="20" y1="160" x2="180" y2="160" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
        {/* Bar chart */}
        <div className="absolute bottom-[15%] left-[10%] flex items-end gap-1.5 opacity-30">
          {[20, 35, 28, 45, 38].map((h, i) => (
            <div key={i} className="w-3 rounded-t-sm" style={{ height: `${h}px`, background: "#FFFFFF" }} />
          ))}
        </div>
        {/* Target circles */}
        <div className="absolute top-[15%] right-[12%] w-16 h-16 rounded-full border-[2px] opacity-25" style={{ borderColor: "#FFFFFF" }} />
        <div className="absolute top-[19%] right-[16%] w-8 h-8 rounded-full border-[2px] opacity-35" style={{ borderColor: "#FFFFFF" }} />
        <div className="absolute top-[23%] right-[20%] w-3 h-3 rounded-full opacity-50" style={{ background: "#FFFFFF" }} />
      </>
    ),
  };

  return (
    <>
      {/* Base gradient — deep and saturated */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, ${color} 0%, ${color}dd 45%, ${color}88 100%)`,
        }}
      />
      {/* Vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(30,27,58,0.08) 100%)",
        }}
      />
      {/* Subject-specific pattern */}
      {patterns[slug] || patterns["ke-toan"]}
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}

export function DePaneCard({
  id,
  title,
  subjectName,
  subjectSlug,
  questionCount,
  source,
  tags,
  artworkColor,
}: DePaneCardProps) {
  const tagColors: Record<string, { bg: string; color: string }> = {
    "ke-toan": { bg: "rgba(159,122,234,0.10)", color: "#9F7AEA" },
    "tai-chinh-ngan-hang": { bg: "rgba(124,111,219,0.10)", color: "#7C6FDB" },
    "quan-tri-kinh-doanh": { bg: "rgba(244,137,154,0.10)", color: "#F4899A" },
  };
  const tagStyle = tagColors[subjectSlug] || tagColors["ke-toan"];

  return (
    <Link
      href={`/quiz/${id}`}
      className="group block overflow-hidden rounded-[16px] transition-all duration-300 hover:-translate-y-[4px] btn-press"
      style={{
        boxShadow: "0 12px 40px rgba(30,27,58,0.10), 0 4px 12px rgba(30,27,58,0.06)",
        background: "#FFFFFF",
        border: "1px solid rgba(244,137,154,0.14)",
      }}
    >
      <div className="grid grid-cols-[2fr_3fr]">
        {/* LEFT — Artwork panel */}
        <div className="relative overflow-hidden min-h-[200px]">
          <SubjectArtwork slug={subjectSlug} color={artworkColor} />
        </div>

        {/* RIGHT — Content panel */}
        <div
          className="flex flex-col gap-3 p-6"
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Pre-heading */}
          <span
            className="font-sans font-bold text-[11px] uppercase tracking-wider"
            style={{ color: tagStyle.color }}
          >
            {subjectName}
          </span>

          {/* Title */}
          <h2
            className="font-serif font-normal leading-snug"
            style={{ fontSize: "20px", color: "#1E1B3A" }}
          >
            {title}
          </h2>

          {/* Metadata row */}
          <div
            className="flex items-center gap-3 font-sans text-[13px]"
            style={{ color: "#5C5875" }}
          >
            <span>{questionCount} câu</span>
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: "#D9D3E6" }}
            />
            <span className="truncate">{source}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full font-sans font-semibold text-[12px]"
                style={{
                  background: tagStyle.bg,
                  color: tagStyle.color,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-auto pt-2">
            <span
              className="font-sans font-semibold text-[14px] inline-flex items-center gap-1.5 transition-all duration-200 group-hover:gap-2"
              style={{ color: tagStyle.color }}
            >
              Làm bài
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
