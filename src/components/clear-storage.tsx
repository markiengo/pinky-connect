"use client";

import { useEffect } from "react";

export function ClearStorage() {
  useEffect(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
  }, []);

  return null;
}
