"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  MessageSquare,
  History,
  User,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { logoutAction as logout } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/library", icon: Library, label: "Thư viện" },
  { href: "/practice", icon: MessageSquare, label: "Chatbox" },
  { href: "/history", icon: History, label: "Lịch sử" },
  { href: "/profile", icon: User, label: "Hồ sơ" },
] as const;

export function AppShell({
  children,
  username,
}: {
  children: React.ReactNode;
  username?: string | null;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* ── Desktop icon rail ── */}
      <aside
        className="hidden md:flex flex-col items-center gap-2.5 w-20 py-4 m-4 mr-0 rounded-[20px]"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, rgba(244,137,154,0.06) 100%)",
          boxShadow: "0 4px 20px rgba(244,137,154,0.08), 0 1px 4px rgba(30,27,58,0.06)",
          border: "1px solid rgba(244,137,154,0.12)",
        }}
      >
        {/* brand */}
        <Link
          href="/dashboard"
          className="grid place-items-center w-10 h-10 mb-1 rounded-[14px]"
          title="AI Exam Prep"
          style={{ background: "#1E1B3A", color: "#FFFFFF" }}
        >
          <GraduationCap className="w-[18px] h-[18px]" />
        </Link>

        {/* nav pills */}
        <nav
          className="flex flex-col gap-1.5 mt-2.5 p-2 rounded-[999px]"
          style={{ background: "rgba(244,137,154,0.08)" }}
        >
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className="grid place-items-center w-10 h-10 rounded-full transition-all duration-150"
                style={{
                  background: active ? "#5B8A7A" : "transparent",
                  color: active ? "#FFFFFF" : "#5C5875",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "#FFFFFF";
                    e.currentTarget.style.color = "#1E1B3A";
                    e.currentTarget.style.boxShadow = "0 0 12px rgba(244,137,154,0.20)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#5C5875";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <Icon className="w-[17px] h-[17px]" />
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* user avatar */}
        {username && (
          <div
            className="grid place-items-center w-10 h-10 mb-1 rounded-full font-sans font-bold"
            title={username}
            style={{
              background: "rgba(244,137,154,0.12)",
              color: "#1E1B3A",
              fontSize: "14px",
            }}
          >
            {username.charAt(0).toUpperCase()}
          </div>
        )}

        {/* logout */}
        <form action={logout}>
          <button
            type="submit"
            title="Đăng xuất"
            className="grid place-items-center w-10 h-10 rounded-full transition-all duration-150"
            style={{ color: "#5C5875", background: "transparent" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#FFFFFF";
              e.currentTarget.style.color = "#1E1B3A";
              e.currentTarget.style.boxShadow = "0 0 12px rgba(91,138,122,0.15)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#5C5875";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <LogOut className="w-[17px] h-[17px]" />
          </button>
        </form>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden px-4 md:px-6 pt-5 pb-24 md:pb-7 scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(30,27,58,0.4)_transparent] aurora-bg">
        {children}
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="md:hidden fixed inset-x-0 bottom-0 z-50 flex items-center justify-around h-16 safe-area-pb"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(244,137,154,0.15)",
        }}
      >
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-colors"
              style={{
                color: active ? "#5B8A7A" : "#5C5875",
              }}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
        {/* mobile logout */}
        <form action={logout}>
          <button
            type="submit"
            className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-colors"
            style={{ color: "#5C5875" }}
          >
            <LogOut className="w-5 h-5" />
            <span>Thoát</span>
          </button>
        </form>
      </nav>
    </div>
  );
}
