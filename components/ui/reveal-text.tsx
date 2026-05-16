"use client";

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
  text = "XYLOS AI",
  textColor = "text-foreground",
  fontSize = "text-[4.5rem] md:text-[8rem] lg:text-[10rem]",
  className = "",
}: RevealTextProps) {
  const words = text.split(" ");

  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-[0.3em] md:gap-x-[0.4em] ${className}`}>
      {words.map((word, i) => (
        <m.span
          key={i}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.05,
            duration: 0.4,
            ease: "easeOut",
          }}
          className={`${fontSize} ${textColor} font-black font-fustat tracking-tight leading-[0.9] select-none will-change-transform`}
        >
          {word}
        </m.span>
      ))}
    </div>
  );
}
