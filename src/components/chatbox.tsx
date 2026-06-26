"use client";

import { useState, useRef, useCallback, type FormEvent } from "react";
import { Send, Paperclip, X, GraduationCap, AlertCircle, Loader2 } from "lucide-react";
import { DeThiCard, type DeThiCardData } from "./de-thi-card";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  cards?: DeThiCardData[];
  isError?: boolean;
}

const SUGGESTIONS = [
  "Cho mình đề Kế toán về nguyên tắc kế toán",
  "Tìm đề Tài chính về lãi suất",
  "Đề Quản trị marketing về phân khúc thị trường",
];

export function Chatbox() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Xin chào! Mình có thể giúp bạn tìm đề thi phù hợp. Hãy gõ yêu cầu hoặc tải lên file PDF nhé.",
    },
  ]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [promptsRemaining, setPromptsRemaining] = useState(3);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const valid = selected.filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"),
    );
    if (valid.length < selected.length) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          text: "Chỉ hỗ trợ file PDF. Vui lòng chọn file PDF.",
          isError: true,
        },
      ]);
    }
    setFiles((prev) => [...prev, ...valid].slice(0, 3));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt && files.length === 0) return;
    if (loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: prompt || "(Tải file PDF lên)",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    scrollToBottom();

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      for (const file of files) {
        formData.append("files", file);
      }
      setFiles([]);

      const res = await fetch("/api/search", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            text: data.error ?? "Đã có lỗi xảy ra.",
            isError: true,
          },
        ]);
      } else {
        setPromptsRemaining(data.promptsRemaining ?? 3);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: "assistant",
            text: data.message,
            cards: data.results,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          text: "Không thể kết nối đến server. Vui lòng thử lại.",
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const useSuggestion = (s: string) => {
    setInput(s);
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Chat header ── */}
      <div
        className="flex items-center gap-3 px-5 py-4 backdrop-blur-sm rounded-t-[16px]"
        style={{
          borderBottom: "1px solid rgba(244,137,154,0.15)",
          background: "rgba(255,255,255,0.5)",
        }}
      >
        <span
          className="grid place-items-center w-10 h-10 rounded-full"
          style={{ background: "linear-gradient(135deg, #5B8A7A 0%, #7C6FDB 100%)", color: "#FFFFFF", boxShadow: "0 4px 16px rgba(91,138,122,0.25)" }}
        >
          <GraduationCap className="w-[18px] h-[18px]" />
        </span>
        <div className="flex-1 min-w-0">
          <h2
            className="font-sans text-[15px] font-bold leading-tight"
            style={{ color: "#1E1B3A" }}
          >
            Tìm đề thi
          </h2>
          <p
            className="text-[11.5px] leading-tight"
            style={{ color: "#5C5875" }}
          >
            {promptsRemaining > 0
              ? `${promptsRemaining} lượt hỏi còn lại`
              : "Hết lượt hỏi — tải lại trang"}
          </p>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-6 space-y-5 [scrollbar-width:thin] aurora-bg"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2">
            {/* Message bubble */}
            <div
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-5 py-3 rounded-[18px] text-[14px] leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-[6px]"
                    : "rounded-bl-[6px]"
                }`}
                style={{
                  background:
                    msg.role === "user"
                      ? "#5B8A7A"
                      : msg.isError
                        ? "rgba(244,137,154,0.10)"
                        : "#FFFFFF",
                  color:
                    msg.role === "user"
                      ? "#FFFFFF"
                      : msg.isError
                        ? "#F4899A"
                        : "#1E1B3A",
                  boxShadow:
                    msg.role === "assistant" && !msg.isError
                      ? "0 1px 4px rgba(244,137,154,0.08)"
                      : "none",
                  border:
                    msg.role === "assistant" && !msg.isError
                      ? "1px solid rgba(244,137,154,0.10)"
                      : "none",
                }}
              >
                {msg.role === "assistant" && !msg.isError && (
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-bold mb-1"
                    style={{ color: "#5B8A7A" }}
                  >
                    <GraduationCap className="w-3 h-3" />
                    AI Exam Prep
                  </span>
                )}
                {msg.isError && (
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-bold mb-1"
                    style={{ color: "#F4899A" }}
                  >
                    <AlertCircle className="w-3 h-3" />
                    Lỗi
                  </span>
                )}
                <p
                  className={
                    msg.role === "assistant" && !msg.isError
                      ? "font-serif"
                      : ""
                  }
                  style={
                    msg.role === "assistant" && !msg.isError
                      ? { fontFamily: '"EB Garamond", Garamond, serif', fontSize: "15px" }
                      : {}
                  }
                >
                  {msg.text}
                </p>
              </div>
            </div>

            {/* Cards */}
            {msg.cards && msg.cards.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 pr-2">
                {msg.cards.map((card) => (
                  <DeThiCard key={card.id} card={card} />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start">
            <div
              className="px-5 py-3 rounded-[18px] rounded-bl-[6px]"
              style={{
                background: "#FFFFFF",
                color: "#1E1B3A",
                boxShadow: "0 1px 4px rgba(244,137,154,0.08)",
                border: "1px solid rgba(244,137,154,0.10)",
              }}
            >
              <span
                className="inline-flex items-center gap-2 text-[13px] font-medium"
                style={{ color: "#5C5875" }}
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tìm đề phù hợp...
              </span>
            </div>
          </div>
        )}

        {/* Suggestions (only on first message) */}
        {messages.length === 1 && !loading && (
          <div className="space-y-2 pt-2">
            <p
              className="text-[12px] font-bold px-1"
              style={{ color: "#5C5875" }}
            >
              Gợi ý:
            </p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => useSuggestion(s)}
                className="block w-full text-left px-4 py-2.5 rounded-[14px] text-[13px] font-medium transition-all hover:bg-white/80"
                style={{
                  background: "rgba(255,255,255,0.65)",
                  border: "1px solid rgba(244,137,154,0.20)",
                  color: "rgba(30,27,58,0.8)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── File previews ── */}
      {files.length > 0 && (
        <div className="px-4 pt-2 flex flex-wrap gap-2">
          {files.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[999px] text-[12px] font-semibold"
              style={{
                background: "#E8E4F2",
                border: "1px solid rgba(30,27,58,0.08)",
              }}
            >
              <Paperclip className="w-3 h-3" />
              {f.name}
              <button
                onClick={() => removeFile(i)}
                className="ml-1"
                style={{ color: "rgba(30,27,58,0.4)" }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* ── Composer ── */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-5 py-4 backdrop-blur-sm rounded-b-[16px]"
        style={{
          borderTop: "1px solid rgba(244,137,154,0.15)",
          background: "rgba(255,255,255,0.5)",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={files.length >= 3 || loading}
          title="Tải lên PDF (tối đa 3 file)"
          className="grid place-items-center w-10 h-10 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          style={{ background: "rgba(244,137,154,0.10)", color: "#F4899A" }}
        >
          <Paperclip className="w-[18px] h-[18px]" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập yêu cầu hoặc tải PDF lên..."
          disabled={loading || promptsRemaining <= 0}
          autoComplete="off"
          className="flex-1 min-w-0 h-11 px-4 rounded-[999px] text-[14px] font-medium focus:outline-none transition-colors disabled:opacity-50"
          style={{
            background: "rgba(244,137,154,0.06)",
            border: "1px solid rgba(244,137,154,0.18)",
            color: "#1E1B3A",
          }}
        />
        <button
          type="submit"
          disabled={loading || (!input.trim() && files.length === 0) || promptsRemaining <= 0}
          title="Gửi"
          className="grid place-items-center w-11 h-11 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #5B8A7A 0%, #7C6FDB 100%)", color: "#FFFFFF", boxShadow: "0 4px 16px rgba(91,138,122,0.25)" }}
        >
          {loading ? (
            <Loader2 className="w-[18px] h-[18px] animate-spin" />
          ) : (
            <Send className="w-[18px] h-[18px]" />
          )}
        </button>
      </form>
    </div>
  );
}
