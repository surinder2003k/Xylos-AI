"use client";

import { XylosLogo } from "./xylos-logo";
import Link from "next/link";

export function AnimatedLogo({ className = "", showText = true }: { className?: string, showText?: boolean }) {
  return (
    <Link href="/" aria-label="Xylos AI Home" className={`flex items-center gap-3 group/logo ${className}`}>
      <div className="relative">
        <div className="relative z-10">
          <XylosLogo size={40} animated={true} />
        </div>
        {/* CSS-only static glow — no JS/framer involved */}
        <div className="absolute inset-0 bg-violet-500/15 blur-xl -z-10 rounded-full" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-fustat font-black text-2xl tracking-tighter uppercase leading-none">
            Xylos<span className="text-violet-500 italic">AI</span>
          </span>
        </div>
      )}
    </Link>
  );
}
