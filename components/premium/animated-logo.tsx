"use client";

import { motion } from "framer-motion";
import { XylosLogo } from "./xylos-logo";
import Link from "next/link";

export function AnimatedLogo({ className = "", showText = true }: { className?: string, showText?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-3 group/logo ${className}`}>
      <div className="relative">
        <div className="relative z-10">
          <XylosLogo size={40} animated={true} />
        </div>
        
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
        </motion.div>
      )}
    </Link>
  );
}
