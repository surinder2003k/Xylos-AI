"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Do not show scroll to top button inside chat or dashboard applications to avoid UI overlapping
  if (
    pathname?.startsWith("/chat") ||
    pathname?.startsWith("/dashboard")
  ) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 md:bottom-8 right-6 md:right-8 z-[100] p-4 rounded-none bg-foreground text-background border border-border shadow-md hover:border-foreground/30 hover:scale-105 active:scale-95 transition-all duration-300 transform group ${
        isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-50 translate-y-4 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
    </button>
  );
}
