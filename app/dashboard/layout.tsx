"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  MessageSquare, 
  PenSquare, 
  BookOpen, 
  Terminal, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  Search,
  User,
  ShieldCheck,
  FlaskConical,
  Diamond,
  Home
} from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/utils/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnimatedLogo } from "@/components/premium/animated-logo";
import { useToast } from "@/components/ui/toast";

const baseNavItems = [
  { icon: Home, label: "Main Portal", href: "/" },
  { icon: MessageSquare, label: "Smart Chat", href: "/chat" },
  { icon: BookOpen, label: "All Stories", href: "/dashboard/posts" },
  { icon: PenSquare, label: "Create New", href: "/dashboard/create" },
];

const adminNavItem = { icon: Terminal, label: "Platform Admin", href: "/dashboard/ai-manager" };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [mounted, setMounted] = useState(false);
  const [screenWidth, setScreenWidth] = useState(1200); // Safe default for SSR
  const pathname = usePathname();
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
    setScreenWidth(window.innerWidth);
    
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchUserProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const email = user.email || "";
        setUserEmail(email);
        
        // Super Admin Fallback (Hardcoded for user's specific emails)
        const superAdmins = ["sendltestmaill@gmail.com", "xyzg135@gmail.com"];
        if (superAdmins.includes(email)) {
          setIsAdmin(true);
          setUserRole("admin");
        }

        try {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("user_id", user.id)
            .maybeSingle();
          
          if (!profileError && profile?.role === "admin") {
            setIsAdmin(true);
            setUserRole("admin");
          }
        } catch (e) {
          console.warn("[Editorial Sync] Role validation skipped:", e);
        }
      }
    }
    fetchUserProfile();
  }, []);

  const sidebarItems = isAdmin ? [...baseNavItems, adminNavItem] : baseNavItems;

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-500 relative">
      {/* Mobile Sidebar Toggle - Only visible when sidebar is closed on small screens */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-6 left-6 z-[60] lg:hidden p-4 rounded-2xl bg-primary text-black shadow-2xl shadow-primary/40 active:scale-90 transition-all border border-white/20"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (mounted && window.innerWidth < 1024) setIsSidebarOpen(false);
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : (mounted && screenWidth < 1024 ? 0 : 80),
          x: !isSidebarOpen && (mounted && screenWidth < 1024) ? -280 : 0
        }}
        className={`fixed lg:relative z-50 border-r border-border bg-sidebar backdrop-blur-2xl flex flex-col transition-all duration-300 flex-shrink-0 h-full ${!isSidebarOpen && 'hidden lg:flex'}`}
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.div 
                key="logo-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2"
              >
                <AnimatedLogo />
              </motion.div>
            ) : (
              <motion.div 
                key="logo-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AnimatedLogo showText={false} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : 'group-hover:text-primary transition-colors duration-300'}`} />
                {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                {isSidebarOpen && item.label === "Platform Admin" && (
                  <span className="ml-auto text-[9px] font-black uppercase tracking-widest bg-primary/20 text-primary px-2 py-0.5 rounded-full">Admin</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Admin Badge in Sidebar */}
        {isSidebarOpen && isAdmin && (
          <div className="mx-4 mb-4 p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Super Admin</p>
              <p className="text-[9px] text-muted-foreground truncate">{userEmail}</p>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-4 top-10 w-8 h-8 rounded-full border border-border bg-sidebar flex items-center justify-center hover:bg-muted transition-colors shadow-lg z-[60]"
        >
          {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-border flex items-center justify-between px-4 md:px-8 bg-background/50 backdrop-blur-md flex-shrink-0 sticky top-0 z-40">
          <div className="hidden sm:flex items-center gap-3 bg-muted border border-border px-4 py-2.5 rounded-xl w-32 md:w-96 shadow-inner group focus-within:border-primary/50 transition-all">
            <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search stories, contributors, insights..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            {isAdmin && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 shadow-neon-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Admin</span>
              </div>
            )}
            <div className="relative" data-profile-menu>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border border-white/10 flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-primary/40 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
              </button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 w-52 bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden"
                  >
                    <div className="p-3">
                      <div className="px-3 py-3 mb-2 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-xs font-bold text-white/90 truncate">{userEmail || "Editorial Lead"}</p>
                        <p className="text-[9px] font-black text-violet-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          {userRole}
                        </p>
                      </div>
                      <div className="p-1 space-y-1">
                        <div className="my-1 border-t border-white/5" />
                        <Link 
                          href="/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-sm text-white/60 hover:text-white"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <div className="my-1 border-t border-white/5" />
                        <button 
                          onClick={async () => {
                            await signOut();
                            showToast("Security session terminated. Safe travels.", "success");
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-sm text-white/60 hover:text-red-400 transition-all font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key={pathname}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
