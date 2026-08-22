"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
  Square,
  LogOut,
  Menu
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { chatService, Message, ChatSession } from "@/lib/supabase/chat-service";
import { historyManager } from "@/lib/chat/history";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const providers = [
  { id: "best", name: "Best Free Route", icon: Sparkles },
  { id: "groq", name: "Groq GPT-OSS 120B", icon: Diamond },
  { id: "gemini", name: "Gemini 3.6 Flash", icon: Diamond },
  { id: "openrouter", name: "Nemotron Super (Free)", icon: Diamond },
];

function ChatContent() {
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isNearBottomRef = useRef(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const checkIfNearBottom = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const near = distFromBottom < 150;
    isNearBottomRef.current = near;
    setShowScrollBtn(!near);
  };

  const scrollToBottom = (force = false) => {
    if (force || isNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
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

  // Scroll to bottom only when switching chats, not on every message update
  useEffect(() => {
    const timeout = setTimeout(() => scrollToBottom(true), 100);
    return () => clearTimeout(timeout);
  }, [activeId]);

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
      
      if (isNewChat) router.push(`/dashboard/chat?id=${currentId}`);
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
    }
    setIsLoading(false);
    // Add a system message to indicate termination
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: '[Neural Link Terminated by User]' 
    }]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getDisplayContent = (msg: Message) => msg.content;

  return (
    <div className="flex h-[100dvh] w-full bg-background overflow-hidden relative pt-16 md:pt-16">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Chat History Sidebar */}
      <div className={`
        fixed md:static top-0 left-0 z-[60] h-full w-72 md:w-80 bg-white/[0.02] backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sora font-black text-xl uppercase tracking-wider text-white">Missions</span>
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{sessions.length} Deployments</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="w-8 h-8 rounded-full bg-white/5 hover:bg-primary/10 hover:text-primary text-white/40 flex items-center justify-center transition-colors" title="Back to Home">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </Link>
            <button onClick={() => router.push('/dashboard/chat')} className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {sessions.map(s => (
            <div key={s.id} className="relative group">
              <button 
                onClick={() => { router.push(`/dashboard/chat?id=${s.id}`); setIsSidebarOpen(false); }}
                className={`w-full text-left p-3 pt-4 rounded-xl transition-all ${activeId === s.id ? 'bg-primary/10 border-primary/20 text-white' : 'hover:bg-white/5 border-transparent text-white/50 hover:text-white'} border`}
              >
                <p className="text-sm font-bold truncate pr-8">{s.title}</p>
                <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mt-1">
                  {new Date(s.updatedAt).toLocaleDateString()}
                </p>
              </button>
              <button 
                onClick={async (e) => { 
                  e.stopPropagation(); 
                  await chatService.deleteSession(s.id); 
                  loadSessions(); 
                  if (activeId === s.id) router.push('/dashboard/chat'); 
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="p-4 mt-auto border-t border-white/10">
          <button 
            onClick={async () => {
              await signOut();
              router.push('/login');
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 text-sm text-white/40 hover:text-red-400 transition-all font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Primary Neural Workspace */}
      <div className="flex-1 flex flex-col relative h-full">

        <div className="h-16 md:h-20 border-b border-white/10 flex items-center px-4 md:px-8 bg-white/[0.02] backdrop-blur-xl sticky top-0 z-40">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all mr-4"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-semibold uppercase tracking-wide text-white/40 hidden sm:inline">Active Link:</span>
               <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">{selectedProvider.name}</span>
            </div>
          </div>
        </div>


        {/* Message Thread */}
        <div
          ref={messagesContainerRef}
          onScroll={checkIfNearBottom}
          className="flex-1 w-full overflow-y-auto custom-scrollbar pt-6 pb-40 md:pb-48"
        >
          <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-8">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-[60vh] text-center space-y-10"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 relative overflow-hidden group">
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
                    <h1 className="text-5xl md:text-8xl font-black font-sora tracking-tighter uppercase leading-none italic opacity-10 select-none">Neural Link</h1>
                    <h3 className="text-3xl md:text-4xl font-sora font-black tracking-tighter uppercase mt-[-30px] md:mt-[-40px]">Initiate <span className="text-primary italic">Xylos</span> AI</h3>
                    <p className="text-white/40 max-w-sm mx-auto text-base md:text-lg leading-relaxed font-medium">
                      Senior content strategist and research engineer at your disposal. Select a core model to begin.
                    </p>
                  </div>
                </motion.div>
              ) : (
                messages.map((message, i) => (
                  <motion.div 
                    key={message.id || i}
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
                          <div className="rounded-xl overflow-hidden border border-white/10 mb-2 max-w-[300px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={message.attachment.url} alt="Neural Asset" className="w-full h-auto object-cover" />
                          </div>
                        )}
                        
                        <div className={`px-5 py-4 rounded-xl text-sm md:text-base leading-relaxed relative group/msg ${message.role === 'user' ? 'bg-primary text-[#04141a] font-medium' : ''}`}>
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
                                <div className="flex items-center gap-2 mt-2">
                                  <button 
                                    onClick={() => copyToClipboard(message.content)}
                                    className="p-1 px-3 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 text-[9px] font-semibold uppercase tracking-wide transition-all flex items-center gap-1"
                                  >
                                    <Copy className="w-3 h-3" /> Copy
                                  </button>
                                </div>
                                <button 
                                  onClick={() => { setEditingMsgIndex(i); setEditContent(message.content); }}
                                  className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 text-white/30 hover:text-white opacity-0 group-hover/msg:opacity-100 transition-opacity"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </>
                            )
                          ) : (
                            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-p:my-1 prose-headings:mb-2 prose-code:text-primary prose-pre:bg-white/5 prose-pre:border-white/10 prose-pre:p-0">
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
                                             className="text-white/30 hover:text-primary transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest"
                                          >
                                            <Copy className="w-3 h-3" /> Copy
                                          </button>
                                        </div>
                                        <div className="overflow-x-auto bg-white/5 p-4 border border-white/10 rounded-b-lg">
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
                            className="p-1 px-3 rounded-xl hover:bg-white/5 text-[9px] font-semibold uppercase tracking-wide text-white/30 hover:text-primary transition-all border border-transparent hover:border-white/10 mt-1 flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" /> Copy Response
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary animate-spin" />
                  </div>
                  <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-xl flex gap-2 items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button
            onClick={() => { isNearBottomRef.current = true; scrollToBottom(true); }}
            className="absolute bottom-44 right-6 z-20 p-2.5 rounded-full bg-primary text-[#04141a] shadow-xl hover:scale-110 transition-all animate-bounce"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}

        {/* Neural Input Interface */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-background via-background/95 to-transparent pt-8 pb-4 px-2 md:pt-12 md:pb-8 md:px-12">
          <div className="max-w-3xl mx-auto relative">
            <div className={`glass-card ${isLoading ? 'border-violet-500/50' : 'border-white/10'} transition-all focus-within:border-violet-500/50 overflow-hidden`}>
              {stagedFile && (
                <div className="mx-6 mt-4 flex items-center gap-3 bg-white/5 border border-white/10 pl-3 pr-2 py-2 rounded-xl animate-in fade-in slide-in-from-bottom-2">
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
                className="w-full bg-transparent border-none focus:ring-0 px-5 md:px-8 py-4 md:py-6 text-sm md:text-lg resize-none min-h-[56px] md:min-h-[72px] max-h-[200px] md:max-h-[300px] outline-none font-medium placeholder:text-white/20 disabled:opacity-50 text-white"
              />
              
              <div className="flex items-center justify-between px-4 md:px-6 pb-3 md:pb-4 pt-2">
                <div className="flex items-center gap-3">
                   <button onClick={() => fileInputRef.current?.click()} className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-white/30 hover:text-primary">
                       <Paperclip className="w-5 h-5" />
                    </button>
                    <button onClick={toggleMic} className={`p-2.5 rounded-xl transition-all ${isMicActive ? 'bg-primary/20 text-primary animate-pulse' : 'hover:bg-white/5 text-white/30 hover:text-primary'}`}>
                      <Mic className="w-5 h-5" />
                   </button>
                   <div className="w-[1px] h-6 bg-white/10 mx-1" />
                   <div className="relative">
                     <button 
                      onClick={() => setIsProviderMenuOpen(!isProviderMenuOpen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 transition-all text-[10px] font-semibold uppercase tracking-wide text-white/40"
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
                            className="absolute bottom-[110%] left-0 w-64 glass-card shadow-2xl rounded-xl overflow-hidden z-[100]"
                          > {providers.map((p) => (
                            <button key={p.id} onClick={() => { setSelectedProvider(p); setIsProviderMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${selectedProvider.id === p.id ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-white/50 hover:text-white'}`}>
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
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          stopGeneration();
                        }} 
                        className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 group/stop"
                      >
                         <Square className="w-5 h-5 fill-current group-hover:scale-90 transition-transform" />
                         <span className="text-[10px] font-semibold uppercase tracking-wide hidden sm:inline">Terminate</span>
                      </button>
                    ) : (
                      <button 
                        onClick={handleSend} 
                        disabled={(!input.trim() && !stagedFile) || isLoading} 
                        className="p-3.5 rounded-xl bg-primary text-[#04141a] hover:bg-[#33f3ff] transition-all disabled:opacity-50"
                      >
                         <Send className="w-5 h-5" />
                      </button>
                    )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-6 text-[8px] font-semibold uppercase tracking-wide text-white/20 italic select-none">
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

export default function ChatPage() {
  return (
    <Suspense fallback={
       <div className="flex h-full w-full items-center justify-center bg-background">
         <div className="w-12 h-12 rounded-[1.5rem] bg-primary/5 flex items-center justify-center border border-primary/10 animate-pulse">
           <Sparkles className="w-6 h-6 text-primary animate-spin" />
         </div>
       </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
