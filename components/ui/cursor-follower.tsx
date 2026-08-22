"use client";

import { useEffect, useRef, useState } from "react";

// A subtle cyan orb that follows the cursor with a slight lag, leaving a soft trail.
// Only active on fine pointers (desktop) and respects prefers-reduced-motion.
// Does not interfere with clicks (pointer-events: none).

export function CursorFollower() {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [target, setTarget] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const enabledRef = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduced) {
      enabledRef.current = true;
    } else {
      enabledRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!enabledRef.current) return;

    const handleMove = (e: MouseEvent) => {
      setTarget({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMove);

    const loop = () => {
      // Lerp current position toward target
      pos.x += (target.x - pos.x) * 0.15;
      pos.y += (target.y - pos.y) * 0.15;
      setPos({ x: pos.x, y: pos.y });
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!enabledRef.current) return null;

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        left: Math.round(pos.x) - 6, // half of 12px
        top: Math.round(pos.y) - 6,
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: "radial-gradient(circle at 30% 30%, rgba(0,240,255,0.6), transparent 70%)",
        boxShadow: "0 0 8px rgba(0,240,255,0.4), 0 0 16px rgba(0,240,255,0.2)",
        zIndex: 9999,
        // Optional: add a very subtle blur for glow
        filter: "blur(0.5px)",
      }}
      aria-hidden="true"
    />
  );
}