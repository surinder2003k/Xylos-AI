"use client";

import { ReactNode } from "react";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function BentoCard({ children, className = "" }: BentoCardProps) {
  return (
    <div className={`relative overflow-hidden bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 rounded-2xl flex flex-col ${className}`}>
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
