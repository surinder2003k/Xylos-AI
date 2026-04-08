"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Paperclip, 
  Mic, 
  Settings2, 
  Sparkles, 
  ChevronDown,
  Diamond,
  Plus,
  ImageIcon,
  Copy,
  Check,
  Edit2,
  Edit3,
  X,
  FileText,
  Trash2,
  Square
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { chatService, Message, ChatSession } from "@/lib/supabase/chat-service";
import { AnimatedLogo } from "@/components/premium/animated-logo";
import { historyManager } from "@/lib/chat/history";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const providers = [
  { id: "best", name: "Best Free Route", icon: Sparkles },
  { id: "groq", name: "Groq Llama 3.3", icon: Diamond },
  { id: "gemini", name: "Gemini 2.5 Flash", icon: Diamond },
  { id: "openrouter", name: "OpenRouter Flash", icon: Diamond },
];

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeId = searchParams.get("id");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProviderMenuOpen, setIsProviderMenuOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(providers[0]);
  const [isMicActive, setIsMicActive] = useState(false);
  const [stagedFile, setStagedFile] = useState<{name: string, content: string, type: string} | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [editingMsgIndex, setEditingMsgIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Initial Load & Session Management
  const loadSessions = async () => {
    try {
      const data = await chatService.getSessions();
      setSessions(data);
    } catch (e) {
      console.error("[Neural Matrix] Session Sync Failed:", e);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [activeId]);

  useEffect(() => {
    const loadChat = async () => {
      if (activeId) {
        try {
          const msgs = await chatService.getMessages(activeId);
          setMessages(msgs);
        } catch (e) {
          console.error("[Neural Matrix] Chat Retrieval Failed:", e);
        }
      } else {
        setMessages([]);
      }
    };
    loadChat();
  }, [activeId]);

  useEffect(() => {
    const timeout = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeout);
  }, [messages, isLoading]);

  // 2. Speech Recognition Engine
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'speechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join(" ");
        setInput((prev: string) => {
          if (prev.endsWith(transcript) || prev.includes(transcript)) return prev;
          return prev + (prev.length > 0 && !prev.endsWith(" ") ? " " : "") + transcript;
        });
      };
      recognitionRef.current.onerror = () => setIsMicActive(false);
      recognitionRef.current.onend = () => setIsMicActive(false); // Make sure it turns off when it automatically stops listening
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isMicActive) {
      recognitionRef.current.stop();
      setIsMicActive(false);
    } else {
      recognitionRef.current.start();
      setIsMicActive(true);
    }
  };

  // 3. File Asset Management
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setStagedFile({
        name: file.name,
        content: event.target?.result as string,
        type: file.type
      });
    };
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 4. Core Intelligence Dispatch
  const handleSend = async () => {
    if ((!input.trim() && !stagedFile) || isLoading) return;
    
    if (isMicActive) {
      recognitionRef.current?.stop();
      setIsMicActive(false);
    }

    let currentId = activeId;
    let isNewChat = false;

    // Initialize session if needed
    if (!currentId) {
      try {
        const title = historyManager.generateTitle(input);
        const session = await chatService.createSession(title);
        currentId = session.id;
        isNewChat = true;
      } catch (e) {
        console.error("[Neural Matrix] Session Creation Error:", e);
        return;
      }
    }

    const userMsg: Message = { 
      role: "user", 
      content: input,
      attachment: stagedFile ? {
        name: stagedFile.name,
        url: stagedFile.content,
        type: stagedFile.type
      } : undefined
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setStagedFile(null);
    setIsLoading(true);

    // Save User Intent to Matrix
    await chatService.saveMessage(currentId, userMsg);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ 
            role: m.role, 
            content: m.content, 
            attachments: m.attachment ? [m.attachment] : [] 
          })),
          provider: selectedProvider.id
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Neural Link Interrupted");
      }

      const data = await response.json();
      const assistantMsg: Message = {
        role: "assistant",
        content: data.content
      };

      // Synchronize AI Insight to Matrix
      await chatService.saveMessage(currentId, assistantMsg);
      setMessages(prev => [...prev, assistantMsg]);
      
      if (isNewChat) router.push(`/chat?id=${currentId}`);
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message || 'The mission encountered a catastrophic failure.'}` 
      }]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getDisplayContent = (msg: Message) => msg.content;

  return (
    <div className="flex h-full w-full bg-background overflow-hidden relative">
      {/* Primary Neural Workspace */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border/50">
          <AnimatedLogo className="scale-75 origin-left" />
          <button onClick={() => router.push('/chat')} className="p-2 rounded-xl bg-muted/50">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 w-full overflow-y-auto custom-scrollbar pt-6 pb-48">
          <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-8">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-[60vh] text-center space-y-10"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-[3rem] bg-primary/5 flex items-center justify-center border border-primary/10 relative overflow-hidden group">
                      <Sparkles className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                      transition={{ repeat: Infinity, duration: 6 }}
                      className="absolute inset-0 bg-primary/20 blur-[100px] -z-10" 
                    />
                  </div>
                  <div className="space-y-4">
                    <h1 className="text-6xl md:text-8xl font-black font-fustat tracking-tighter uppercase leading-none italic opacity-10 select-none">Neural Link</h1>
                    <h3 className="text-4xl font-fustat font-black tracking-tighter uppercase mt-[-40px]">Initiate <span className="text-primary italic">Xylos</span> AI</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto text-lg leading-relaxed font-medium">
                      Senior content strategist and research engineer at your disposal. Select a core model to begin.
                    </p>
                  </div>
                </motion.div>
              ) : (
                messages.map((message, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[90%] md:max-w-[80%] ${message.role === 'user' ? 'flex flex-col items-end' : 'flex gap-4'}`}>
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      
                      <div className="flex-1 space-y-2">
                        {message.attachment && message.attachment.type.startsWith('image/') && (
                          <div className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl mb-2 max-w-[300px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={message.attachment.url} alt="Neural Asset" className="w-full h-auto object-cover" />
                          </div>
                        )}
                        
                        <div className={`px-5 py-4 rounded-[1.8rem] text-sm md:text-base leading-relaxed relative group/msg ${message.role === 'user' ? 'bg-foreground text-background font-medium' : ''}`}>
                          {message.role === 'user' ? (
                            editingMsgIndex === i ? (
                              <div className="flex flex-col gap-3 min-w-[250px]">
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="w-full bg-background/10 text-background border border-background/20 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-background/30 placeholder:text-background/40 resize-y min-h-[80px]"
                                />
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => setEditingMsgIndex(null)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-background/10 hover:bg-background/20 transition-colors">Cancel</button>
                                  <button 
                                    onClick={() => {
                                      const newHistory = messages.slice(0, i);
                                      setMessages(newHistory);
                                      setInput(editContent);
                                      setEditingMsgIndex(null);
                                    }}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-background text-foreground hover:bg-background/90 transition-colors flex items-center gap-1"
                                  >
                                    <Send className="w-3 h-3" /> Update & Send
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="whitespace-pre-wrap">{message.content}</div>
                                <button 
                                  onClick={() => { setEditingMsgIndex(i); setEditContent(message.content); }}
                                  className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 rounded-full bg-muted/50 text-muted-foreground hover:text-foreground opacity-0 group-hover/msg:opacity-100 transition-opacity"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </>
                            )
                          ) : (
                            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-p:my-1 prose-headings:mb-2 prose-code:text-primary prose-pre:bg-black/40 prose-pre:border-white/5 prose-pre:p-0">
                              <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  code({node, inline, className, children, ...props}: any) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                      <div className="relative group/code mt-4 mb-4">
                                        <div className="flex items-center justify-between px-4 py-2 bg-black/60 rounded-t-lg border border-white/10 border-b-0">
                                          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{match[1]}</span>
                                          <button 
                                            onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}
                                            className="text-white/40 hover:text-primary transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest"
                                          >
                                            <Copy className="w-3 h-3" /> Copy
                                          </button>
                                        </div>
                                        <div className="overflow-x-auto bg-[#0a0a0a] p-4 border border-white/10 rounded-b-lg shadow-2xl">
                                          <code className={`${className} text-primary/90 font-mono`} {...props}>
                                            {children}
                                          </code>
                                        </div>
                                      </div>
                                    ) : (
                                      <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary text-sm font-mono border border-primary/20" {...props}>
                                        {children}
                                      </code>
                                    )
                                  }
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>

                        {message.role === 'assistant' && (
                          <button 
                            onClick={() => copyToClipboard(message.content)}
                            className="p-1 px-3 rounded-lg hover:bg-muted text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-violet-400 transition-all border border-transparent hover:border-white/5 mt-1"
                          >
                            Copy Matrix Logic
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-violet-500 animate-spin" />
                  </div>
                  <div className="bg-muted/10 border border-white/5 px-6 py-4 rounded-[2rem] flex gap-2 items-center">
                    <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Neural Input Interface */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-background via-background/95 to-transparent pt-12 pb-8 px-4 md:px-12">
          <div className="max-w-3xl mx-auto relative">
            <div className={`bg-card/80 backdrop-blur-2xl border ${isLoading ? 'border-violet-500/50' : 'border-border/50'} rounded-[2.5rem] shadow-2xl transition-all focus-within:border-violet-500/50 overflow-hidden`}>
              {stagedFile && (
                <div className="mx-6 mt-4 flex items-center gap-3 bg-white/5 border border-white/5 pl-3 pr-2 py-2 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                  <div className="w-8 h-8 rounded bg-violet-500/10 flex items-center justify-center text-violet-500">
                    {stagedFile.type.startsWith('image/') ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-bold truncate flex-1">{stagedFile.name}</span>
                  <button onClick={() => setStagedFile(null)} className="p-1.5 hover:bg-white/5 rounded-lg text-muted-foreground"><X className="w-3.5 h-3.5" /></button>
                </div>
              )}

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder={isLoading ? "Neural Engine Processing..." : "What mission shall we deploy?"}
                disabled={isLoading}
                className="w-full bg-transparent border-none focus:ring-0 px-8 py-6 text-base md:text-lg resize-none min-h-[72px] max-h-[300px] outline-none font-medium placeholder:text-muted-foreground/30 disabled:opacity-50"
              />
              
              <div className="flex items-center justify-between px-6 pb-4 pt-2">
                <div className="flex items-center gap-3">
                   <button onClick={() => fileInputRef.current?.click()} className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-muted-foreground hover:text-primary">
                      <Paperclip className="w-5 h-5" />
                   </button>
                   <button onClick={toggleMic} className={`p-2.5 rounded-xl transition-all ${isMicActive ? 'bg-primary/20 text-primary animate-pulse' : 'hover:bg-white/5 text-muted-foreground hover:text-primary'}`}>
                      <Mic className="w-5 h-5" />
                   </button>
                   <div className="w-[1px] h-6 bg-white/10 mx-1" />
                   <div className="relative">
                     <button 
                      onClick={() => setIsProviderMenuOpen(!isProviderMenuOpen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                     >
                        <selectedProvider.icon className="w-3.5 h-3.5 text-primary" />
                        <span className="hidden sm:inline">{selectedProvider.name}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${isProviderMenuOpen ? 'rotate-180' : ''}`} />
                     </button>
                     {/* Provider Dropdown Popup */}
                     <AnimatePresence>
                       {isProviderMenuOpen && (
                         <motion.div 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           className="absolute bottom-[110%] left-0 w-64 bg-card/90 backdrop-blur-2xl border border-border shadow-2xl rounded-2xl overflow-hidden z-[100]"
                         > {providers.map((p) => (
                            <button key={p.id} onClick={() => { setSelectedProvider(p); setIsProviderMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${selectedProvider.id === p.id ? 'bg-violet-500/10 text-violet-500' : 'hover:bg-white/5'}`}>
                              <div className="flex items-center gap-3 text-xs font-bold"><p.icon className="w-4 h-4" />{p.name}</div>
                            </button>
                          ))}
                        </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                </div>

                <div className="flex items-center gap-2">
                   {isLoading ? (
                     <button onClick={stopGeneration} className="p-3.5 rounded-2xl bg-muted/50 border border-white/5 text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2">
                        <Square className="w-5 h-5 fill-current" />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Terminate</span>
                     </button>
                   ) : (
                     <button onClick={handleSend} disabled={!input.trim() && !stagedFile} className="p-3.5 rounded-2xl bg-foreground text-background hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50">
                        <Send className="w-5 h-5" />
                     </button>
                   )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-6 text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic select-none">
               <span>AES-256 SECURED</span>
               <div className="w-1 h-1 bg-primary/30 rounded-full" />
               <span>NEURAL MATRIX V3.5</span>
               <div className="w-1 h-1 bg-primary/30 rounded-full" />
               <span>PERSISTENCE ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
    </div>
  );
}
