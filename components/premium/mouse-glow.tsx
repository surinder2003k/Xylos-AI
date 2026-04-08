"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function MouseGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 });
  const mouseXSpring = useSpring(mouseX, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[0] overflow-hidden"
      style={{
        background: `radial-gradient(circle 800px at var(--x) var(--y), rgba(139, 92, 246, 0.07), transparent 80%)`,
        "--x": mouseXSpring.get() ? `${mouseXSpring.get()}px` : "50%",
        "--y": (mouseY as any).get() ? `${(mouseY as any).get()}px` : "50%",
      } as any}
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
    </motion.div>
  );
}
