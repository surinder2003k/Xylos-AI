"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";

export function GlobalNavbar({ user }: { user: any }) {
  const pathname = usePathname();

  // Only exclude true app interfaces — dashboard, chat, login
  if (
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/login")
  ) {
    return null;
  }

  return <Navbar user={user} />;
}
