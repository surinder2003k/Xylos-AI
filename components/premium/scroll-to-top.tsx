"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // Hide until scrolled at least one full viewport, then show.
  // Also hide on mount if already at top (prevents flicker at page top).
  useEffect(() => {
    const toggleVisibility = () => {
      const scrollThreshold = Math.max(window.innerHeight, 600);
      setIsVisible(window.scrollY > scrollThreshold);
    };

    toggleVisibility(); // initial check
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (
    pathname?.startsWith("/chat") ||
    pathname?.startsWith("/dashboard")
  ) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 md:bottom-8 right-6 md:right-8 z-[100] rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 transform group ${
        isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-50 translate-y-4 pointer-events-none"
      }`}
      style={{
        background: '#14171c',
        border: '1px solid rgba(0, 240, 255, 0.25)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
        minHeight: '44px',
        minWidth: '44px',
      }}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-6 h-6 transition-transform group-hover:-translate-y-0.5" style={{ color: '#00f0ff' }} />
    </button>
  );
}
