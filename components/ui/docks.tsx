"use client";

import { Sun, Moon, Settings } from 'lucide-react';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeDock = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div
      className="
        inline-flex rounded-xl overflow-hidden relative
        bg-white/5 dark:bg-black/40
        backdrop-blur-xl
        shadow-lg shadow-black/5 dark:shadow-black/20
        border border-black/10 dark:border-white/5
        transition-colors duration-500
      "
    >
      <button
        onClick={() => setTheme('light')}
        className={`
          px-4 py-2 rounded-l-xl
          flex items-center gap-2
          text-xs font-black uppercase tracking-widest
          transition-colors duration-300
          focus:outline-none focus:ring-0
          border-r border-black/10 dark:border-white/5
          group
          ${theme === 'light' ? 'bg-black/10 text-black dark:text-white' : 'bg-transparent text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5'}
        `}
        aria-label="Toggle Light Mode"
      >
        <Sun
          className="
            w-4 h-4
            text-current
            transition-transform duration-300
            group-hover:scale-110
          "
          aria-hidden="true"
        />
        <span className="select-none hidden sm:inline-block">Light</span>
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`
          px-4 py-2
          flex items-center gap-2
          text-xs font-black uppercase tracking-widest
          transition-colors duration-300
          focus:outline-none focus:ring-0
          border-r border-black/10 dark:border-white/5
          group
          ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-transparent text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5'}
        `}
        aria-label="Toggle Dark Mode"
      >
        <Moon
          className="
            w-4 h-4
            text-current
            transition-transform duration-300
            group-hover:scale-110
          "
          aria-hidden="true"
        />
        <span className="select-none hidden sm:inline-block">Dark</span>
      </button>

      <button
        className="
          px-4 py-2 rounded-r-xl
          flex items-center gap-2
          text-xs font-black uppercase tracking-widest text-muted-foreground
          bg-transparent
          hover:bg-black/5 dark:hover:bg-white/5
          transition-colors duration-300
          focus:outline-none focus:ring-0
          group
        "
        aria-label="Open Settings"
      >
        <Settings
          className="
            w-4 h-4
            text-current
            transition-transform duration-300
            group-hover:scale-110 group-hover:rotate-90
          "
          aria-hidden="true"
        />
        <span className="select-none hidden sm:inline-block">Settings</span>
      </button>
    </div>
  );
};
