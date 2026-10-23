"use client";

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Send,
  Paperclip,
  Mic,
  Settings2,
  Sparkles,
  ChevronDown,
  Plus,
  ImageIcon,
  Copy,
  Check,
  Edit2,
  Edit3,
  X,
  FileText,
  Trash2,
  Square,
  LogOut,
  Menu,
  Bot,
  User as UserIcon,
  Clock,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { chatService, Message, ChatSession } from "@/lib/supabase/chat-service";
import { historyManager } from "@/lib/chat/history";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ModelLibraryMenu, AUTO_MODEL, SelectedModel } from "@/components/chat/model-library-menu";

const MODEL_STORAGE_KEY = "xylos.chat.model";

function readStoredModel(): SelectedModel {
  if (typeof window === "undefined") return AUTO_MODEL;
  try {
    const raw = window.localStorage.getItem(MODEL_STORAGE_KEY);
    if (!raw) return AUTO_MODEL;
    const parsed = JSON.parse(raw) as Partial<SelectedModel>;
    if (!parsed?.provider || typeof parsed.provider !== "string") return AUTO_MODEL;
    const model = typeof parsed.model === "string" && parsed.model ? parsed.model : null;
    if (parsed.provider === "best") return AUTO_MODEL;
    const label = typeof parsed.label === "string" && parsed.label ? parsed.label : (model ?? parsed.provider);
    return { provider: parsed.provider, model, label };
  } catch {
    return AUTO_MODEL;
  }
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, className, ...props }: any) {
          return (
            <div className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-[#0d0e10]">
              <pre className="p-4 overflow-x-auto font-mono text-xs text-[#c4c0b8]" {...props}>
                <code>{escapeHtml(String(node.children?.text ?? ""))}</code>
              </pre>
            </div>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function MessageBubble({
  message,
  isUser,
  isStreaming,
  onCopy,
  onThumbsUp,
  onThumbsDown,
}: {
  message: Message;
  isUser: boolean;
  isStreaming?: boolean;
  onCopy?: () => void;
  onThumbsUp?: () => void;
  onThumbsDown?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex shrink-0 items-start gap-2 ml-1">
          <div className="h-8 w-8 rounded-full bg-[#0d0e10] border border-white/10 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-[#36b7b0]" />
          </div>
        </div>
      )}
      <div className={`relative rounded-2xl px-4 py-3 max-w-[85%] text-white break-words ${
        isUser
          ? "bg-[#0d0e10] border border-white/10 ml-auto"
          : "bg-white/[0.03] border border-white/5"
      }`}>
        {isUser ? (
          <div className="prose prose-sm text-white max-w-none">
            {message.content}
          </div>
        ) : (
          <div className="relative">
            <MarkdownContent content={message.content} />
            {isStreaming && (
              <span className="inline-block animate-pulse text-[#36b7b0]">▋</span>
            )}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onCopy}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={onThumbsUp}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/50 hover:text-[#36b7b0] transition-colors"
                title="Good response"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={onThumbsDown}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/50 hover:text-red-400 transition-colors"
                title="Bad response"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        {isUser && (
          <div className="absolute -top-8 right-2 flex items-center gap-1 text-[10px] font-mono text-white/30">
            <Clock className="w-3 h-3" />
            <span>{new Date(message.created_at || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex shrink-0 items-start gap-2 mr-1">
          <div className="h-8 w-8 rounded-full bg-[#36b7b0] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(54,183,176,0.3)]">
            <UserIcon className="w-4 h-4 text-[#17181b]" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
function Sidebar({
  sessions,
  activeId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
  onLogout,
  isOpen,
}: {
  sessions: ChatSession[];
  activeId: string | null;
  onSessionSelect: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onLogout: () => void;
  isOpen: boolean;
}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-80 bg-[#0d0e10] border-r border-white/5 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
            <Bot className="w-3 h-3 text-[#17181b]" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white" style={{ fontFamily: "Sora, sans-serif" }}>
            Xylos AI
          </span>
        </div>
        <button
          className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
          title="Settings"
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="px-2">
          <button
            onClick={onNewSession}
            className="w-full flex items-center justify-between px-4 py-3 text-left rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Plus className="w-4 h-4 text-[#36b7b0] group-hover:text-[#4accc4] transition-colors" />
              <span className="font-medium text-white group-hover:text-[#eeeae2] transition-colors">New chat</span>
            </div>
            <span className="text-xs text-white/30">&#x2318;N</span>
          </button>
        </div>

        <div className="px-2">
          <span className="block px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">
            Recent conversations
          </span>
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 mx-auto mb-3 text-white/10" />
              <p className="text-xs text-white/40">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSessionSelect(session.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl border transition-all ${
                    activeId === session.id
                      ? "bg-[#36b7b0]/10 border-[#36b7b0]/30"
                      : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-white">{session.title}</p>
                    <p className="truncate text-[10px] text-white/40 mt-0.5">
                      {new Date(session.updated_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="p-1.5 hover:bg-white/5 rounded-lg text-white/30 hover:text-white transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between px-4 py-3 text-left rounded-xl border border-white/5 hover:bg-white/[0.03] transition-all group"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
            <span className="font-medium text-white">Sign out</span>
          </div>
          <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
        </button>
      </div>
    </aside>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="h-20 w-20 rounded-full bg-[#36b7b0]/10 flex items-center justify-center mb-6">
        <Sparkles className="w-10 h-10 text-[#36b7b0]" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "Sora, sans-serif" }}>
        Start a new conversation
      </h1>
      <p className="text-xl text-white/50 mb-8 max-w-md">
        Ask anything — from coding help to creative writing. Xylos AI routes your queries across 7+ frontier models.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md">
        {[
          "Write a Python script to scrape a website",
          "Explain quantum computing simply",
          "Help me draft a professional email",
        ].map((prompt, i) => (
          <button
            key={i}
            className="w-full p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all text-left group"
          >
            <p className="text-sm text-white mb-1">{prompt}</p>
            <span className="text-xs text-[#36b7b0] group-hover:text-[#4accc4]">Try it &#8594;</span>
          </button>
        ))}
      </div>
    </div>
  );
}
function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeId = searchParams.get("id");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProviderMenuOpen, setIsProviderMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<SelectedModel>(AUTO_MODEL);
  useEffect(() => { setSelectedModel(readStoredModel()); }, []);
  const handleSelectModel = (model: SelectedModel) => {
    setSelectedModel(model);
    try {
      window.localStorage.setItem(MODEL_STORAGE_KEY, JSON.stringify(model));
    } catch {}
  };
  const [isMicActive, setIsMicActive] = useState(false);
  const [stagedFile, setStagedFile] = useState<{name: string, content: string, type: string} | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(typeof window === "undefined" ? true : window.innerWidth > 768);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesContainerRef.current?.scrollTo({ top: messagesContainerRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await chatService.getSessions();
        setSessions(data);
        if (activeId && data.some((s) => s.id === activeId)) {
          const session = data.find((s) => s.id === activeId)!;
          setMessages((session.messages || []) as Message[]);
        }
      } catch {
        const local = historyManager.getSessions();
        if (activeId && local.some((s) => s.id === activeId)) {
          const session = local.find((s) => s.id === activeId)!;
          setMessages((session.messages || []) as Message[]);
        }
      }
    };
    loadSessions();
  }, [activeId]);

  const handleNewSession = async () => {
    setMessages([]);
    setInput("");
    setStagedFile(null);
    router.push("/dashboard/chat");
  };

  const handleSessionSelect = async (id: string) => {
    try {
      const session = sessions.find((s) => s.id === id);
      if (session) {
        setMessages((session.messages || []) as Message[]);
        router.push(`/dashboard/chat?id=${id}`);
      }
    } catch {}
    setIsSidebarOpen(false);
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await chatService.deleteSession(id);
    } catch {}
    historyManager.deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeId === id) {
      setMessages([]);
      router.push("/dashboard/chat");
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !stagedFile) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      attachment: stagedFile ? { name: stagedFile.name, url: stagedFile.content, type: stagedFile.type } : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setStagedFile(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel.provider === "best" ? null : selectedModel.model,
          provider: selectedModel.provider,
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";

      if (reader) {
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          aiContent += decoder.decode(value);
          setMessages((prev) =>
            prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: aiContent } : m
            )
          );
        }
      }

      setIsLoading(false);
    } catch (err) {
      console.error("[Chat] Error:", err);
      setIsLoading(false);
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setStagedFile({
        name: file.name,
        content: event.target?.result as string,
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveStagedFile = () => setStagedFile(null);
  return (
    <div className="flex h-screen flex-col bg-[#0d0e10] text-white">
      <button
        onClick={() => setIsSidebarOpen((v) => !v)}
        className="md:hidden absolute left-4 top-4 z-50 p-2 rounded-lg bg-white/[0.05] border border-white/10 text-white hover:bg-white/[0.1] transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      <Sidebar
        sessions={sessions}
        activeId={activeId || ""}
        onSessionSelect={handleSessionSelect}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        {isSidebarOpen && typeof window !== "undefined" && window.innerWidth <= 768 && (
          <div
            className="fixed inset-0 bg-black/40 z-39 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 flex flex-col overflow-hidden">
          {!activeId ? (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto px-6 py-12">
                <EmptyState />
              </div>
              <div className="border-t border-white/5 flex-shrink-0">
                <ChatInput
                  input={input}
                  setInput={setInput}
                  isLoading={isLoading}
                  isMicActive={isMicActive}
                  setIsMicActive={setIsMicActive}
                  stagedFile={stagedFile}
                  setStagedFile={setStagedFile}
                  handleSend={handleSend}
                  handleFileUpload={handleFileUpload}
                  handleRemoveStagedFile={handleRemoveStagedFile}
                  stopGeneration={stopGeneration}
                  isProviderMenuOpen={isProviderMenuOpen}
                  setIsProviderMenuOpen={setIsProviderMenuOpen}
                  selectedModel={selectedModel}
                  handleSelectModel={handleSelectModel}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-6 py-8 scroll-smooth" ref={messagesContainerRef}>
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <MessageBubble
                    key={idx}
                    message={msg}
                    isUser={msg.role === "user"}
                    isStreaming={isLoading && idx === messages.length - 1 && msg.role === "assistant"}
                    onCopy={() => {
                      navigator.clipboard.writeText(msg.content);
                    }}
                    onThumbsUp={() => {}}
                    onThumbsDown={() => {}}
                  />
                ))}
                
              </AnimatePresence>
              {isLoading && messages.length > 0 && (
                <div className="flex justify-start mb-6 animate-pulse">
                  <div className="h-8 w-8 rounded-full bg-[#0d0e10] border border-white/10 flex items-center justify-center ml-1">
                    <Bot className="w-4 h-4 text-[#36b7b0] animate-spin" />
                  </div>
                  <div className="rounded-2xl bg-white/[0.03] border border-white/5 px-4 py-3 max-w-[85%] animate-pulse">
                    <div className="h-4 w-48 bg-white/[0.1] rounded mb-2" />
                    <div className="h-4 w-32 bg-white/[0.1] rounded" />
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        <ChatInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          isMicActive={isMicActive}
          setIsMicActive={setIsMicActive}
          stagedFile={stagedFile}
          setStagedFile={setStagedFile}
          handleSend={handleSend}
          handleFileUpload={handleFileUpload}
          handleRemoveStagedFile={handleRemoveStagedFile}
          stopGeneration={stopGeneration}
          isProviderMenuOpen={isProviderMenuOpen}
          setIsProviderMenuOpen={setIsProviderMenuOpen}
          selectedModel={selectedModel}
          handleSelectModel={handleSelectModel}
        />
      </div>
    </div>
  );
}

function ChatInput({
  input,
  setInput,
  isLoading,
  isMicActive,
  setIsMicActive,
  stagedFile,
  setStagedFile,
  handleSend,
  handleFileUpload,
  handleRemoveStagedFile,
  stopGeneration,
  isProviderMenuOpen,
  setIsProviderMenuOpen,
  selectedModel,
  handleSelectModel,
}: {
  input: string;
  setInput: (v: string) => void;
  isLoading: boolean;
  isMicActive: boolean;
  setIsMicActive: (v: boolean) => void;
  stagedFile: {name: string, content: string, type: string} | null;
  setStagedFile: (v: {name: string, content: string, type: string} | null) => void;
  handleSend: (e: React.FormEvent) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveStagedFile: () => void;
  stopGeneration: () => void;
  isProviderMenuOpen: boolean;
  setIsProviderMenuOpen: (v: boolean) => void;
  selectedModel: SelectedModel;
  handleSelectModel: (model: SelectedModel) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={handleSend} className="border-t border-white/5 bg-[#0d0e10]/80 backdrop-blur-md px-6 pb-4 pt-3 flex flex-col gap-3">
      {stagedFile && (
        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03]">
            <FileText className="w-3 h-3 text-[#36b7b0]" />
            <span className="text-xs text-[#c4c0b8] truncate">{stagedFile.name}</span>
            <button
              onClick={handleRemoveStagedFile}
              className="p-1 hover:bg-white/10 rounded text-white/40 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
      <div className="flex items-end gap-3 px-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-white/5 rounded-xl transition-all text-white/30 hover:text-primary"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsMicActive(!isMicActive)}
          className={`p-2 rounded-xl transition-all ${isMicActive ? "bg-primary/20 text-primary animate-pulse" : "hover:bg-white/5 text-white/30 hover:text-primary"}`}
        >
          <Mic className="w-5 h-5" />
        </button>
        <div className="w-[1px] h-6 bg-white/10 mx-1" />
        <ModelLibraryMenu
          isOpen={isProviderMenuOpen}
          onToggle={() => setIsProviderMenuOpen(!isProviderMenuOpen)}
          selected={selectedModel}
          onSelect={handleSelectModel}
        />
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          onChange={handleFileUpload}
          accept="image/*,.pdf,.txt,.doc,.docx"
        />
      </div>
      <div className="relative px-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e as React.FormEvent);
            }
          }}
          rows={1}
          
          className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/[0.03] text-white placeholder:text-white/20 resize-none focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-all"
          placeholder="Message Xylos AI..."
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading ? (
            <button
              onClick={stopGeneration}
              className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 group/stop"
            >
              <Square className="w-4 h-4 fill-current group-hover:scale-90 transition-transform" />
              <span className="text-[10px] font-semibold uppercase tracking-wide hidden sm:inline">Terminate</span>
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={(!input.trim() && !stagedFile) || isLoading}
              className="p-2.5 rounded-xl bg-primary text-[#17181b] hover:bg-[#4accc4] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="text-[10px] font-semibold uppercase tracking-wide hidden sm:inline">Send</span>
            </button>
          )}
        </div>
      </div>
      <div className="px-2 mt-2 flex items-center justify-center gap-4 text-[8px] font-semibold uppercase tracking-wide text-white/20 italic select-none">
        <span>AES-256 SECURED</span>
        <div className="w-1 h-1 bg-primary/30 rounded-full" />
        <span>NEURAL MATRIX V3.5</span>
        <div className="w-1 h-1 bg-primary/30 rounded-full" />
        <span>PERSISTENCE ACTIVE</span>
      </div>
    </form>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#0d0e10]">
        <div className="w-12 h-12 rounded-[1.5rem] bg-primary/5 flex items-center justify-center border border-primary/10 animate-pulse">
          <Sparkles className="w-6 h-6 text-primary animate-spin" />
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}

