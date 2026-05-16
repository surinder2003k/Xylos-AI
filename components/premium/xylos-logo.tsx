"use client";

import { m } from "framer-motion";

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
        pathLength: { delay: i * 0.15, duration: 0.8, ease: "easeInOut" },
        opacity: { delay: i * 0.15, duration: 0.2 },
      },
    }),
  };

  return (
    <m.svg
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
      <g transform="translate(256,256)">




        {/* Left arm of X */}
        <m.path
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
        <m.path
          d="M90,-90 L20,0 L90,90"
          stroke="var(--logo-color, #8B5CF6)"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          variants={animated ? draw : undefined}
          custom={1}
        />

        {/* Center node — static, no pulse */}
        <circle
          cx="0" cy="0" r="16"
          fill="var(--logo-color, #8B5CF6)"
          opacity="0.9"
        />

        {/* Corner neural dots */}
        {[
          [-90, -90],
          [90, -90],
          [-90, 90],
          [90, 90],
        ].map(([cx, cy], i) => (
          <m.circle
            key={i}
            cx={cx}
            cy={cy}
            r="8"
            fill="var(--logo-color, #8B5CF6)"
            initial={animated ? { opacity: 0, scale: 0 } : { opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.4, ease: "backOut" }}
          />
        ))}
      </g>
    </m.svg>
  );
}
