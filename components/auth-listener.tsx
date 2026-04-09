"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function AuthListener() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Listen for global auth state changes (like cross-tab logout)
      if (event === "SIGNED_OUT") {
        // Force the app to clear router cache and reload the state
        router.refresh();
        // Redirect to home if they log out in another tab
        window.location.href = "/";
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null;
}
