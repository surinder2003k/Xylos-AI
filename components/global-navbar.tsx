"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

/**
 * GlobalNavbar — Client Component
 * 
 * Handles the display of the landing page navbar and manages
 * the user session client-side to ensure the RootLayout can
 * remain static and performant.
 */
export function GlobalNavbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    // Non-blocking: fetch session client-side
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Only exclude true app interfaces — dashboard, chat, login
  if (
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/chat")
  ) {
    return null;
  }

  return <Navbar user={user} />;
}
