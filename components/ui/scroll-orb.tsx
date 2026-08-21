"use client";

import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// A cute floating fantasy orb that moves with scroll direction
// - Scrolls down → orb moves right/up
// - Scrolls up → orb moves left/down
// Creates a subtle parallax-like effect

export function ScrollFloatingOrb() {
  const pathname = usePathname();
  const [scrollY, setScrollY] = useState(0);
  const orbRef = useRef<HTMLDivElement>(null);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Calculate orb position based on scroll direction
  useEffect(() => {
    if (!orbRef.current) return;

    let rafId: number;
    const updatePosition = () => {
      const scrollTop = window.scrollY;
      const delta = scrollTop - scrollY;
      
      if (orbRef.current) {
        // Move orb based on scroll direction
        if (delta > 5) {
          // Scrolling down - move orb right/up
          orbRef.current.style.transform = `translate(calc(${scrollTop * 0.02}px), calc(-${scrollTop * 0.015}px))`;
        } else if (delta < -5) {
          // Scrolling up - move orb left/down
          orbRef.current.style.transform = `translate(calc(-${Math.abs(scrollTop) * 0.02}px), calc(${Math.abs(scrollTop) * 0.015}px))`;
        } else {
          // Subtle float when not scrolling
          const time = Date.now() * 0.001;
          orbRef.current.style.transform = `translate(calc(50% + 10px * Math.sin(time * 0.5)), calc(50% + 8px * Math.cos(time * 0.7)))`;
        }
      }
      
      rafId = requestAnimationFrame(updatePosition);
    };

    updatePosition();
    
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", () => {});
    };
  }, [scrollY, pathname]);

  return (
    <div
      ref={orbRef}
      className="fixed inset-0 pointer-events-none overflow-hidden opacity-5"
      style={{ 
        pointerEvents: 'none',
        zIndex: '999' 
      }}
    >
      {/* Floating decorative orbs */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-primary/5 opacity-60 animate-pulse-slow"
        style={{ 
          border: '1px solid rgba(0, 240, 255, 0.3)',
          animation: 'floatEase 20s ease-in-out infinite'
        }}
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-1/4 right-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-secondary/5 opacity-50 animate-pulse-slow"
        style={{ 
          border: '1px solid rgba(157, 140, 255, 0.3)',
          animation: 'floatEase 25s ease-in-out infinite reverse'
        }}
        aria-hidden="true"
      />
      {/* Main orb that follows scroll */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-primary/10 border border-primary/20 opacity-80 transition-all duration-700 ease-out"
        style={{ 
          width: '16px',
          height: '16px',
          animation: 'orbFloat 6s ease-in-out infinite',
          transform: 'translate(0, 0)'
        }}
        aria-hidden="true"
      />
    </div>
  );
}

// Keyframes are expected to be in globals.css or a style tag
// We'll inject them via a style tag