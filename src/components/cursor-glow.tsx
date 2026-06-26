"use client";

import { useEffect, useRef } from "react";

const IDLE_TIMEOUT = 2000;

export function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let mouseX = -100;
    let mouseY = -100;
    let opacity = 0;
    let targetOpacity = 0;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let rafId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      targetOpacity = 1;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        targetOpacity = 0;
      }, IDLE_TIMEOUT);
    };

    window.addEventListener("mousemove", handleMouseMove);

    let scrolling = false;
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      scrolling = true;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        scrolling = false;
      }, 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      opacity += (targetOpacity - opacity) * 0.08;

      if (opacity < 0.01 || scrolling) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const radius = 40;
      const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, radius);
      grad.addColorStop(0, `rgba(244,137,154,${opacity * 0.5})`);
      grad.addColorStop(0.4, `rgba(159,122,234,${opacity * 0.2})`);
      grad.addColorStop(1, `rgba(124,111,219,0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
      ctx.fill();

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      if (idleTimer) clearTimeout(idleTimer);
      if (scrollTimer) clearTimeout(scrollTimer);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      suppressHydrationWarning
      className="pointer-events-none fixed inset-0 z-50"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
