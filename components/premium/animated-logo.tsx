"use client";

import { motion } from "framer-motion";
import { Diamond } from "lucide-react";
import Link from "next/link";

export function AnimatedLogo({ className = "", showText = true }: { className?: string, showText?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-3 group/logo ${className}`}>
      <div className="relative">
        <motion.div
          animate={{ 
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.05, 1] 
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-800 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover/logo:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-500"
        >
          <svg viewBox="0 0 512 512" fill="none" className="w-6 h-6 text-white overflow-visible">
            <motion.path
              d="M166,166 L236,256 L166,346"
              stroke="currentColor"
              strokeWidth="45"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              d="M346,166 L276,256 L346,346"
              stroke="currentColor"
              strokeWidth="45"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="256" cy="256" r="24" fill="currentColor" />
          </svg>
        </motion.div>
        
        {/* Particle/Glow Effect */}
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-violet-500/20 blur-2xl -z-10 rounded-full"
        />
      </div>

      {showText && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <span className="font-fustat font-black text-2xl tracking-tighter uppercase leading-none">
            Xylos<span className="text-violet-500 italic">AI</span>
          </span>
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 leading-none mt-1 group-hover/logo:text-violet-400 transition-colors">
            Professional Editorial Suite
          </span>
        </motion.div>
      )}
    </Link>
  );
}
