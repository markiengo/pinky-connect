import { AppShell } from "@/components/app-shell";
import { Chatbox } from "@/components/chatbox";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function PracticePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <AppShell username={session?.username}>
      <div className="flex flex-col h-[calc(100dvh-2.5rem)] md:h-[calc(100dvh-1.75rem)] -mt-1">
        {/* ── Page heading ── */}
        <div className="px-1 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#F4899A" }}
            />
            <span
              className="font-sans font-semibold text-[11px] uppercase tracking-[0.08em]"
              style={{ color: "#F4899A" }}
            >
              AI Assistant
            </span>
          </div>
          <h1
            className="font-serif font-normal leading-[1.1] tracking-[-0.02em]"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "var(--foreground)" }}
          >
            Luyện đề
          </h1>
          <p
            className="mt-1 font-sans"
            style={{ fontSize: "14px", color: "var(--muted-foreground)" }}
          >
            Hỏi AI tìm đề phù hợp hoặc tải lên tài liệu để nhận đề gợi ý
          </p>
        </div>

        {/* ── Chatbox card ── */}
        <div
          className="flex-1 min-h-0 rounded-[16px] overflow-hidden flex flex-col glass-card-pink"
          style={{ boxShadow: "0 8px 32px rgba(244,137,154,0.12), 0 2px 8px rgba(30,27,58,0.06)" }}
        >
          <Chatbox />
        </div>
      </div>
    </AppShell>
  );
}
