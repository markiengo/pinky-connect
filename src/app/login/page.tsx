"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/auth";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return await loginAction(formData);
    },
    null
  );

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 relative overflow-hidden">
      {/* Blurred cinematic background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/background.png)",
          filter: "blur(8px) brightness(0.7)",
          transform: "scale(1.1)",
        }}
      />
      {/* Purple-tinted gradient overlay for legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(30,27,58,0.45) 0%, rgba(30,27,58,0.20) 50%, rgba(30,27,58,0.55) 100%)",
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo — frosted glass pill */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="flex items-center gap-3 rounded-full px-5 py-3 mb-1"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.20)",
            }}
          >
            <div
              className="grid place-items-center w-10 h-10 rounded-[12px]"
              style={{
                background: "linear-gradient(135deg, #5B8A7A 0%, #7C6FDB 100%)",
                color: "#FFFFFF",
              }}
            >
              <GraduationCap className="w-5 h-5" />
            </div>
            <h1
              className="font-sans text-xl font-bold tracking-tight"
              style={{ color: "#FFFFFF" }}
            >
              AI Exam Prep
            </h1>
          </div>
          <p
            className="mt-2 text-sm"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Đăng nhập để bắt đầu luyện đề
          </p>
        </div>

        {/* Form card */}
        <form
          action={formAction}
          className="space-y-4 p-6 rounded-[16px]"
          style={{
            background: "#E8E4F2",
            boxShadow: "0 8px 40px rgba(30,27,58,0.18)",
          }}
        >
          {state?.error && (
            <div
              className="rounded-[8px] px-4 py-3 text-sm font-semibold"
              style={{
                background: "rgba(192,86,86,0.10)",
                border: "1px solid rgba(192,86,86,0.3)",
                color: "#C05656",
              }}
            >
              {state.error}
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="block text-xs font-extrabold"
              style={{ color: "rgba(30,27,58,0.7)" }}
            >
              Tên đăng nhập
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full h-12 px-4 rounded-[8px] text-sm font-medium outline-none transition-all"
              style={{
                background: "#E8E4F2",
                border: "1px solid #D9D3E6",
                color: "#1E1B3A",
              }}
              placeholder="Nhập tên đăng nhập"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#5B8A7A";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(91,138,122,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#D9D3E6";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-extrabold"
              style={{ color: "rgba(30,27,58,0.7)" }}
            >
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full h-12 px-4 rounded-[8px] text-sm font-medium outline-none transition-all"
              style={{
                background: "#E8E4F2",
                border: "1px solid #D9D3E6",
                color: "#1E1B3A",
              }}
              placeholder="Nhập mật khẩu"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#5B8A7A";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(91,138,122,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#D9D3E6";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full h-12 rounded-[999px] text-sm font-extrabold transition-all hover:-translate-y-px disabled:opacity-60 disabled:translate-y-0"
            style={{
              background: "linear-gradient(135deg, #F4899A 0%, #E8788A 100%)",
              color: "#FFFFFF",
              boxShadow: "0 4px 16px rgba(244,137,154,0.30)",
            }}
          >
            {pending ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

        </form>

        {/* Demo credentials — outside form, always visible */}
        <div
          className="mt-4 rounded-[12px] px-4 py-3"
          style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <p
            className="text-xs font-bold"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            Tài khoản demo:
          </p>
          <p
            className="text-xs font-semibold mt-0.5"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Tên đăng nhập: <span className="font-bold" style={{ color: "#FFFFFF" }}>demo</span>
            {"  ·  "}
            Mật khẩu: <span className="font-bold" style={{ color: "#FFFFFF" }}>demo1234</span>
          </p>
        </div>
      </div>
    </div>
  );
}
