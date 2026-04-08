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
    <TiltCard degree={10} className={`bg-card/40 border border-border/50 backdrop-blur-xl ${className}`}>
      <div className="relative z-10 h-full p-8 flex flex-col">
        {children}
      </div>
    </TiltCard>
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
