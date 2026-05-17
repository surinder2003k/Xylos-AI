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
    <TiltCard degree={3} className={`relative overflow-hidden bg-card/20 border border-border/30 backdrop-blur-xl group/card shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(139,92,246,0.05)] hover:border-primary/45 transition-all duration-500 rounded-[2rem] ${className}`}>
      {/* Corner Bracket Tech Accents */}
      <span className="absolute top-4 left-4 w-2.5 h-2.5 border-t border-l border-primary/20 group-hover/card:border-primary/60 transition-all duration-300" />
      <span className="absolute top-4 right-4 w-2.5 h-2.5 border-t border-r border-primary/20 group-hover/card:border-primary/60 transition-all duration-300" />
      <span className="absolute bottom-4 left-4 w-2.5 h-2.5 border-b border-l border-primary/20 group-hover/card:border-primary/60 transition-all duration-300" />
      <span className="absolute bottom-4 right-4 w-2.5 h-2.5 border-b border-r border-primary/20 group-hover/card:border-primary/60 transition-all duration-300" />
      
      {/* Tech Grid Background Lines - updated to subtle white for dark theme */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] opacity-60 pointer-events-none" />

      {/* Cyber ambient dot */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/5 border border-primary/10 text-[7px] font-black uppercase tracking-widest text-primary/70">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        SYS_NODE_{delay ? `0${Math.floor(delay * 10)}` : "01"}
      </div>

      <div className="relative z-10 h-full p-6 md:p-8 flex flex-col">
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
