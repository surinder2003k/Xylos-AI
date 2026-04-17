"use client";

import { motion } from "framer-motion";

interface RevealTextProps {
  text?: string;
  textColor?: string;
  overlayColor?: string;
  fontSize?: string;
  className?: string;
  letterDelay?: number;
}

export function RevealText({
  text = "STUNNING",
  textColor = "text-foreground",
  overlayColor = "text-primary",
  fontSize = "text-[4.5rem] md:text-[8rem] lg:text-[10rem]",
  className = "",
}: RevealTextProps) {
  const words = text.split(" ");

  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-[0.3em] md:gap-x-[0.4em] ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.12,
            duration: 0.6,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className={`${fontSize} ${textColor} font-black font-fustat tracking-tight leading-[0.9] select-none`}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
