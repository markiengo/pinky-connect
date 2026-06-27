"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-1 p-1 rounded-[14px]"
      style={{
        background: "linear-gradient(135deg, #1E1B3A 0%, #2A2750 55%, #3D2E5C 100%)",
        border: "1px solid rgba(159,122,234,0.25)",
        boxShadow: "0 8px 24px rgba(30,27,58,0.25)",
      }}
      aria-label="Theme switcher"
    >
      <button
        type="button"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setTheme("light", { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        }}
        aria-label="Light mode"
        aria-pressed={theme === "light"}
        className="grid place-items-center w-9 h-9 rounded-[10px] transition-[background,color,box-shadow] duration-200"
        style={{
          background: theme === "light" ? "#FFFFFF" : "transparent",
          color: theme === "light" ? "#F4899A" : "rgba(255,255,255,0.45)",
          boxShadow: theme === "light" ? "0 2px 8px rgba(255,255,255,0.25)" : "none",
        }}
      >
        <Sun className="w-[18px] h-[18px]" strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setTheme("dark", { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        }}
        aria-label="Dark mode"
        aria-pressed={theme === "dark"}
        className="grid place-items-center w-9 h-9 rounded-[10px] transition-[background,color,box-shadow] duration-200"
        style={{
          background: theme === "dark" ? "#FFFFFF" : "transparent",
          color: theme === "dark" ? "#9F7AEA" : "rgba(255,255,255,0.45)",
          boxShadow: theme === "dark" ? "0 2px 8px rgba(255,255,255,0.25)" : "none",
        }}
      >
        <Moon className="w-[18px] h-[18px]" strokeWidth={2} />
      </button>
    </div>
  );
}
