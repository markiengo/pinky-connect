"use client";

import { useEffect } from "react";

export function DevAutoLogout() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const handler = () => {
      try {
        navigator.sendBeacon("/api/dev-clear-session");
      } catch {}
    };

    window.addEventListener("pagehide", handler);
    return () => window.removeEventListener("pagehide", handler);
  }, []);

  return null;
}
