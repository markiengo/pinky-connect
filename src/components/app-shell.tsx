"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  Home,
  LayoutGrid,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Trang chủ" },
  { href: "/subjects", icon: LayoutGrid, label: "Môn học" },
  { href: "/practice", icon: BookOpen, label: "Luyện đề" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* ── Desktop icon rail ── */}
      <aside className="hidden md:flex flex-col items-center gap-2.5 w-20 py-4 m-4 mr-0 bg-surface rounded-panel shadow-[var(--shadow-panel)]">
        {/* brand */}
        <Link
          href="/"
          className="grid place-items-center w-10 h-10 mb-1 rounded-[14px] bg-ink text-on-ink"
          title="AI Exam Prep"
        >
          <GraduationCap className="w-[18px] h-[18px]" />
        </Link>

        {/* nav pills */}
        <nav className="flex flex-col gap-1.5 mt-2.5 p-2 rounded-pill bg-surface-2">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={`grid place-items-center w-10 h-10 rounded-full transition-all duration-150 ${
                  active
                    ? "bg-ink text-on-ink"
                    : "text-text-muted hover:bg-surface hover:text-ink hover:-translate-y-px"
                }`}
              >
                <Icon className="w-[17px] h-[17px]" />
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* settings */}
        <Link
          href="/settings"
          title="Cài đặt"
          className="grid place-items-center w-10 h-10 rounded-full text-text-muted transition-all duration-150 hover:bg-surface hover:text-ink hover:-translate-y-px"
        >
          <Settings className="w-[17px] h-[17px]" />
        </Link>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 overflow-y-auto px-4 md:px-6 pt-5 pb-24 md:pb-7 scroll-smooth [scrollbar-width:thin] [scrollbar-color:var(--ink-faint,rgba(23,25,28,0.4))_transparent]">
        {children}
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed inset-x-0 bottom-0 z-50 flex items-center justify-around h-16 bg-surface/90 backdrop-blur-lg border-t border-line safe-area-pb">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-colors ${
                active ? "text-ink" : "text-text-muted"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
