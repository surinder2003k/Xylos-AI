"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { XylosLogo } from "@/components/premium/xylos-logo";

let hasPlayedThisSession = false;

export function SplashLoader() {
  // SSR: hasPlayedThisSession is false -> isVisible = true
  // CSR (Navigation): hasPlayedThisSession is true -> isVisible = false
  const [isVisible, setIsVisible] = useState(!hasPlayedThisSession);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only play once per JS context lifecycle (resets on F5, survives internal links)
    if (hasPlayedThisSession) {
      return;
    }
    
    hasPlayedThisSession = true;

    const timer = setTimeout(() => setIsVisible(false), 400);
    
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + (100 / 8) : 100));
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
