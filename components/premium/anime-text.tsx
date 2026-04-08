"use client";

import { motion } from 'framer-motion';
import { memo } from 'react';

interface AnimeTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const AnimeText = memo(function AnimeText({ text, className = "", delay = 0 }: AnimeTextProps) {
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: delay / 1000,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      aria-label={text}
    >
      {words.map((word, index) => (
        <motion.span 
          key={index} 
          className="inline-block mr-3"
          variants={wordVariants}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
});
