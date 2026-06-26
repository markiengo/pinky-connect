"use client";

import { useState } from "react";
import { Sparkles, X, Check, Crown, Loader2 } from "lucide-react";

interface PremiumOverlayProps {
  open: boolean;
  onClose: () => void;
}

const FEATURES = [
  { label: "Không giới hạn lượt hỏi", icon: "∞" },
  { label: "Tải lên PDF không giới hạn", icon: "⬆" },
  { label: "Lưu lịch sử đầy đủ", icon: "☰" },
  { label: "Ưu tiên đề mới nhất", icon: "★" },
];

export function PremiumOverlay({ open, onClose }: PremiumOverlayProps) {
  const [upgrading, setUpgrading] = useState(false);

  if (!open) return null;

  const handleUpgrade = () => {
    setUpgrading(true);
    setTimeout(() => {
      setUpgrading(false);
      onClose();
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        opacity: open ? 1 : 0,
        transition: "opacity 300ms ease-out",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(30,27,58,0.55)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-[min(92vw,440px)] overflow-hidden rounded-[24px]"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
          transition: "opacity 350ms cubic-bezier(0.16,1,0.3,1), transform 350ms cubic-bezier(0.16,1,0.3,1)",
          background: "linear-gradient(165deg, #1E1B3A 0%, #2A2750 55%, #3D2A5E 100%)",
          boxShadow: "0 32px 80px rgba(30,27,58,0.45), 0 8px 24px rgba(159,122,234,0.15)",
          border: "1px solid rgba(159,122,234,0.18)",
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute -top-[40%] -right-[20%] w-[280px] h-[280px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(159,122,234,0.35) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute -bottom-[30%] -left-[15%] w-[220px] h-[220px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(244,137,154,0.20) 0%, transparent 65%)",
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 grid place-items-center w-9 h-9 rounded-full transition-all hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <X className="w-[18px] h-[18px]" />
        </button>

        {/* Content */}
        <div className="relative px-8 pt-10 pb-8 flex flex-col items-center text-center">
          {/* Crown badge */}
          <div
            className="grid place-items-center w-16 h-16 rounded-[20px] mb-5"
            style={{
              background: "linear-gradient(135deg, #9F7AEA 0%, #7C6FDB 100%)",
              boxShadow: "0 12px 32px rgba(159,122,234,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            <Crown className="w-8 h-8" style={{ color: "#FFFFFF" }} />
          </div>

          {/* Heading */}
          <h2
            className="font-sans font-bold text-[22px] leading-tight mb-2"
            style={{ color: "#FFFFFF", letterSpacing: "-0.02em" }}
          >
            Bạn đã dùng hết lượt hỏi
          </h2>

          {/* Subtext */}
          <p
            className="font-serif text-[15px] leading-relaxed mb-7 max-w-[320px]"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Nâng cấp lên <span style={{ color: "#F4899A" }}>Premium</span> để tìm đề không giới hạn và mở khóa đầy đủ tính năng.
          </p>

          {/* Feature list */}
          <div className="w-full space-y-3 mb-8">
            {FEATURES.map((f, i) => (
              <div
                key={f.label}
                className="flex items-center gap-3 px-4 py-3 rounded-[14px] text-left"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(-12px)",
                  transition: `opacity 400ms ease-out ${150 + i * 80}ms, transform 400ms ease-out ${150 + i * 80}ms`,
                }}
              >
                <span
                  className="grid place-items-center w-7 h-7 rounded-full flex-shrink-0"
                  style={{
                    background: "rgba(159,122,234,0.15)",
                    border: "1px solid rgba(159,122,234,0.25)",
                  }}
                >
                  <Check className="w-3.5 h-3.5" style={{ color: "#9F7AEA" }} />
                </span>
                <span
                  className="font-sans font-medium text-[14px]"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  {f.label}
                </span>
              </div>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="w-full">
            <div className="flex items-baseline justify-center gap-1.5 mb-5">
              <span
                className="font-sans font-bold text-[32px]"
                style={{ color: "#FFFFFF", letterSpacing: "-0.03em" }}
              >
                49K
              </span>
              <span
                className="font-sans font-medium text-[14px]"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                /tháng
              </span>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="w-full h-13 py-3.5 rounded-[14px] font-sans font-bold text-[15px] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #9F7AEA 0%, #7C6FDB 100%)",
                color: "#FFFFFF",
                boxShadow: "0 8px 24px rgba(159,122,234,0.30)",
              }}
            >
              {upgrading ? (
                <>
                  <Loader2 className="w-[18px] h-[18px] animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Sparkles className="w-[18px] h-[18px]" />
                  Nâng cấp Premium
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="mt-3 font-sans font-medium text-[13px] transition-colors hover:text-white/70"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Để sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
