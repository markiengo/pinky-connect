import type { Metadata } from "next";
import { CursorGlow } from "@/components/cursor-glow";
import { ClearStorage } from "@/components/clear-storage";
import { DevAutoLogout } from "@/components/dev-auto-logout";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggleRenderer } from "@/components/theme-toggle-renderer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crambox",
  description: "Kho đề thi đại học, AI tìm đề phù hợp, lời giải chi tiết",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className="h-full antialiased">
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <ThemeProvider>
          <ClearStorage />
          <DevAutoLogout />
          <CursorGlow />
          <ThemeToggleRenderer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
