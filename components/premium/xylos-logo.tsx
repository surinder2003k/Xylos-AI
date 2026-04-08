"use client";

import { motion } from "framer-motion";

interface XylosLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function XylosLogo({ size = 40, className = "", animated = true }: XylosLogoProps) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.2, duration: 1.2, ease: "easeInOut" },
        opacity: { delay: i * 0.2, duration: 0.3 },
      },
    }),
  };

  const pulse = {
    scale: [1, 1.15, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const rotate = {
    rotate: [0, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    },
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      width={size}
      height={size}
      className={className}
      initial={animated ? "hidden" : "visible"}
      animate="visible"
      style={{ overflow: "visible" }}
    >
      {/* Background */}
      <rect width="512" height="512" rx="128" fill="currentColor" className="text-black dark:text-black" opacity="0" />

      <g transform="translate(256,256)">
        {/* Rotating outer ring */}
        <motion.circle
          cx="0" cy="0" r="180"
          stroke="var(--logo-color, #8B5CF6)"
          strokeWidth="6"
          fill="none"
          opacity="0.15"
          animate={animated ? rotate : undefined}
          strokeDasharray="20 15"
        />

        {/* Static guide ring */}
        <motion.circle
          cx="0" cy="0" r="150"
          stroke="var(--logo-color, #8B5CF6)"
          strokeWidth="2"
          fill="none"
          opacity="0.08"
        />

        {/* Left arm of X */}
        <motion.path
          d="M-90,-90 L-20,0 L-90,90"
          stroke="var(--logo-color, #8B5CF6)"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          variants={animated ? draw : undefined}
          custom={0}
        />

        {/* Right arm of X */}
        <motion.path
          d="M90,-90 L20,0 L90,90"
          stroke="var(--logo-color, #8B5CF6)"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          variants={animated ? draw : undefined}
          custom={1}
        />

        {/* Center node — pulsing */}
        <motion.circle
          cx="0" cy="0" r="16"
          fill="var(--logo-color, #8B5CF6)"
          animate={animated ? pulse : undefined}
        />

        {/* Corner neural dots — staggered fade-in */}
        {[
          [-90, -90],
          [90, -90],
          [-90, 90],
          [90, 90],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r="8"
            fill="var(--logo-color, #8B5CF6)"
            initial={animated ? { opacity: 0, scale: 0 } : { opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.15, duration: 0.5, ease: "backOut" }}
          />
        ))}

        {/* Connecting neural lines from center to corners */}
        {[
          "M0,0 L-90,-90",
          "M0,0 L90,-90",
          "M0,0 L-90,90",
          "M0,0 L90,90",
        ].map((d, i) => (
          <motion.path
            key={`line-${i}`}
            d={d}
            stroke="var(--logo-color, #8B5CF6)"
            strokeWidth="2"
            fill="none"
            opacity="0.1"
            variants={animated ? draw : undefined}
            custom={i * 0.3}
          />
        ))}
      </g>
    </motion.svg>
  );
}
