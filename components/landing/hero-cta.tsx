"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

/**
 * HeroCTA — Client Component
 * 
 * Handles the auth-dependent CTA buttons on the landing page.
 * By moving this logic client-side, the parent page.tsx becomes
 * a fully static ISR page with no dynamic server-side auth check.
 * This eliminates the 1300ms+ document latency from Supabase getUser() calls.
 */
export function HeroCTA() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    // Non-blocking: check session only client-side
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12 max-w-2xl mx-auto w-full">
        <Link
          href="/chat"
          aria-label="Launch Xylos AI Neural Link Chat"
          className="relative flex items-center justify-center gap-4 px-10 md:px-16 py-5 md:py-6 rounded-[2rem] bg-gradient-to-r from-primary via-primary/95 to-secondary text-primary-foreground font-black text-sm uppercase tracking-[0.2em] shadow-[0_10px_35px_rgba(139,92,246,0.25)] hover:shadow-[0_15px_50px_rgba(139,92,246,0.45)] hover:scale-[1.03] active:scale-95 transition-all duration-300 group w-full sm:w-auto overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
          <div className="absolute inset-0 rounded-[2rem] border-2 border-white/10" />
          Launch Neural Link
          <MessageSquare aria-hidden="true" className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </Link>

        <Link
          href={isLoggedIn ? "/dashboard" : "/login"}
          className="relative px-12 py-6 rounded-[2rem] border border-border/80 bg-card/25 backdrop-blur-md font-black text-xs uppercase tracking-[0.2em] hover:bg-card/60 hover:border-secondary/40 transition-all duration-300 w-full sm:w-auto text-foreground text-center group"
        >
          <span className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10">{isLoggedIn ? "Admin Dashboard" : "Join the Matrix"}</span>
        </Link>
      </div>

      {/* Mobile Floating Action */}
      {isLoggedIn && (
        <Link
          href="/chat"
          aria-label="Launch Neural Link"
          className="md:hidden fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.3)] animate-bounce-slow"
        >
          <MessageSquare className="w-6 h-6" />
        </Link>
      )}
    </>
  );
}
