"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";

export function GlobalNavbar({ user }: { user: any }) {
  const pathname = usePathname();

  // Do not show the marketing navbar on app interfaces, dashboard, login, or blog (has its own nav)
  if (
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/chat") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/blog")
  ) {
    return null;
  }

  return <Navbar user={user} />;
}
