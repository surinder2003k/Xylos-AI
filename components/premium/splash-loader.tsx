"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { XylosLogo } from "@/components/premium/xylos-logo";

export function SplashLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2400);
    
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + (100 / 24) : 100));
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="fixed inset-0 z-[1000] bg-background flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="relative flex flex-col items-center">
            {/* Background Glow */}
            <motion.div 
               animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute inset-0 bg-violet-600/20 blur-[100px] -z-10 rounded-full"
            />

            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "backOut" }}
              className="flex items-center justify-center relative my-4"
            >
              <XylosLogo size={140} animated={true} />
            </motion.div>

            {/* Text Animations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <h1 className="text-4xl font-black font-fustat tracking-tighter uppercase leading-none">
                Xylos <span className="text-violet-500 italic">AI</span>
              </h1>
              <div className="flex items-center justify-center gap-2 mt-4 text-violet-400">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-80">
                  Editorial Intelligence Suite
                </span>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-48 h-[2px] bg-white/5 rounded-full mt-10 overflow-hidden relative border border-white/5">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-[0_0_10px_rgba(139,92,246,0.8)]"
              />
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.2 }}
              className="mt-4 font-mono text-[8px] uppercase tracking-widest text-muted-foreground"
            >
              Initializing Synaptic Pathways... {Math.round(progress)}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
