"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
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
          className="relative flex items-center justify-center gap-4 px-10 md:px-16 py-5 md:py-6 rounded-2xl bg-amber-500 text-white font-bold text-sm uppercase tracking-[0.2em] shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group w-full sm:w-auto overflow-hidden"
          style={{ boxShadow: '0 4px 20px rgba(245,158,11,0.3)' }}
        >
          Launch Neural Link
          <MessageSquare aria-hidden="true" className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </Link>

        <Link
          href={isLoggedIn ? "/dashboard" : "/login"}
          className="relative px-12 py-6 rounded-2xl border bg-white/5 font-bold text-xs uppercase tracking-[0.2em] hover:bg-amber-500/10 transition-all duration-300 w-full sm:w-auto text-gray-400 text-center"
          style={{ borderColor: 'rgba(245,158,11,0.15)' }}
        >
          <span className="relative z-10">{isLoggedIn ? "Admin Dashboard" : "Access Interface"}</span>
        </Link>
      </div>

      {/* Mobile Floating Action */}
      {isLoggedIn && (
        <Link
          href="/chat"
          aria-label="Launch Neural Link"
          className="md:hidden fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg"
          style={{ boxShadow: '0 4px 20px rgba(245,158,11,0.4)' }}
        >
          <MessageSquare className="w-6 h-6" />
        </Link>
      )}
    </>
  );
}
