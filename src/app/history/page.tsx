import { AppShell } from "@/components/app-shell";
import { getSession } from "@/lib/session";
import {
  getQuizHistory,
  getScoreProgression,
  getSubjectAverages,
  type HistoryEntry,
} from "@/lib/history";
import { TrendingUp, Award, Target, Calendar, ArrowRight, Filter, ArrowDownUp } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatViDate } from "@/lib/format-date";
import { ScoreProgressionChart, SubjectAveragesChart } from "@/components/charts";

const subjectColors: Record<string, string> = {
  ke_toan: "#9F7AEA",
  tai_chinh_ngan_hang: "#A8E6CF",
  quan_tri_kinh_doanh: "#F4899A",
  kinh_te_vi_mo: "#4ECDC4",
  phap_luat_dai_cuong: "#5B5FA8",
};

const subjectLabels: Record<string, string> = {
  ke_toan: "Kế toán",
  tai_chinh_ngan_hang: "Tài chính",
  quan_tri_kinh_doanh: "QTKD",
  kinh_te_vi_mo: "Kinh tế vi mô",
  phap_luat_dai_cuong: "Pháp luật",
};

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "highest", label: "Điểm cao" },
  { value: "lowest", label: "Điểm thấp" },
] as const;

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; sort?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const history = await getQuizHistory();
  const progression = await getScoreProgression();
  const subjectAverages = await getSubjectAverages();

  const params = await searchParams;
  const selectedSubject = params.subject;
  const selectedSort = params.sort || "newest";

  // Unique subjects from history
  const historySubjectSlugs = Array.from(
    new Set(history.map((h) => h.subjectSlug))
  );

  // Filter and sort
  const filtered = selectedSubject
    ? history.filter((h) => h.subjectSlug === selectedSubject)
    : history;

  const sorted = [...filtered].sort((a, b) => {
    switch (selectedSort) {
      case "oldest":
        return a.completedAt.getTime() - b.completedAt.getTime();
      case "highest":
        return b.percentage - a.percentage;
      case "lowest":
        return a.percentage - b.percentage;
      default:
        return b.completedAt.getTime() - a.completedAt.getTime();
    }
  });

  const totalAttempts = history.length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(
          history.reduce((sum, h) => sum + h.percentage, 0) / totalAttempts
        )
      : 0;
  const bestScore =
    totalAttempts > 0
      ? Math.max(...history.map((h) => h.percentage))
      : 0;

  return (
    <AppShell username={session?.username}>
      <div className="max-w-[1200px] mx-auto w-full">
        {/* ── Header ── */}
        <div className="mb-8 reveal">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#7C6FDB" }}
            />
            <span
              className="font-sans font-semibold text-[11px] uppercase tracking-[0.08em]"
              style={{ color: "#7C6FDB" }}
            >
              Lịch sử
            </span>
          </div>
          <h1
            className="font-serif font-normal leading-[1.1] tracking-[-0.02em] mb-2"
            style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "var(--foreground)" }}
          >
            Lịch sử làm bài
          </h1>
          <p
            className="font-sans max-w-[480px]"
            style={{ fontSize: "15px", color: "var(--muted-foreground)", lineHeight: 1.6 }}
          >
            Theo dõi tiến độ học tập và kết quả các bài thi.
          </p>
        </div>

        {totalAttempts === 0 ? (
          /* ── Empty state ── */
          <div className="rounded-[16px] p-12 text-center float-reveal glass-card-pink">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: "rgba(244,137,154,0.12)", boxShadow: "0 4px 20px rgba(244,137,154,0.12)" }}
            >
              <TrendingUp className="w-8 h-8 text-[#F4899A]" />
            </div>
            <h2
              className="font-sans font-semibold mb-2"
              style={{ fontSize: "18px", color: "var(--foreground)" }}
            >
              Chưa có lịch sử làm bài
            </h2>
            <p
              className="font-sans mb-6"
              style={{ fontSize: "14px", color: "var(--muted-foreground)" }}
            >
              Hoàn thành bài thi đầu tiên để xem tiến độ và biểu đồ điểm số.
            </p>
            <Link
              href="/library"
              className="font-sans font-semibold text-[14px] rounded-[12px] px-5 py-2.5 transition-all duration-200 btn-press inline-flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #F4899A 0%, #7C6FDB 100%)", color: "#FFFFFF" }}
            >
              Xem thư viện đề thi
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* ── Stats row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <StatCard
                icon={<Target className="w-6 h-6" style={{ color: "#F4899A" }} />}
                value={`${avgScore}%`}
                label="Điểm trung bình"
                delay="50ms"
                accent="teal"
              />
              <StatCard
                icon={<Award className="w-6 h-6" style={{ color: "#7C6FDB" }} />}
                value={`${bestScore}%`}
                label="Điểm cao nhất"
                delay="100ms"
                accent="indigo"
              />
              <StatCard
                icon={<Calendar className="w-6 h-6" style={{ color: "#F4899A" }} />}
                value={`${totalAttempts}`}
                label="Bài đã hoàn thành"
                delay="150ms"
                accent="coral"
              />
            </div>

            {/* ── Score progression chart ── */}
            {progression.length >= 2 && (
              <div className="rounded-[16px] p-6 mb-8 float-reveal glass-card-pink">
                <h2
                  className="font-sans font-semibold mb-1"
                  style={{ fontSize: "16px", color: "var(--foreground)" }}
                >
                  Tiến độ điểm số
                </h2>
                <p
                  className="font-sans mb-6"
                  style={{ fontSize: "13px", color: "var(--muted-foreground)" }}
                >
                  Biểu đồ điểm phần trăm qua các lần làm bài
                </p>
                <ScoreProgressionChart
                    points={progression.map((p) => ({
                      label: formatViDate(p.date, "short"),
                      percentage: p.percentage,
                      title: p.title,
                      mode: p.mode,
                    }))}
                  />
              </div>
            )}

            {/* ── Subject averages ── */}
            {subjectAverages.length > 0 && (
              <div className="rounded-[16px] p-6 mb-8 float-reveal glass-card-pink">
                <h2
                  className="font-sans font-semibold mb-1"
                  style={{ fontSize: "16px", color: "var(--foreground)" }}
                >
                  Trung bình theo môn
                </h2>
                <p
                  className="font-sans mb-6"
                  style={{ fontSize: "13px", color: "var(--muted-foreground)" }}
                >
                  So sánh kết quả giữa các môn học
                </p>
                <SubjectAveragesChart
                  data={subjectAverages.map((s) => ({
                    subjectName: s.subjectName,
                    averagePercentage: s.averagePercentage,
                    attemptCount: s.attemptCount,
                    color: subjectColors[s.subjectSlug] || "#9F7AEA",
                  }))}
                />
              </div>
            )}

            {/* ── Full attempt list ── */}
            <div className="rounded-[16px] p-6 mb-8 float-reveal glass-card-pink">
              <h2
                className="font-sans font-semibold mb-4"
                style={{ fontSize: "16px", color: "var(--foreground)" }}
              >
                Tất cả bài đã làm
              </h2>

              {/* ── Filter & sort controls ── */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 flex-wrap">
                {/* Subject filters */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 font-sans text-[13px] font-medium" style={{ color: "var(--muted-foreground)" }}>
                    <Filter className="w-4 h-4" />
                    Môn:
                  </div>
                  <Link
                    href="/history"
                    className="font-sans font-medium text-[13px] rounded-full px-3.5 py-1.5 transition-all duration-150 btn-press"
                    style={
                      !selectedSubject
                        ? {
                            background: "linear-gradient(135deg, #F4899A 0%, #7C6FDB 100%)",
                            color: "#FFFFFF",
                            boxShadow: "0 4px 16px rgba(244,137,154,0.25)",
                          }
                        : {
                            background: "var(--card)",
                            color: "var(--foreground)",
                            border: "1px solid rgba(244,137,154,0.25)",
                          }
                    }
                  >
                    Tất cả ({history.length})
                  </Link>
                  {historySubjectSlugs.map((slug) => {
                    const color = subjectColors[slug] ?? "#9F7AEA";
                    const label = subjectLabels[slug] ?? slug;
                    const count = history.filter((h) => h.subjectSlug === slug).length;
                    return (
                      <Link
                        key={slug}
                        href={`/history?subject=${slug}`}
                        className="font-sans font-medium text-[13px] rounded-full px-3.5 py-1.5 transition-all duration-150 btn-press"
                        style={
                          selectedSubject === slug
                            ? {
                                background: color,
                                color: "#FFFFFF",
                                boxShadow: `0 4px 16px ${color}40`,
                              }
                            : {
                                background: "var(--card)",
                                color: "var(--foreground)",
                                border: "1px solid rgba(244,137,154,0.25)",
                              }
                        }
                      >
                        {label} ({count})
                      </Link>
                    );
                  })}
                </div>

                {/* Sort buttons */}
                <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
                  <div className="flex items-center gap-1.5 font-sans text-[13px] font-medium" style={{ color: "var(--muted-foreground)" }}>
                    <ArrowDownUp className="w-4 h-4" />
                    Sắp xếp:
                  </div>
                  {sortOptions.map((opt) => {
                    const isActive = selectedSort === opt.value;
                    const sortHref = selectedSubject
                      ? `/history?subject=${selectedSubject}&sort=${opt.value}`
                      : `/history?sort=${opt.value}`;
                    return (
                      <Link
                        key={opt.value}
                        href={sortHref}
                        className="font-sans font-medium text-[13px] rounded-full px-3.5 py-1.5 transition-all duration-150 btn-press"
                        style={
                          isActive
                            ? {
                                background: "var(--secondary)",
                                color: "var(--foreground)",
                                border: "1px solid var(--border)",
                              }
                            : {
                                background: "transparent",
                                color: "var(--muted-foreground)",
                                border: "1px solid transparent",
                              }
                        }
                      >
                        {opt.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* ── Attempt list ── */}
              {sorted.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="font-sans" style={{ fontSize: "14px", color: "var(--muted-foreground)" }}>
                    Không có bài làm trong mục này.
                  </p>
                </div>
              ) : (
                <div
                  className="divide-y"
                  style={{ borderColor: "var(--border)" }}
                >
                  {sorted.map((entry) => (
                    <HistoryRow key={entry.id} entry={entry} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

// ── Stat card ──
function StatCard({
  icon,
  value,
  label,
  delay,
  accent,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  delay: string;
  accent: "teal" | "indigo" | "coral";
}) {
  const accentBg = {
    teal: "rgba(244, 137, 154, 0.12)",
    indigo: "rgba(124, 111, 219, 0.12)",
    coral: "rgba(244, 137, 154, 0.12)",
  }[accent];

  return (
    <div
      className="rounded-[16px] p-6 float-reveal flex flex-col glass-card"
      style={{ animationDelay: delay }}
    >
      <div
        className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-4"
        style={{ background: accentBg }}
      >
        {icon}
      </div>
      <span
        className="font-serif font-normal leading-none mb-1"
        style={{ fontSize: "40px", color: "var(--foreground)" }}
      >
        {value}
      </span>
      <span
        className="font-sans text-[13px]"
        style={{ color: "var(--muted-foreground)" }}
      >
        {label}
      </span>
    </div>
  );
}

// ── History row ──
function HistoryRow({ entry }: { entry: HistoryEntry }) {
  const scoreColor = subjectColors[entry.subjectSlug] ?? "#F4899A";

  return (
    <Link
      href={`/quiz/${entry.deThiId}`}
      className="flex items-center justify-between p-4 rounded-[12px] group transition-all duration-200 hover:bg-[var(--secondary)]"
    >
      <div className="min-w-0 flex-1">
        <h3
          className="font-sans font-semibold truncate"
          style={{ fontSize: "14px", color: "var(--foreground)" }}
        >
          {entry.deThiTitle}
        </h3>
        <span
          className="font-sans text-[12px]"
          style={{ color: "var(--muted-foreground)" }}
        >
          {entry.subjectName} · {""}
          {formatViDate(entry.completedAt, "long")}
        </span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span
          className="font-sans font-medium text-[10px] uppercase tracking-wider px-2 py-1 rounded-full"
          style={{
            background: entry.mode === "test" ? "rgba(124,111,219,0.12)" : "rgba(244,137,154,0.12)",
            color: entry.mode === "test" ? "#7C6FDB" : "#F4899A",
          }}
        >
          {entry.mode === "test" ? "Test" : "Practice"}
        </span>
        <span
          className="font-sans font-semibold"
          style={{ fontSize: "14px", color: scoreColor }}
        >
          {entry.percentage}%
        </span>
        <div
          className="w-14 h-2 rounded-full overflow-hidden"
          style={{ background: "var(--secondary)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${entry.percentage}%`,
              background: scoreColor,
            }}
          />
        </div>
      </div>
    </Link>
  );
}
