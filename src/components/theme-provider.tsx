"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme, origin?: { x: number; y: number }) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "crambox-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());
  const [mounted, setMounted] = useState(false);

  const applyTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(next);
    root.style.colorScheme = next;
  }, []);

  useEffect(() => {
    setMounted(true);
    applyTheme(theme);
  }, [applyTheme, theme]);

  const setTheme = useCallback(
    (next: Theme, origin?: { x: number; y: number }) => {
      const supportsViewTransition =
        typeof document !== "undefined" &&
        "startViewTransition" in document &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const doTransition = () => {
        setThemeState(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          // ignore storage errors
        }
        applyTheme(next);
      };

      if (supportsViewTransition && origin) {
        const x = origin.x;
        const y = origin.y;
        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        const transition = (document as Document & {
          startViewTransition: (cb: () => void) => {
            finished: Promise<void>;
            ready: Promise<void>;
            updateCallbackDone: Promise<void>;
          };
        }).startViewTransition(doTransition);

        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 500,
              easing: "cubic-bezier(0.32, 0.72, 0, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        });
      } else {
        doTransition();
      }
    },
    [applyTheme]
  );

  // Sync theme changes across tabs (optional)
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      const next = e.newValue as Theme | null;
      if (next === "light" || next === "dark") {
        setThemeState(next);
        applyTheme(next);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [applyTheme]);

  // Avoid flash of unstyled content before mount by rendering initial theme class immediately
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <span suppressHydrationWarning className="hidden">
        {mounted ? theme : ""}
      </span>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
