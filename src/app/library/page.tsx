import { Library as LibraryIcon, Filter } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DePaneCard } from "@/components/de-pane-card";
import { getSession } from "@/lib/session";
import { getAvailableDeThi } from "@/lib/quiz";
import { redirect } from "next/navigation";
import Link from "next/link";

const subjectColors: Record<string, string> = {
  ke_toan: "#9F7AEA",
  tai_chinh_ngan_hang: "#A8E6CF",
  quan_tri_kinh_doanh: "#F4899A",
  kinh_te_vi_mo: "#4ECDC4",
  phap_luat_dai_cuong: "#5B5FA8",
};

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const params = await searchParams;
  const selectedSubject = params.subject;

  const { deThi: allDeThi, subjects } = await getAvailableDeThi();
  const filtered = selectedSubject
    ? allDeThi.filter((d) => d.subjectSlug === selectedSubject)
    : allDeThi;

  return (
    <AppShell username={session?.username}>
      <div className="max-w-[1200px] mx-auto w-full">
        {/* ── Header ── */}
        <div className="mb-8 reveal">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-11 h-11 rounded-[14px] flex items-center justify-center glass-card-pink"
              style={{ boxShadow: "0 4px 20px rgba(244,137,154,0.12)" }}
            >
              <LibraryIcon className="w-5 h-5" style={{ color: "#F4899A" }} />
            </div>
            <div>
              <span
                className="font-sans font-semibold text-[11px] uppercase tracking-[0.08em]"
                style={{ color: "#F4899A" }}
              >
                Thư viện
              </span>
              <h1
                className="font-serif font-normal leading-[1.1] tracking-[-0.02em]"
                style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "#1E1B3A" }}
              >
                Đề thi
              </h1>
            </div>
          </div>
          <p
            className="font-sans ml-[56px]"
            style={{ fontSize: "15px", color: "#5C5875" }}
          >
            {filtered.length} đề thi sẵn sàng luyện tập
          </p>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex items-center gap-2 mb-8 flex-wrap reveal" style={{ animationDelay: "50ms" }}>
          <div
            className="flex items-center gap-1.5 font-sans text-[13px] font-medium mr-2"
            style={{ color: "#5C5875" }}
          >
            <Filter className="w-4 h-4" />
            Môn:
          </div>
          <Link
            href="/library"
            className="font-sans font-medium text-[13px] rounded-full px-4 py-2 transition-all duration-150 btn-press"
            style={
              !selectedSubject
                ? {
                    background: "linear-gradient(135deg, #F4899A 0%, #7C6FDB 100%)",
                    color: "#FFFFFF",
                    boxShadow: "0 4px 16px rgba(244,137,154,0.25)",
                  }
                : {
                    background: "rgba(255,255,255,0.7)",
                    color: "#1E1B3A",
                    border: "1px solid rgba(244,137,154,0.25)",
                    backdropFilter: "blur(8px)",
                  }
            }
          >
            Tất cả ({allDeThi.length})
          </Link>
          {subjects.map((s) => {
            const accentColor =
              s.slug === "ke_toan"
                ? "#9F7AEA"
                : s.slug === "tai_chinh_ngan_hang"
                ? "#A8E6CF"
                : s.slug === "quan_tri_kinh_doanh"
                ? "#F4899A"
                : s.slug === "kinh_te_vi_mo"
                ? "#4ECDC4"
                : s.slug === "phap_luat_dai_cuong"
                ? "#5B5FA8"
                : "#9F7AEA";
            return (
              <Link
                key={s.slug}
                href={`/library?subject=${s.slug}`}
                className="font-sans font-medium text-[13px] rounded-full px-4 py-2 transition-all duration-150 btn-press"
                style={
                  selectedSubject === s.slug
                    ? {
                        background: accentColor,
                        color: "#FFFFFF",
                        boxShadow: `0 4px 16px ${accentColor}40`,
                      }
                    : {
                        background: "rgba(255,255,255,0.7)",
                        color: "#1E1B3A",
                        border: "1px solid rgba(244,137,154,0.25)",
                        backdropFilter: "blur(8px)",
                      }
                }
              >
                {s.label} ({s.count})
              </Link>
            );
          })}
        </div>

        {/* ── Đề cards grid ── */}
        {filtered.length === 0 ? (
          <div className="rounded-[16px] p-12 text-center glass-card-pink">
            <p
              className="font-sans mb-2"
              style={{ fontSize: "16px", color: "#5C5875" }}
            >
              Chưa có đề thi nào trong mục này.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((d, i) => (
              <div
                key={d.id}
                className="float-reveal"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <DePaneCard
                  id={d.id}
                  title={d.title}
                  subjectName={d.subjectName}
                  subjectSlug={d.subjectSlug}
                  questionCount={d.questionCount}
                  source={d.source}
                  tags={d.tags}
                  artworkColor={subjectColors[d.subjectSlug] || "#9F7AEA"}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
