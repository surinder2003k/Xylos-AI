"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";

interface RevealTextProps {
  text?: string;
  textColor?: string;
  overlayColor?: string;
  fontSize?: string;
  className?: string;
  letterDelay?: number;
}

/**
 * RevealText — Performance Optimized
 * 
 * Uses Framer Motion for a premium entrance animation.
 * To protect LCP (Largest Contentful Paint), we ensure the container
 * has a stable height and the text is semi-visible even before hydration
 * if possible (though Framer Motion usually handles this well in Next.js).
 */
export function RevealText({
  text = "STUNNING",
  textColor = "text-foreground",
  fontSize = "text-[4.5rem] md:text-[8rem] lg:text-[10rem]",
  className = "",
}: RevealTextProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const words = text.split(" ");

  // Mobile optimization: animate whole line at once to reduce main-thread work
  if (isMobile) {
    return (
      <m.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`${fontSize} ${textColor} ${className} font-black font-fustat tracking-tight leading-[0.9] text-center`}
      >
        {text}
      </m.div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-[0.3em] md:gap-x-[0.4em] ${className}`}>
      {words.map((word, i) => (
        <m.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.08,
            duration: 0.5,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className={`${fontSize} ${textColor} font-black font-fustat tracking-tight leading-[0.9] select-none will-change-transform`}
        >
          {word}
        </m.span>
      ))}
    </div>
  );
}
