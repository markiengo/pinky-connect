"use client";

import { useState, useRef, useCallback, type FormEvent } from "react";
import { Send, Paperclip, X, GraduationCap, AlertCircle, Plus, MessageSquare, Trash2 } from "lucide-react";
import { DeThiCard, type DeThiCardData } from "./de-thi-card";
import { PremiumOverlay } from "./premium-overlay";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  cards?: DeThiCardData[];
  isError?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  promptsRemaining: number;
  createdAt: number;
}

const WELCOME_MSG: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Xin chào! Mình có thể giúp bạn tìm đề thi phù hợp. Hãy gõ yêu cầu hoặc tải lên file PDF nhé.",
};

const SUGGESTIONS = [
  "Cho mình đề Kế toán về nguyên tắc kế toán",
  "Tìm đề Tài chính về lãi suất",
  "Đề Quản trị marketing về phân khúc thị trường",
];

function createSession(): ChatSession {
  return {
    id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: "Cuộc trò chuyện mới",
    messages: [WELCOME_MSG],
    promptsRemaining: 3,
    createdAt: Date.now(),
  };
}

export function Chatbox() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => [createSession()]);
  const [activeSessionId, setActiveSessionId] = useState(() => sessions[0].id);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? sessions[0];
  const messages = activeSession.messages;
  const promptsRemaining = activeSession.promptsRemaining;

  const updateActiveSession = useCallback(
    (updater: (s: ChatSession) => ChatSession) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? updater(s) : s)),
      );
    },
    [activeSessionId],
  );

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
      updateActiveSession((s) => ({
        ...s,
        messages: [
          ...s.messages,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            text: "Chỉ hỗ trợ file PDF. Vui lòng chọn file PDF.",
            isError: true,
          },
        ],
      }));
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

    const newTitle =
      activeSession.messages.length === 1 && activeSession.title === "Cuộc trò chuyện mới"
        ? prompt.slice(0, 30) || "PDF upload"
        : activeSession.title;

    updateActiveSession((s) => ({
      ...s,
      title: newTitle,
      messages: [...s.messages, userMsg],
    }));
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
        const isLimitReached = data.code === "PROMPT_LIMIT_REACHED";
        if (isLimitReached) {
          updateActiveSession((s) => ({ ...s, promptsRemaining: 0 }));
          setShowPremium(true);
        }
        updateActiveSession((s) => ({
          ...s,
          messages: [
            ...s.messages,
            {
              id: `err-${Date.now()}`,
              role: "assistant",
              text: data.error ?? "Đã có lỗi xảy ra.",
              isError: true,
            },
          ],
        }));
      } else {
        const remaining = data.promptsRemaining ?? 3;
        updateActiveSession((s) => ({
          ...s,
          promptsRemaining: remaining,
          messages: [
            ...s.messages,
            {
              id: `ai-${Date.now()}`,
              role: "assistant",
              text: data.message,
              cards: data.results,
            },
          ],
        }));
        if (remaining <= 0) {
          setShowPremium(true);
        }
      }
    } catch {
      updateActiveSession((s) => ({
        ...s,
        messages: [
          ...s.messages,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            text: "Không thể kết nối đến server. Vui lòng thử lại.",
            isError: true,
          },
        ],
      }));
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const closePremium = () => setShowPremium(false);

  const handleSuggestionClick = (s: string) => {
    setInput(s);
  };

  const handleNewChat = () => {
    const newSession = createSession();
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setShowSidebarMobile(false);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const fresh = createSession();
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (id === activeSessionId) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  return (
    <div className="flex h-full">
      {/* ── Chat sidebar (desktop) ── */}
      <aside
        className="hidden md:flex flex-col w-52 flex-shrink-0 border-r"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 mx-3 mt-3 px-3 py-2.5 rounded-[12px] font-sans font-semibold text-[13px] transition-all btn-press hover:translate-y-[-1px]"
          style={{
            background: "linear-gradient(135deg, #F4899A 0%, #7C6FDB 100%)",
            color: "var(--primary-foreground)",
            boxShadow: "0 4px 16px rgba(244,137,154,0.20)",
          }}
        >
          <Plus className="w-4 h-4" />
          Cuộc trò chuyện mới
        </button>

        <div className="flex-1 overflow-y-auto px-2 mt-2 space-y-1 [scrollbar-width:thin]">
          {sessions.map((s) => {
            const isActive = s.id === activeSessionId;
            return (
              <div
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className="group flex items-center gap-2 px-3 py-2.5 rounded-[10px] cursor-pointer transition-all"
                style={{
                  background: isActive ? "var(--secondary)" : "transparent",
                }}
              >
                <MessageSquare
                  className="w-3.5 h-3.5 flex-shrink-0"
                  style={{ color: isActive ? "var(--accent)" : "var(--muted-foreground)" }}
                />
                <span
                  className="flex-1 min-w-0 truncate font-sans font-medium text-[12px]"
                  style={{ color: isActive ? "var(--foreground)" : "var(--muted-foreground)" }}
                >
                  {s.title}
                </span>
                {sessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSession(s.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── Main chat area ── */}
      <div className="flex flex-col h-full flex-1 min-w-0 relative">
        {/* ── Chat header ── */}
        <div
          className="flex items-center gap-3 px-5 py-4 backdrop-blur-sm rounded-t-[16px]"
          style={{
            borderBottom: "1px solid var(--border)",
            background: "var(--card)",
          }}
        >
          {/* Mobile: chat list toggle */}
          <button
            onClick={() => setShowSidebarMobile((v) => !v)}
            className="md:hidden grid place-items-center w-9 h-9 rounded-full transition-all btn-press"
            style={{ background: "rgba(244,137,154,0.10)", color: "#F4899A" }}
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <span
            className="grid place-items-center w-10 h-10 rounded-full"
            style={{ background: "linear-gradient(135deg, #F4899A 0%, #7C6FDB 100%)", color: "#FFFFFF", boxShadow: "0 4px 16px rgba(244,137,154,0.25)" }}
          >
            <GraduationCap className="w-[18px] h-[18px]" />
          </span>
          <div className="flex-1 min-w-0">
            <h2
              className="font-sans text-[15px] font-bold leading-tight"
              style={{ color: "var(--foreground)" }}
            >
              Tìm đề thi
            </h2>
            <p
              className="text-[11.5px] leading-tight"
              style={{ color: "var(--muted-foreground)" }}
            >
              {promptsRemaining > 0
                ? `${promptsRemaining} lượt hỏi còn lại`
                : "Hết lượt hỏi — tải lại trang"}
            </p>
          </div>
          {/* Mobile: new chat button */}
          <button
            onClick={handleNewChat}
            className="md:hidden grid place-items-center w-9 h-9 rounded-full transition-all btn-press"
            style={{ background: "rgba(244,137,154,0.10)", color: "#F4899A" }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* ── Mobile sidebar overlay ── */}
        {showSidebarMobile && (
          <div className="md:hidden absolute inset-0 z-40 flex">
            <div
              className="w-64 flex flex-col border-r"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <span className="font-sans font-bold text-[14px]" style={{ color: "var(--foreground)" }}>Cuộc trò chuyện</span>
                <button onClick={() => setShowSidebarMobile(false)}>
                  <X className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
                </button>
              </div>
              <button
                onClick={handleNewChat}
                className="flex items-center gap-2 mx-3 mt-3 px-3 py-2.5 rounded-[12px] font-sans font-semibold text-[13px] transition-all btn-press"
                style={{
                  background: "linear-gradient(135deg, #F4899A 0%, #7C6FDB 100%)",
                  color: "var(--primary-foreground)",
                }}
              >
                <Plus className="w-4 h-4" />
                Cuộc trò chuyện mới
              </button>
              <div className="flex-1 overflow-y-auto px-2 mt-2 space-y-1">
                {sessions.map((s) => {
                  const isActive = s.id === activeSessionId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        setActiveSessionId(s.id);
                        setShowSidebarMobile(false);
                      }}
                      className="group flex items-center gap-2 px-3 py-2.5 rounded-[10px] cursor-pointer transition-all"
                      style={{ background: isActive ? "var(--secondary)" : "transparent" }}
                    >
                      <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isActive ? "var(--accent)" : "var(--muted-foreground)" }} />
                      <span className="flex-1 min-w-0 truncate font-sans font-medium text-[12px]" style={{ color: isActive ? "var(--foreground)" : "var(--muted-foreground)" }}>
                        {s.title}
                      </span>
                      {sessions.length > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteSession(s.id); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex-1" style={{ background: "rgba(30,27,58,0.3)" }} onClick={() => setShowSidebarMobile(false)} />
          </div>
        )}

        {/* ── Messages ── */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-5 py-6 space-y-5 [scrollbar-width:thin] aurora-bg"
        >
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-2 chat-msg-in">
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
                        ? "var(--accent)"
                        : msg.isError
                          ? "var(--secondary)"
                          : "var(--card)",
                    color:
                      msg.role === "user"
                        ? "var(--accent-foreground)"
                        : msg.isError
                          ? "var(--accent)"
                          : "var(--foreground)",
                    boxShadow:
                      msg.role === "assistant" && !msg.isError
                        ? "var(--shadow-soft)"
                        : "none",
                    border:
                      msg.role === "assistant" && !msg.isError
                        ? "1px solid var(--border)"
                        : "none",
                  }}
                >
                  {msg.role === "assistant" && !msg.isError && (
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-bold mb-1"
                      style={{ color: "var(--accent)" }}
                    >
                      <GraduationCap className="w-3 h-3" />
                      Crambox
                    </span>
                  )}
                  {msg.isError && (
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-bold mb-1"
                      style={{ color: "var(--accent)" }}
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
                  {msg.cards.map((card, i) => (
                    <div
                      key={card.id}
                      className="card-in"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <DeThiCard card={card} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator — typing dots */}
          {loading && (
            <div className="flex justify-start chat-msg-in">
              <div
                className="px-5 py-3.5 rounded-[18px] rounded-bl-[6px]"
                style={{
                  background: "var(--card)",
                  boxShadow: "var(--shadow-soft)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="typing-dot w-2 h-2 rounded-full"
                    style={{ background: "var(--accent)", animationDelay: "0ms" }}
                  />
                  <span
                    className="typing-dot w-2 h-2 rounded-full"
                    style={{ background: "var(--accent)", animationDelay: "150ms" }}
                  />
                  <span
                    className="typing-dot w-2 h-2 rounded-full"
                    style={{ background: "var(--accent)", animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Suggestions (only on first message) */}
          {messages.length === 1 && !loading && (
            <div className="space-y-2 pt-2">
              <p
                className="text-[12px] font-bold px-1"
                style={{ color: "var(--muted-foreground)" }}
              >
                Gợi ý:
              </p>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  className="block w-full text-left px-4 py-2.5 rounded-[14px] text-[13px] font-medium transition-all btn-press"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--secondary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--card)";
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
                  background: "var(--secondary)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <Paperclip className="w-3 h-3" />
                {f.name}
                <button
                  onClick={() => removeFile(i)}
                  className="ml-1"
                  style={{ color: "var(--muted-foreground)" }}
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
            borderTop: "1px solid var(--border)",
            background: "var(--card)",
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
            className="grid place-items-center w-10 h-10 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 btn-press"
            style={{ background: "var(--secondary)", color: "var(--accent)" }}
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
              background: "var(--secondary)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          />
          <button
            type="submit"
            disabled={loading || (!input.trim() && files.length === 0) || promptsRemaining <= 0}
            title="Gửi"
            className="grid place-items-center w-11 h-11 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 btn-press"
            style={{ background: "linear-gradient(135deg, #F4899A 0%, #7C6FDB 100%)", color: "var(--primary-foreground)", boxShadow: "0 4px 16px rgba(244,137,154,0.25)" }}
          >
            {loading ? (
              <span
                className="typing-dot w-2 h-2 rounded-full"
                style={{ background: "var(--primary-foreground)", animationDelay: "0ms" }}
              />
            ) : (
              <Send className="w-[18px] h-[18px]" />
            )}
          </button>
        </form>

        <PremiumOverlay open={showPremium} onClose={closePremium} />
      </div>
    </div>
  );
}
