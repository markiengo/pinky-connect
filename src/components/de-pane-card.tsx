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

const subjectGradients: Record<string, string> = {
  ke_toan: "linear-gradient(135deg, #7C6FDB 0%, #9F7AEA 50%, #F4899A 100%)",
  tai_chinh_ngan_hang: "linear-gradient(135deg, #8DD3B6 0%, #A8E6CF 50%, #C2F0DE 100%)",
  quan_tri_kinh_doanh: "linear-gradient(135deg, #E8788A 0%, #F4899A 50%, #FBCFE0 100%)",
  kinh_te_vi_mo: "linear-gradient(135deg, #36B3A6 0%, #4ECDC4 50%, #7FE8DE 100%)",
  phap_luat_dai_cuong: "linear-gradient(135deg, #3D4080 0%, #5B5FA8 50%, #8B8FD0 100%)",
};

function SubjectArtwork({ slug, color }: { slug: string; color: string }) {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: subjectGradients[slug] || color }}
      />
      {/* Vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(30,27,58,0.12) 100%)",
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
    ke_toan: { bg: "rgba(159,122,234,0.10)", color: "#9F7AEA" },
    tai_chinh_ngan_hang: { bg: "rgba(168,230,207,0.10)", color: "#A8E6CF" },
    quan_tri_kinh_doanh: { bg: "rgba(244,137,154,0.10)", color: "#F4899A" },
    kinh_te_vi_mo: { bg: "rgba(78,205,196,0.10)", color: "#4ECDC4" },
    phap_luat_dai_cuong: { bg: "rgba(91,95,168,0.10)", color: "#5B5FA8" },
  };
  const tagStyle = tagColors[subjectSlug] || tagColors["ke_toan"];

  return (
    <Link
      href={`/quiz/${id}`}
      className="group block overflow-hidden rounded-[16px] transition-transform duration-300 hover:-translate-y-[4px] btn-press"
      style={{
        boxShadow: "var(--shadow-lifted)",
        background: "var(--card)",
        border: "1px solid var(--border)",
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
            background: "var(--card)",
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
            style={{ fontSize: "20px", color: "var(--foreground)" }}
          >
            {title}
          </h2>

          {/* Metadata row */}
          <div
            className="flex items-center gap-3 font-sans text-[13px]"
            style={{ color: "var(--muted-foreground)" }}
          >
            <span>{questionCount} câu</span>
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: "var(--border)" }}
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
              className="font-sans font-semibold text-[14px] inline-flex items-center gap-1.5 transition-[gap] duration-200 group-hover:gap-2"
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
