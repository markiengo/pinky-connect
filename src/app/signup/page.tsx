"use client";

import { useActionState } from "react";
import { signupAction } from "@/lib/auth";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return await signupAction(formData);
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
          <p className="mt-1 text-sm text-text-muted">Tạo tài khoản để bắt đầu luyện đề</p>
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
              minLength={3}
              className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-line text-sm font-medium outline-none transition-all focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/30"
              placeholder="Ít nhất 3 ký tự"
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
              autoComplete="new-password"
              required
              minLength={6}
              className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-line text-sm font-medium outline-none transition-all focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/30"
              placeholder="Ít nhất 6 ký tự"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full h-12 rounded-pill bg-ink text-on-ink text-sm font-extrabold transition-all hover:-translate-y-px hover:shadow-[var(--shadow-pop)] disabled:opacity-60 disabled:translate-y-0"
          >
            {pending ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>

          <p className="text-center text-xs font-semibold text-text-muted">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-ink font-bold hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
