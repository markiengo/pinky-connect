import { ArrowRight, Search, Library, TrendingUp, Award, Target } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { getSession } from "@/lib/session";
import { getDashboardStats } from "@/lib/history";
import { formatViDate } from "@/lib/format-date";

const subjects = [
  {
    label: "Kế toán",
    desc: "Nguyên lý kế toán, BCTC",
    color: "#9F7AEA",
    gradClass: "dream-grad-accounting",
    slug: "ke-toan",
  },
  {
    label: "Tài chính – Ngân hàng",
    desc: "Tài chính tiền tệ, NHTM",
    color: "#7C6FDB",
    gradClass: "dream-grad-finance",
    slug: "tai-chinh-ngan-hang",
  },
  {
    label: "Quản trị Kinh doanh",
    desc: "Marketing, chiến lược",
    color: "#F4899A",
    gradClass: "dream-grad-business",
    slug: "quan-tri-kinh-doanh",
  },
] as const;

export default async function DashboardPage() {
  const session = await getSession();
  const stats = await getDashboardStats();

  return (
    <AppShell username={session?.username}>
      <div className="relative max-w-[1200px] mx-auto w-full">
        {/* ── Aurora background orbs ── */}
        <div
          className="aurora-orb w-[420px] h-[420px] -top-20 -right-20"
          style={{ background: "rgba(244, 137, 154, 0.28)" }}
        />
        <div
          className="aurora-orb w-[300px] h-[300px] top-[40%] -left-32"
          style={{ background: "rgba(91, 138, 122, 0.18)" }}
        />
        <div
          className="aurora-orb w-[260px] h-[260px] bottom-20 right-[10%]"
          style={{ background: "rgba(159, 122, 234, 0.14)" }}
        />

        {/* ── Welcome banner ── */}
        <div className="relative mb-8 reveal">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#F4899A" }}
            />
            <span
              className="font-sans font-semibold text-[11px] uppercase tracking-[0.08em]"
              style={{ color: "#F4899A" }}
            >
              Dashboard
            </span>
          </div>
          <h1
            className="font-serif font-normal leading-[1.1] tracking-[-0.02em] mb-2"
            style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "#1E1B3A" }}
          >
            Xin chào{session ? `, ${session.username}` : ""}
          </h1>
          <p
            className="font-sans max-w-[480px]"
            style={{ fontSize: "15px", color: "#5C5875", lineHeight: 1.6 }}
          >
            Tiếp tục luyện tập và theo dõi tiến độ của bạn.
          </p>
        </div>

        {/* ── 3 stat tiles ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <StatCard
            icon={<Target className="w-6 h-6" style={{ color: "#5B8A7A" }} />}
            value={`${stats.avgScore}%`}
            label="Điểm trung bình"
            delay="50ms"
            accent="teal"
          />
          <StatCard
            icon={<Award className="w-6 h-6" style={{ color: "#7C6FDB" }} />}
            value={`${stats.totalAttempts}`}
            label="Bài đã làm"
            delay="100ms"
            accent="indigo"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" style={{ color: "#F4899A" }} />}
            value={`${
              stats.totalAttempts > 0
                ? Math.max(...stats.recentAttempts.map((a) => a.percentage))
                : 0
            }%`}
            label="Điểm cao nhất"
            delay="150ms"
            accent="coral"
          />
        </div>

        {/* ── Subject cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {subjects.map((s, i) => (
            <SubjectCard key={s.label} subject={s} index={i} />
          ))}
        </div>

        {/* ── Recent activity ── */}
        <div className="rounded-[16px] p-6 mb-8 glass-card-pink float-reveal">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                style={{ background: "rgba(244, 137, 154, 0.12)" }}
              >
                <TrendingUp className="w-4 h-4" style={{ color: "#F4899A" }} />
              </div>
              <h2
                className="font-sans font-semibold"
                style={{ fontSize: "16px", color: "#1E1B3A" }}
              >
                Hoạt động gần đây
              </h2>
            </div>
            <Link
              href="/history"
              className="font-sans font-semibold text-[13px] transition-colors inline-flex items-center gap-1"
              style={{ color: "#5B8A7A" }}
            >
              Xem tất cả
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentAttempts.length === 0 ? (
            <div className="py-12 text-center">
              <p
                className="font-sans mb-5"
                style={{ fontSize: "15px", color: "#5C5875" }}
              >
                Chưa có hoạt động nào. Bắt đầu làm bài đầu tiên!
              </p>
              <Link
                href="/library"
                className="font-sans font-semibold text-[14px] rounded-[12px] px-6 py-3 transition-all duration-200 btn-press inline-flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #5B8A7A 0%, #7C6FDB 100%)",
                  color: "#FFFFFF",
                }}
              >
                <Library className="w-4 h-4" />
                Xem thư viện đề thi
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.recentAttempts.map((a, i) => (
                <Link
                  key={a.id}
                  href={`/quiz/${a.deThiId}`}
                  className="flex items-center justify-between p-4 rounded-[12px] transition-all duration-200 group"
                  style={{
                    background: "rgba(255, 255, 255, 0.5)",
                    border: "1px solid rgba(244, 137, 154, 0.12)",
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <h3
                      className="font-sans font-semibold truncate"
                      style={{ fontSize: "14px", color: "#1E1B3A" }}
                    >
                      {a.deThiTitle}
                    </h3>
                    <span
                      className="font-sans text-[12px]"
                      style={{ color: "#8F8AA3" }}
                    >
                      {a.subjectName} · {formatViDate(a.completedAt, "short")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className="font-sans font-bold"
                      style={{ fontSize: "14px", color: "#5B8A7A" }}
                    >
                      {a.percentage}%
                    </span>
                    <div
                      className="w-14 h-2 rounded-full overflow-hidden"
                      style={{ background: "rgba(217, 211, 230, 0.6)" }}
                    >
                      <div
                        className="h-full rounded-full dream-progress"
                        style={{ width: `${a.percentage}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── Quick actions ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <QuickAction
            href="/practice"
            icon={<Search className="w-6 h-6" style={{ color: "#5B8A7A" }} />}
            title="Tìm đề mới"
            desc="Tìm bằng AI hoặc tải PDF syllabus"
            accent="teal"
            delay="0ms"
          />
          <QuickAction
            href="/history"
            icon={<TrendingUp className="w-6 h-6" style={{ color: "#F4899A" }} />}
            title="Xem tiến độ"
            desc="Biểu đồ điểm số và thống kê"
            accent="coral"
            delay="80ms"
          />
        </div>
      </div>
    </AppShell>
  );
}

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
    teal: "rgba(91, 138, 122, 0.12)",
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
        style={{ fontSize: "40px", color: "#1E1B3A" }}
      >
        {value}
      </span>
      <span
        className="font-sans text-[13px]"
        style={{ color: "#5C5875" }}
      >
        {label}
      </span>
    </div>
  );
}

function SubjectCard({
  subject,
  index,
}: {
  subject: (typeof subjects)[number];
  index: number;
}) {
  return (
    <Link
      href={`/library?subject=${subject.slug}`}
      className="group relative rounded-[16px] p-6 text-white transition-all duration-300 hover:-translate-y-[4px] hover:scale-[1.02] btn-press float-reveal block overflow-hidden"
      style={{
        animationDelay: `${index * 100}ms`,
        boxShadow: "0 12px 40px rgba(30, 27, 58, 0.12)",
      }}
    >
      <div className={`absolute inset-0 ${subject.gradClass}`} />

      {/* Glass reflection overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
        }}
      />

      {/* Subject pattern overlay */}
      {subject.slug === "ke-toan" && (
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="dash-ledger"
              x="0"
              y="0"
              width="40"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="8" x2="40" y2="8" stroke="#FFFFFF" strokeWidth="1" />
              <line x1="0" y1="16" x2="40" y2="16" stroke="#FFFFFF" strokeWidth="1" />
              <line x1="0" y1="24" x2="40" y2="24" stroke="#FFFFFF" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dash-ledger)" />
        </svg>
      )}
      {subject.slug === "tai-chinh-ngan-hang" && (
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <g stroke="#FFFFFF" strokeWidth="1.5" fill="none">
            <line x1="20%" y1="20%" x2="20%" y2="75%" />
            <rect x="16%" y="35%" width="8%" height="25%" fill="#FFFFFF" fillOpacity="0.35" />
            <line x1="45%" y1="15%" x2="45%" y2="65%" />
            <rect x="41%" y="25%" width="8%" height="30%" fill="#FFFFFF" fillOpacity="0.35" />
            <line x1="70%" y1="25%" x2="70%" y2="80%" />
            <rect x="66%" y="40%" width="8%" height="30%" fill="#FFFFFF" fillOpacity="0.35" />
          </g>
        </svg>
      )}
      {subject.slug === "quan-tri-kinh-doanh" && (
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none"
          viewBox="0 0 200 200"
          preserveAspectRatio="xMidYMid slice"
        >
          <polyline points="20,160 60,120 100,130 140,70 180,50" fill="none" stroke="#FFFFFF" strokeWidth="2" />
          <polygon points="180,50 170,55 175,62" fill="#FFFFFF" />
          <line x1="20" y1="160" x2="180" y2="160" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <h3
            className="font-sans font-bold leading-tight"
            style={{ fontSize: "20px" }}
          >
            {subject.label}
          </h3>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>
        <p
          className="font-sans font-normal mb-5"
          style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)" }}
        >
          {subject.desc}
        </p>
        <span
          className="inline-flex items-center gap-1.5 font-sans font-semibold text-[12px] px-3 py-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.18)", color: "#FFFFFF" }}
        >
          Xem đề thi
        </span>
      </div>
    </Link>
  );
}

function QuickAction({
  href,
  icon,
  title,
  desc,
  accent,
  delay,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent: "teal" | "coral";
  delay: string;
}) {
  const accentColor = accent === "teal" ? "#5B8A7A" : "#F4899A";
  const accentBorder =
    accent === "teal"
      ? "rgba(91, 138, 122, 0.18)"
      : "rgba(244, 137, 154, 0.18)";
  const accentBg =
    accent === "teal"
      ? "rgba(91, 138, 122, 0.08)"
      : "rgba(244, 137, 154, 0.08)";

  return (
    <Link
      href={href}
      className="rounded-[16px] p-6 transition-all duration-300 hover:-translate-y-[3px] btn-press flex items-center gap-4 float-reveal glass-card"
      style={{
        borderColor: accentBorder,
        animationDelay: delay,
      }}
    >
      <div
        className="w-14 h-14 rounded-[14px] flex items-center justify-center flex-shrink-0"
        style={{ background: accentBg }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className="font-sans font-semibold mb-1"
          style={{ fontSize: "16px", color: "#1E1B3A" }}
        >
          {title}
        </h3>
        <p
          className="font-sans"
          style={{ fontSize: "13px", color: "#5C5875" }}
        >
          {desc}
        </p>
      </div>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
        style={{ background: accentBg }}
      >
        <ArrowRight className="w-4 h-4" style={{ color: accentColor }} />
      </div>
    </Link>
  );
}
