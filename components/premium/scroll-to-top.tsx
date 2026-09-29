"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";

/**
 * Scroll-to-top control with an inline progress ring.
 *
 * Problems with the previous version:
 *   - `transition-all` animated every animatable property (including layout),
 *     so the reveal was visibly janky.
 *   - `hover:scale-105` and the hidden-state `scale-50` were both plain
 *     Tailwind utilities on the same element, so a pointer resting on the
 *     invisible button scaled a nearly-transparent thing up — it read as a
 *     glitch rather than a control.
 *   - Opaque flat fill with no blur made it look like a sticker pasted on the
 *     page, and on mobile it sat only ~16px above the chat FAB in
 *     components/landing/hero-cta.tsx, so the two read as one broken cluster.
 *
 * Now framer-motion owns the transform outright (no competing scale classes),
 * the ring reports how far down the reader actually is, and the offsets clear
 * the FAB with room to spare.
 */

const SIZE = 44;
const STROKE = 2;
const RADIUS = (SIZE - STROKE * 2) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScrollToTop() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      // Cancel any pending rAF so a fast scroll does not queue redundant frames.
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - window.innerHeight;
        const y = window.scrollY;

        setIsVisible(y > Math.max(window.innerHeight, 400));
        setProgress(scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // App surfaces own their own scrolling; a floating overlay has no place there.
  if (pathname?.startsWith("/chat") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          // rAF-throttled scroll updates keep the ring on the compositor.
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.6 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          style={{ width: SIZE, height: SIZE }}
          className="group fixed bottom-28 right-5 z-[100] grid place-items-center rounded-full md:bottom-8 md:right-8"
        >
          {/* Blurred disc so the control sits *in* the page rather than on it. */}
          <span
            className="absolute inset-0 rounded-full backdrop-blur-md"
            style={{
              background: "rgba(16, 19, 23, 0.72)",
              border: "1px solid rgba(54, 183, 176, 0.28)",
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.42), inset 0 1px 0 rgba(240,232,216,0.05)",
            }}
          />
          {/* Hover ring */}
          <span
            className="absolute inset-[-3px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ border: "1px solid rgba(54, 183, 176, 0.45)" }}
          />

          {/* Progress ring */}
          <svg
            className="absolute inset-0 -rotate-90"
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            aria-hidden="true"
          >
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="rgba(54, 183, 176, 0.16)"
              strokeWidth={STROKE}
            />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="#36b7b0"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              style={{ transition: reduceMotion ? "none" : "stroke-dashoffset 120ms linear" }}
            />
          </svg>

          <ChevronUp
            className="relative z-10 h-[18px] w-[18px] transition-transform duration-200 group-hover:-translate-y-0.5"
            style={{ color: "#36b7b0" }}
            aria-hidden="true"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
