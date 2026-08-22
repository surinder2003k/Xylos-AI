"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Cute floating orbs that drift with scroll direction (like a curtain ribbon):
// scroll down → orbs glide up; scroll up → they settle back down.
// Hidden on mobile + respects prefers-reduced-motion. Never blocks clicks.

export function ScrollFloatingOrb() {
  const pathname = usePathname();
  const orbRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  // Only run on desktop pointers + when motion is allowed
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduced) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let lastY = window.scrollY;
    let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
    let rafId: number;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      // Ribbon-like drift: scroll down pulls orbs up & sideways
      targetX = Math.max(-60, Math.min(60, targetX + delta * 0.06));
      targetY = Math.max(-80, Math.min(80, targetY - delta * 0.08));
    };

    const tick = () => {
      // smooth lerp toward target, then slowly relax to center
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      targetX *= 0.985;
      targetY *= 0.985;

      if (orbRef.current) {
        orbRef.current.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [enabled, pathname]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ zIndex: 5 }}>
      <div ref={orbRef} className="absolute inset-0 will-change-transform">
        {/* Primary cyan orb */}
        <div
          className="absolute top-[22%] left-[12%] w-24 h-24 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(0,240,255,0.10), rgba(0,240,255,0.02) 65%, transparent)',
            border: '1px solid rgba(0, 240, 255, 0.12)',
            animation: 'floatEase 14s ease-in-out infinite',
          }}
        />
        {/* Secondary violet orb */}
        <div
          className="absolute top-[58%] right-[10%] w-16 h-16 rounded-full"
          style={{
            background: 'radial-gradient(circle at 40% 40%, rgba(157,140,255,0.09), transparent 70%)',
            border: '1px solid rgba(157, 140, 255, 0.10)',
            animation: 'floatEase 18s ease-in-out infinite reverse',
          }}
        />
        {/* Tiny teal accent */}
        <div
          className="absolute top-[38%] right-[28%] w-8 h-8 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(45,212,191,0.12), transparent 70%)',
            animation: 'floatEase 11s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  );
}