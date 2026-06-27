import { AppShell } from "@/components/app-shell";
import { getSession } from "@/lib/session";
import { getQuizHistory, getSubjectAverages } from "@/lib/history";
import { User, Calendar, Award, Target, TrendingUp, LogOut } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/lib/auth";
import { SubjectAveragesChart } from "@/components/charts";

const subjectColors: Record<string, string> = {
  ke_toan: "#9F7AEA",
  tai_chinh_ngan_hang: "#A8E6CF",
  quan_tri_kinh_doanh: "#F4899A",
  kinh_te_vi_mo: "#4ECDC4",
  phap_luat_dai_cuong: "#5B5FA8",
};

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const history = await getQuizHistory();
  const subjectAverages = await getSubjectAverages();
  const totalAttempts = history.length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(
          history.reduce((sum, h) => sum + h.percentage, 0) / totalAttempts
        )
      : 0;
  const bestScore =
    totalAttempts > 0 ? Math.max(...history.map((h) => h.percentage)) : 0;

  const initials = session.username.charAt(0).toUpperCase();

  return (
    <AppShell username={session.username}>
      <div className="max-w-[800px] mx-auto w-full">
        {/* ── Profile header card ── */}
        <div
          className="rounded-[16px] p-8 mb-8 float-reveal flex items-center gap-6 glass-card-pink"
        >
          {/* Avatar */}
          <div
            className="grid place-items-center rounded-full flex-shrink-0"
            style={{
              width: "84px",
              height: "84px",
              background: "linear-gradient(135deg, #F4899A 0%, #7C6FDB 100%)",
              color: "#FFFFFF",
              fontSize: "32px",
              fontWeight: 700,
              fontFamily: "Schibsted Grotesk, Plus Jakarta Sans, sans-serif",
              boxShadow: "0 8px 24px rgba(244,137,154,0.25)",
            }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <span
              className="font-sans font-semibold text-[11px] uppercase tracking-[0.08em]"
              style={{ color: "#F4899A" }}
            >
              Hồ sơ
            </span>
            <h1
              className="font-serif font-normal leading-tight"
              style={{ fontSize: "30px", color: "var(--foreground)" }}
            >
              {session.username}
            </h1>
            <p
              className="font-sans"
              style={{ fontSize: "13px", color: "var(--muted-foreground)" }}
            >
              Học viên · Crambox
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              title="Đăng xuất"
              className="grid place-items-center rounded-[12px] transition-colors duration-150 hover:bg-[var(--secondary)] glass-card"
              style={{
                width: "44px",
                height: "44px",
                color: "var(--muted-foreground)",
              }}
            >
              <LogOut className="w-[18px] h-[18px]" />
            </button>
          </form>
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <ProfileStat
            icon={<Target className="w-6 h-6" style={{ color: "#F4899A" }} />}
            value={`${avgScore}%`}
            label="Điểm trung bình"
            delay="50ms"
            accent="teal"
          />
          <ProfileStat
            icon={<Award className="w-6 h-6" style={{ color: "#7C6FDB" }} />}
            value={`${bestScore}%`}
            label="Điểm cao nhất"
            delay="100ms"
            accent="indigo"
          />
          <ProfileStat
            icon={<Calendar className="w-6 h-6" style={{ color: "#F4899A" }} />}
            value={`${totalAttempts}`}
            label="Bài đã hoàn thành"
            delay="150ms"
            accent="coral"
          />
        </div>

        {/* ── Subject performance ── */}
        {subjectAverages.length > 0 && (
          <div className="rounded-[16px] p-6 mb-8 float-reveal glass-card-pink">
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                style={{ background: "rgba(244,137,154,0.10)" }}
              >
                <TrendingUp className="w-4 h-4" style={{ color: "#F4899A" }} />
              </div>
              <h2
                className="font-sans font-semibold"
                style={{ fontSize: "16px", color: "var(--foreground)" }}
              >
                Hiệu suất theo môn
              </h2>
            </div>
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

        {/* ── Quick links ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link
            href="/history"
            className="rounded-[16px] p-6 transition-transform duration-300 hover:-translate-y-[3px] btn-press flex items-center gap-4 float-reveal glass-card"
            style={{ borderColor: "rgba(244,137,154,0.18)" }}
          >
            <div
              className="w-14 h-14 rounded-[14px] flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(244,137,154,0.08)" }}
            >
              <TrendingUp className="w-6 h-6" style={{ color: "#F4899A" }} />
            </div>
            <div>
              <h3
                className="font-sans font-semibold mb-1"
                style={{ fontSize: "16px", color: "var(--foreground)" }}
              >
                Xem lịch sử
              </h3>
              <p
                className="font-sans"
                style={{ fontSize: "13px", color: "var(--muted-foreground)" }}
              >
                Biểu đồ điểm và chi tiết bài làm
              </p>
            </div>
          </Link>

          <Link
            href="/library"
            className="rounded-[16px] p-6 transition-transform duration-300 hover:-translate-y-[3px] btn-press flex items-center gap-4 float-reveal glass-card"
            style={{ borderColor: "rgba(244,137,154,0.18)", animationDelay: "80ms" }}
          >
            <div
              className="w-14 h-14 rounded-[14px] flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(244,137,154,0.08)" }}
            >
              <User className="w-6 h-6" style={{ color: "#F4899A" }} />
            </div>
            <div>
              <h3
                className="font-sans font-semibold mb-1"
                style={{ fontSize: "16px", color: "var(--foreground)" }}
              >
                Luyện tập thêm
              </h3>
              <p
                className="font-sans"
                style={{ fontSize: "13px", color: "var(--muted-foreground)" }}
              >
                Khám phá thư viện đề thi
              </p>
            </div>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function ProfileStat({
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
