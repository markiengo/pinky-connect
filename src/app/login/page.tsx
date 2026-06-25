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
    <div className="min-h-dvh flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="grid place-items-center w-14 h-14 rounded-2xl bg-ink text-on-ink mb-3 shadow-[var(--shadow-pop)]">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">AI Exam Prep</h1>
          <p className="mt-1 text-sm text-text-muted">Đăng nhập để bắt đầu luyện đề</p>
        </div>

        {/* Form card */}
        <form
          action={formAction}
          className="bg-surface rounded-card shadow-[var(--shadow-panel)] p-6 space-y-4"
        >
          {state?.error && (
            <div className="rounded-xl bg-bad/30 border border-bad/40 px-4 py-3 text-sm font-semibold text-bad-ink">
              {state.error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="username" className="block text-xs font-extrabold text-ink/70">
              Tên đăng nhập
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-line text-sm font-medium outline-none transition-all focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/30"
              placeholder="Nhập tên đăng nhập"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-extrabold text-ink/70">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-line text-sm font-medium outline-none transition-all focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/30"
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full h-12 rounded-pill bg-ink text-on-ink text-sm font-extrabold transition-all hover:-translate-y-px hover:shadow-[var(--shadow-pop)] disabled:opacity-60 disabled:translate-y-0"
          >
            {pending ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          {/* Demo hint */}
          <div className="rounded-xl bg-c-cream border border-ink/[0.07] px-4 py-3">
            <p className="text-xs font-bold text-ink/70">Tài khoản demo:</p>
            <p className="text-xs font-semibold text-ink/50 mt-0.5">
              Tên đăng nhập: <span className="font-bold text-ink">demo</span>
              {"  ·  "}
              Mật khẩu: <span className="font-bold text-ink">demo1234</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
