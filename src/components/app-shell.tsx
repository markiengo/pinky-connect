"use client";

import Link from "next/link";
import { LogoImage } from "@/components/logo-image";
import { usePathname } from "next/navigation";
import { useRef, useLayoutEffect, useState, useCallback } from "react";
import {
  LayoutDashboard,
  Library,
  MessageSquare,
  History,
  User,
  LogOut,
  CalendarClock,
  FileSearch,
  HeartPulse,
  Layers,
  Sun,
  Moon,
} from "lucide-react";
import { logoutAction as logout } from "@/lib/auth";
import { useTheme } from "./theme-provider";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/library", icon: Library, label: "Thư viện" },
  { href: "/practice", icon: MessageSquare, label: "Chatbox" },
  { href: "/calendar", icon: CalendarClock, label: "Lịch ôn thi" },
  { href: "/history", icon: History, label: "Lịch sử" },
  { href: "/profile", icon: User, label: "Hồ sơ" },
] as const;

const comingSoonItems = [
  { icon: Layers, label: "Flashcards" },
  { icon: FileSearch, label: "Phân tích đề cương" },
  { icon: HeartPulse, label: "Chăm sóc tinh thần" },
] as const;

export function AppShell({
  children,
  username,
}: {
  children: React.ReactNode;
  username?: string | null;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<{ top: number; height: number; visible: boolean }>({
    top: 0,
    height: 0,
    visible: false,
  });

  const moveToHref = useCallback((href: string) => {
    const targetEl = itemRefs.current[href];
    const navEl = navRef.current;
    if (targetEl && navEl) {
      const itemRect = targetEl.getBoundingClientRect();
      const navRect = navEl.getBoundingClientRect();
      setIndicator({
        top: itemRect.top - navRect.top,
        height: itemRect.height,
        visible: true,
      });
    }
  }, []);

  const updateIndicator = useCallback(() => {
    moveToHref(pathname);
  }, [pathname, moveToHref]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateIndicator]);

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* ── Desktop icon rail ── */}
      <aside
        className="hidden md:flex flex-col gap-2.5 w-52 py-4 m-4 mr-0 rounded-[20px]"
        style={{
          background: "var(--sidebar)",
          boxShadow: "var(--shadow-card)",
          border: "1px solid var(--border)",
        }}
      >
        {/* brand */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 mx-3 mb-1 rounded-[14px]"
          title="Crambox"
        >
          <LogoImage width={40} height={40} />
          <span
            className="font-sans font-bold text-[15px]"
            style={{ color: "var(--sidebar-foreground)" }}
          >
            Crambox
          </span>
        </Link>

        {/* nav items */}
        <nav className="flex flex-col gap-1 mx-2 relative" ref={navRef}>
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                ref={(el) => { itemRefs.current[href] = el; }}
                href={href}
                prefetch
                title={label}
                className="relative flex items-center gap-3 h-10 px-3 rounded-[10px] transition-colors duration-150 z-10"
                style={{
                  color: active ? "var(--accent-foreground)" : "var(--muted-foreground)",
                }}
                onClick={() => moveToHref(href)}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "var(--sidebar-accent)";
                    e.currentTarget.style.color = "var(--sidebar-accent-foreground)";
                    e.currentTarget.style.boxShadow = "var(--shadow-card)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--muted-foreground)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                <Icon className="w-[17px] h-[17px] flex-shrink-0" />
                <span className="font-sans font-semibold text-[13px]">{label}</span>
              </Link>
            );
          })}
          {/* Sliding liquid indicator */}
          <div
            className="absolute left-0 right-0 rounded-[10px] pointer-events-none"
            style={{
              background: "var(--accent)",
              boxShadow: "var(--shadow-card)",
              transform: `translateY(${indicator.top}px)`,
              height: indicator.height,
              opacity: indicator.visible ? 1 : 0,
              transition: "transform 250ms cubic-bezier(0.32, 0.72, 0, 1), opacity 150ms ease-out",
              zIndex: 1,
            }}
          />
        </nav>

        {/* coming soon items */}
        <div className="flex flex-col gap-1 mx-2 mt-1">
          <div
            className="px-3 py-1 font-sans font-bold text-[10px] uppercase tracking-wider"
            style={{ color: "var(--muted-foreground)" }}
          >
            Sắp ra mắt
          </div>
          {comingSoonItems.map(({ icon: Icon, label }) => (
            <div
              key={label}
              title={`${label} — Sắp ra mắt`}
              className="flex items-center gap-3 h-10 px-3 rounded-[10px] relative"
              style={{ color: "var(--muted-foreground)", background: "transparent" }}
            >
              <Icon className="w-[17px] h-[17px] flex-shrink-0" />
              <span className="font-sans font-semibold text-[13px] flex-1">{label}</span>
              <span
                className="px-1.5 py-px rounded-full font-sans font-bold text-[8px] uppercase tracking-wider leading-none"
                style={{ background: "rgba(159,122,234,0.15)", color: "var(--primary)" }}
              >
                Soon
              </span>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        {/* theme toggle */}
        <div className="flex items-center gap-1 mx-2 mb-1 p-1 rounded-[10px]" style={{ background: "var(--sidebar-accent)" }}>
          <button
            type="button"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTheme("light", { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
            }}
            aria-label="Light mode"
            className="grid place-items-center w-8 h-8 rounded-[8px] transition-[background,color] duration-150"
            style={{
              background: theme === "light" ? "var(--background)" : "transparent",
              color: theme === "light" ? "#F4899A" : "var(--muted-foreground)",
            }}
          >
            <Sun className="w-4 h-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTheme("dark", { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
            }}
            aria-label="Dark mode"
            className="grid place-items-center w-8 h-8 rounded-[8px] transition-[background,color] duration-150"
            style={{
              background: theme === "dark" ? "var(--background)" : "transparent",
              color: theme === "dark" ? "#9F7AEA" : "var(--muted-foreground)",
            }}
          >
            <Moon className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* user avatar + logout */}
        <div className="flex items-center gap-2.5 mx-3 mb-1">
          {username && (
            <div
              className="grid place-items-center w-9 h-9 rounded-full font-sans font-bold flex-shrink-0"
              title={username}
              style={{
                background: "var(--sidebar-accent)",
                color: "var(--sidebar-foreground)",
                fontSize: "13px",
              }}
            >
              {username.charAt(0).toUpperCase()}
            </div>
          )}
          {username && (
            <span
              className="font-sans font-semibold text-[13px] flex-1 truncate"
              style={{ color: "var(--sidebar-foreground)" }}
            >
              {username}
            </span>
          )}
          <form action={logout}>
            <button
              type="submit"
              title="Đăng xuất"
              className="grid place-items-center w-9 h-9 rounded-full transition-colors duration-150 flex-shrink-0"
              style={{ color: "var(--muted-foreground)", background: "transparent" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--sidebar-accent)";
                e.currentTarget.style.color = "var(--sidebar-accent-foreground)";
                e.currentTarget.style.boxShadow = "var(--shadow-card)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--muted-foreground)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <LogOut className="w-[17px] h-[17px]" />
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main
        key={pathname}
        className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden px-4 md:px-6 pt-5 pb-24 md:pb-7 scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(30,27,58,0.4)_transparent] aurora-bg [content-visibility:auto] page-enter"
      >
        {children}
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="md:hidden fixed inset-x-0 bottom-0 z-40 flex items-center justify-around h-16 safe-area-pb relative"
        style={{
          background: "var(--sidebar)",
          backdropFilter: "blur(6px)",
          borderTop: "1px solid var(--border)",
        }}
      >
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              prefetch
              className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-colors"
              style={{
                color: active ? "var(--accent)" : "var(--muted-foreground)",
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
            style={{ color: "var(--muted-foreground)" }}
          >
            <LogOut className="w-5 h-5" />
            <span>Thoát</span>
          </button>
        </form>
      </nav>
    </div>
  );
}
