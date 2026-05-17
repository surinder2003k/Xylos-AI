"use client";

import { ReactNode } from "react";

export function AnimatedHeader({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <div 
      className={`${className} animate-in fade-in duration-700 fill-mode-both`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function AnimatedItem({ children, className = "", y = 20 }: { children: ReactNode; className?: string; y?: number }) {
  return (
    <div 
      className={`${className} animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both`}
    >
      {children}
    </div>
  );
}

export function FadeIn({ children, className = "", delay = 0, scale = 1 }: { children: ReactNode; className?: string; delay?: number; scale?: number }) {
  return (
    <div 
      className={`${className} animate-in fade-in duration-700 fill-mode-both`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
