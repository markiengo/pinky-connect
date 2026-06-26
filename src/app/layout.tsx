import type { Metadata } from "next";
import { CursorGlow } from "@/components/cursor-glow";
import { ClearStorage } from "@/components/clear-storage";
import { DevAutoLogout } from "@/components/dev-auto-logout";
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
        <ClearStorage />
        <DevAutoLogout />
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
