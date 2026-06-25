import { AppShell } from "@/components/app-shell";
import { Chatbox } from "@/components/chatbox";

export default function PracticePage() {
  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100dvh-2.5rem)] md:h-[calc(100dvh-1.75rem)] -mt-1">
        {/* ── Page heading ── */}
        <div className="px-1 mb-3">
          <h1 className="font-serif font-medium text-[clamp(32px,3.5vw,46px)] leading-[1.02] tracking-[-0.015em]">
            Luyện đề
          </h1>
          <p className="mt-1 text-[14px] font-medium text-text-muted">
            Hỏi AI tìm đề phù hợp hoặc tải lên tài liệu để nhận đề gợi ý
          </p>
        </div>

        {/* ── Chatbox card ── */}
        <div className="flex-1 min-h-0 rounded-card bg-white/60 backdrop-blur-sm border border-white/50 overflow-hidden flex flex-col">
          <Chatbox />
        </div>
      </div>
    </AppShell>
  );
}
