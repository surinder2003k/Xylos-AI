"use client";

import { ReactNode } from "react";
import { TiltCard } from "./tilt-card";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function BentoCard({ children, className = "", delay = 0 }: BentoCardProps) {
  return (
    <div className={`relative overflow-hidden bg-card border border-border/80 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-foreground/35 transition-all duration-500 rounded-none flex flex-col ${className}`}>
      
      {/* Clean high-contrast tag in the corner */}
      <div className="absolute top-4 right-4 text-[8px] font-mono font-bold tracking-[0.2em] text-foreground/35 uppercase">
        // {delay ? `M_0${Math.floor(delay * 10)}` : "M_01"}
      </div>

      <div className="relative z-10 h-full p-8 md:p-10 flex flex-col flex-1">
        {children}
      </div>
    </div>
  );
}

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = "" }: BentoGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full ${className}`}>
      {children}
    </div>
  );
}
