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
          className="relative flex items-center justify-center gap-4 px-10 md:px-16 py-5 md:py-6 rounded-none bg-foreground text-background font-black text-sm uppercase tracking-[0.2em] shadow-[4px_4px_0px_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_rgba(0,0,0,0.1)] transition-all duration-200 group w-full sm:w-auto overflow-hidden"
        >
          Launch Neural Link
          <MessageSquare aria-hidden="true" className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </Link>

        <Link
          href={isLoggedIn ? "/dashboard" : "/login"}
          className="relative px-12 py-6 rounded-none border border-foreground bg-transparent font-black text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-all duration-300 w-full sm:w-auto text-foreground text-center group"
        >
          <span className="relative z-10">{isLoggedIn ? "Admin Dashboard" : "Access Interface"}</span>
        </Link>
      </div>

      {/* Mobile Floating Action */}
      {isLoggedIn && (
        <Link
          href="/chat"
          aria-label="Launch Neural Link"
          className="md:hidden fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-none bg-foreground text-background flex items-center justify-center shadow-lg border border-border"
        >
          <MessageSquare className="w-6 h-6" />
        </Link>
      )}
    </>
  );
}
