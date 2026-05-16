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
          className="relative flex items-center justify-center gap-4 px-10 md:px-16 py-5 md:py-6 rounded-[2rem] bg-foreground text-background font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(var(--foreground),0.1)] hover:shadow-[0_0_60px_rgba(var(--foreground),0.2)] hover:scale-105 active:scale-95 transition-all group w-full sm:w-auto"
        >
          <div className="absolute inset-0 rounded-[2rem] border-2 border-background/20 animate-pulse" />
          Launch Neural Link
          <MessageSquare aria-hidden="true" className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </Link>

        <Link
          href={isLoggedIn ? "/dashboard" : "/login"}
          className="px-12 py-6 rounded-[2rem] border border-border bg-card/40 backdrop-blur-md font-black text-xs uppercase tracking-[0.2em] hover:bg-muted/50 transition-all w-full sm:w-auto text-foreground text-center"
        >
          {isLoggedIn ? "Admin Dashboard" : "Join the Matrix"}
        </Link>
      </div>

      {/* Mobile Floating Action */}
      {isLoggedIn && (
        <Link
          href="/chat"
          aria-label="Launch Neural Link"
          className="md:hidden fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-2xl bg-primary text-black flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.3)] animate-bounce-slow"
        >
          <MessageSquare className="w-6 h-6" />
        </Link>
      )}
    </>
  );
}
