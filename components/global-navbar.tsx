"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";

export function GlobalNavbar({ user }: { user: any }) {
  const pathname = usePathname();

  // Do not show the marketing navbar on app interfaces, dashboard, or login screens
  if (
    pathname?.startsWith("/dashboard") || 
    pathname?.startsWith("/chat") || 
    pathname?.startsWith("/login")
  ) {
    return null;
  }

  return <Navbar user={user} />;
}
