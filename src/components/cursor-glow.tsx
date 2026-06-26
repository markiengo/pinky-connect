"use client";

import { useEffect, useRef, useState } from "react";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentSection = useRef<"dark" | "light">("light");

  useEffect(() => {
    // Disable on touch devices and reduced motion
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return;

      // Detect section by checking background luminance at cursor position
      const el = document.elementFromPoint(e.clientX, e.clientY);
      let isDark = false;
      if (el) {
        const computed = window.getComputedStyle(el.closest("section, div, nav, main, aside, footer") || el);
        const bg = computed.backgroundColor;
        // Parse rgb values
        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          const [, r, g, b] = match;
          const luminance = (parseInt(r) * 0.299 + parseInt(g) * 0.587 + parseInt(b) * 0.114) / 255;
          isDark = luminance < 0.3;
        }
      }

      const section = isDark ? "dark" : "light";
      if (section !== currentSection.current) {
        currentSection.current = section;
        if (glowRef.current) {
          glowRef.current.style.background = isDark
            ? "radial-gradient(250px circle at center, rgba(91,138,122,0.15), transparent 70%)"
            : "radial-gradient(250px circle at center, rgba(244,137,154,0.10), transparent 70%)";
        }
      }

      glowRef.current.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
      setVisible(true);

      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setVisible(false), 2000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      suppressHydrationWarning
      className="pointer-events-none fixed z-50"
      style={{
        width: "500px",
        height: "500px",
        top: 0,
        left: 0,
        background:
          "radial-gradient(250px circle at center, rgba(244,137,154,0.10), transparent 70%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 400ms ease",
        willChange: "transform, opacity",
      }}
    />
  );
}
