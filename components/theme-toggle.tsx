"use client";

import * as React from "react";
import { Moon, Sun, Sparkles, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { usePrimaryColor } from "./primary-color-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { primaryColor, setPrimaryColor } = usePrimaryColor();
  const [mounted, setMounted] = React.useState(false);
  const colorInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="relative w-14 h-14 rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group overflow-hidden shadow-inner"
        aria-label="Toggle Theme"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <AnimatePresence mode="wait">
          {theme === "dark" ? (
            <motion.div
              key="sun"
              initial={{ y: 20, opacity: 0, rotate: -45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -20, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.3, ease: "backOut" }}
            >
              <Sun className="w-6 h-6 text-primary drop-shadow-neon" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ y: 20, opacity: 0, rotate: -45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -20, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.3, ease: "backOut" }}
            >
              <Moon className="w-6 h-6 text-secondary drop-shadow-neon" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute -bottom-1 -right-1 opacity-20 group-hover:opacity-100 transition-opacity">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </button>

      {/* Primary Color Picker Button */}
      <button
        onClick={() => colorInputRef.current?.click()}
        className="relative w-14 h-14 rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group overflow-hidden shadow-inner"
        aria-label="Change Primary Color"
      >
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Palette className="w-5 h-5 text-primary drop-shadow-neon" />
        
        <input 
          type="color"
          ref={colorInputRef}
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer pointer-events-none"
        />

        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />
        </div>
      </button>
    </div>
  );
}
