"use client";

import { logout } from "@/app/(auth)/actions";
import { LogOut } from "lucide-react";

export function LogoutButton({ variant = "icon" }: { variant?: "icon" | "full" }) {
  return (
    <form action={logout}>
      <button
        type="submit"
        className={`flex items-center gap-2 transition-all duration-150 hover:text-ink hover:-translate-y-px text-text-muted ${
          variant === "full"
            ? "px-4 py-2.5 rounded-pill text-[13px] font-bold"
            : "grid place-items-center w-10 h-10 rounded-full"
        }`}
        title="Đăng xuất"
      >
        <LogOut className="w-5 h-5" />
        {variant === "full" && <span>Thoát</span>}
      </button>
    </form>
  );
}
