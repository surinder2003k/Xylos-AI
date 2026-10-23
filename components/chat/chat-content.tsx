"use client";

import { useState } from "react";
import { Message, ChatSession } from "@/lib/supabase/chat-service";
import { ModelLibraryMenu, AUTO_MODEL, SelectedModel } from "@/components/chat/model-library-menu";

function readStoredModel(): SelectedModel {
  if (typeof window === "undefined") return AUTO_MODEL;
  try {
    const raw = window.localStorage.getItem("xylos.chat.model");
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

export const ChatContent = function ChatContent() {
  const [isProviderMenuOpen, setIsProviderMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<SelectedModel>(readStoredModel());
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);

  const handleSelectModel = (model: SelectedModel) => {
    setSelectedModel(model);
    try {
      window.localStorage.setItem("xylos.chat.model", JSON.stringify(model));
    } catch {}
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput("");
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: "This is a simulated response." }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0d0e10] text-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold">Chat</h1>
            <ModelLibraryMenu
              isOpen={isProviderMenuOpen}
              onToggle={() => setIsProviderMenuOpen(!isProviderMenuOpen)}
              selected={selectedModel}
              onSelect={handleSelectModel}
            />
          </div>

          <div className="space-y-4 mb-4">
            {messages.map((msg, index) => (
              <div key={index} className={`p-4 rounded-xl ${msg.role === "user" ? "bg-primary" : "bg-white/10"}`}>
                <p className="text-sm">{msg.content}</p>
              </div>
            ))}
          </div>

          {currentSession && (
            <div className="text-xs text-white/40 mb-4">
              Session: {currentSession.id}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Thinking...
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 p-4">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Xylos AI..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-primary/50"
          />
          <button
            type="submit"
            disabled={(!input.trim()) || isLoading}
            className="px-6 py-3 rounded-xl bg-primary text-[#17181b] font-semibold hover:bg-[#4accc4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};