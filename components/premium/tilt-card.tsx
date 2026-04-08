"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  degree?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({ 
  children, 
  className = "", 
  degree = 15 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${degree}deg`, `-${degree}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${degree}deg`, `${degree}deg`]);

  // Glare effect values
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useTransform(mouseXSpring, (v) => Math.abs(v) * 0.4);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      className={`relative rounded-[2rem] transition-colors duration-500 overflow-hidden ${className} will-change-transform`}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>

      {/* High-Fidelity Glare Effect */}
      <motion.div
        style={{
          background: `radial-gradient(circle at var(--glare-x) var(--glare-y), rgba(255,255,255,0.15) 0%, transparent 80%)`,
          opacity: isHovered ? 1 : 0,
          "--glare-x": glareX as any,
          "--glare-y": glareY as any,
        } as any}
        className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
      />
    </motion.div>
  );
};
