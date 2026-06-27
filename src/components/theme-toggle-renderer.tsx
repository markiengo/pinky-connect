"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const HIDDEN_PATHS = ["/", "/pricing"];

export function ThemeToggleRenderer() {
  const pathname = usePathname();

  // pathname is null during first SSR pass
  if (!pathname) return null;

  if (HIDDEN_PATHS.includes(pathname)) return null;

  return <ThemeToggle />;
}
