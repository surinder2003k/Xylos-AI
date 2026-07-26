"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Terminal, MessageSquare } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

/**
 * HeroCTA — Client Component
 * 
 * Handles the auth-dependent CTA buttons on the landing page.
 */
export function HeroCTA() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12 max-w-2xl mx-auto w-full">
        <Link
          href="/chat"
          aria-label="Launch Xylos AI Neural Link Chat"
          className="relative flex items-center justify-center gap-4 px-10 md:px-16 py-5 md:py-6 bg-[#00ff41] text-black font-bold text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(0,255,65,0.3)] hover:shadow-[0_0_50px_rgba(0,255,65,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group w-full sm:w-auto overflow-hidden"
        >
          <Terminal className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Launch Neural Link
          <MessageSquare aria-hidden="true" className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </Link>

        <Link
          href={isLoggedIn ? "/dashboard" : "/login"}
          className="relative px-12 py-6 border border-[#00ff41]/10 bg-[#00ff41]/[0.02] font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#00ff41]/[0.05] transition-all duration-300 w-full sm:w-auto text-[#00ff41]/50 text-center"
        >
          <span className="relative z-10">{isLoggedIn ? "admin_dashboard" : "access_interface"}</span>
        </Link>
      </div>

      {/* Mobile Floating Action */}
      {isLoggedIn && (
        <Link
          href="/chat"
          aria-label="Launch Neural Link"
          className="md:hidden fixed bottom-6 right-6 z-[100] w-14 h-14 bg-[#00ff41] text-black flex items-center justify-center shadow-lg shadow-[#00ff41]/30"
        >
          <Terminal className="w-6 h-6" />
        </Link>
      )}
    </>
  );
}
