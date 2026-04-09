"use client";

import { useEffect } from "react";

export function GlobalEffects() {
  useEffect(() => {
    // 1. Robust Context Menu Disabler
    // Using capture: true to ensure we catch the event before other handlers
    const preventDefault = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    window.addEventListener("contextmenu", preventDefault, true);

    // 2. Prevent F12 and typical Inspect shortcuts (Optional but requested for "immersive" feel)
    const preventShortcuts = (e: KeyboardEvent) => {
      if (
        e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) || 
        (e.ctrlKey && e.key === "U")
      ) {
        // e.preventDefault(); // Uncomment if you want to be extra strict
      }
    };
    window.addEventListener("keydown", preventShortcuts, true);

    return () => {
      window.removeEventListener("contextmenu", preventDefault, true);
      window.removeEventListener("keydown", preventShortcuts, true);
    };
  }, []);

  return null;
}
