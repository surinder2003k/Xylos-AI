"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  LogOut, 
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Moon,
  Sun,
  Menu,
  X,
  Trash2,
  ChevronDown
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { motion, AnimatePresence } from "framer-motion";
import { chatService, ChatSession } from "@/lib/supabase/chat-service";
import { createClient } from "@/utils/supabase/client";
import { XylosLogo } from "@/components/premium/xylos-logo";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userInitial, setUserInitial] = useState<string>("U");
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeId = searchParams.get("id");

  useEffect(() => {
    setMounted(true);
    refreshSessions();

    // Fetch authenticated user info
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserEmail(user.email || "");
          // Try to get profile name
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', user.id)
            .single();
          const name = profile?.full_name || user.email?.split('@')[0] || 'Xylos Pilot';
          setUserName(name);
          setUserInitial((name[0] || 'U').toUpperCase());
        }
      } catch (e) {
        console.warn('Profile fetch failed:', e);
      }
    };
    fetchUser();

    const handleStorageChange = () => refreshSessions();
    window.addEventListener('chat_history_updated', handleStorageChange);

    return () => {
      window.removeEventListener('chat_history_updated', handleStorageChange);
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isProfileOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-profile-menu]')) {
          setIsProfileOpen(false);
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileOpen]);

  const refreshSessions = async () => {
    try {
      const data = await chatService.getSessions();
      setSessions(data);
    } catch (e) {
      console.warn("Failed to fetch sessions: ", e);
    }
  };

  const handleNewChat = () => {
    router.push("/chat");
    setIsMobileMenuOpen(false);
  };

  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await chatService.deleteSession(id);
      refreshSessions();
      if (activeId === id) router.push("/chat");
    } catch (err) {
      console.error("Failed to delete session: ", err);
    }
  };

  if (!mounted) return null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-border p-4">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-4 py-6 mb-2">
        <XylosLogo className="w-8 h-8" />
        <span className="font-fustat font-black tracking-tighter text-xl uppercase">Xylos <span className="text-primary italic">AI</span></span>
      </div>

      {/* Sidebar Header */}
      <div className="space-y-2 mb-6">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 w-full px-4 py-2.5 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl text-sm font-semibold transition-all group"
        >
          <PanelLeftClose className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <button 
          onClick={handleNewChat}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl bg-foreground text-background hover:bg-foreground/90 text-sm font-bold transition-all shadow-md active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
        <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-50">Recent Activities</div>
        <AnimatePresence mode="popLayout">
          {sessions.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-muted-foreground italic">No neural logs yet.</div>
          ) : (
            sessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <Link 
                  href={`/chat?id=${session.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all group ${
                    activeId === session.id 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <MessageSquare className={`w-4 h-4 ${activeId === session.id ? 'text-primary' : 'opacity-50'}`} />
                  <span className="truncate flex-1 text-sm">{session.title}</span>
                  <button 
                    onClick={(e) => handleDeleteSession(e, session.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar Footer - Only theme toggle and settings, no logout/profile */}
      <div className="mt-auto pt-6 border-t border-border/50 space-y-2">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-muted transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span className="text-sm font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        
        <Link href="/settings" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-muted transition-all text-muted-foreground hover:text-foreground">
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Arsenal Settings</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Desk Sidebar */}
      <div className="hidden md:block">
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="h-full relative overflow-hidden"
            >
              <SidebarContent />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed inset-y-0 left-0 w-[80%] max-w-[300px] z-[70] md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 border-b border-border/40 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-50 bg-background/50 backdrop-blur">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)} 
                className="md:hidden p-2 hover:bg-muted rounded-lg text-muted-foreground"
              >
                 <Menu className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="hidden md:flex p-2 hover:bg-muted rounded-lg text-muted-foreground"
              >
                 {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
              </button>
              
              <h2 className="text-sm font-semibold text-muted-foreground truncate max-w-[200px]">
                {activeId ? sessions.find(s => s.id === activeId)?.title : 'Main Chat Protocol'}
              </h2>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="hidden sm:block px-3 py-1 rounded-full bg-secondary/10 text-[10px] font-bold text-secondary uppercase tracking-widest border border-secondary/20">
                 Universal Buffer v3
              </div>

              {/* Profile Avatar - Top Right */}
              <div className="relative" data-profile-menu>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center border-2 border-background shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="text-white font-bold text-sm">{userInitial}</span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-2xl shadow-2xl z-[100] overflow-hidden"
                    >
                      {/* Profile Info */}
                      <div className="p-4 border-b border-border/50 bg-muted/20">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">{userInitial}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{userName || 'Neural Pilot'}</span>
                            <span className="text-[11px] text-muted-foreground">{userEmail || 'loading...'}</span>
                          </div>
                        </div>
                        <div className="mt-3 px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest text-center">
                          Free Plan
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-2">
                        <Link 
                          href="/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-muted transition-all text-sm text-muted-foreground hover:text-foreground"
                        >
                          <Settings className="w-4 h-4" />
                          Profile Settings
                        </Link>
                        
                        <button 
                          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-muted transition-all text-sm text-muted-foreground hover:text-foreground"
                        >
                          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </button>

                        <div className="my-1 border-t border-border/50" />

                        <button 
                          onClick={() => signOut()}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-sm text-muted-foreground hover:text-red-500 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
           </div>
        </header>

        <main className="flex-1 relative overflow-hidden flex flex-col">
           {children}
        </main>
      </section>
    </div>
  );
}
