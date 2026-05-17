"use client";

import { useEffect, useState } from "react";
import { XylosLogo } from "@/components/premium/xylos-logo";

let hasPlayedThisSession = false;

export function SplashLoader() {
  const [isMounted, setIsMounted] = useState(!hasPlayedThisSession);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (hasPlayedThisSession) {
      setIsMounted(false);
      return;
    }
    hasPlayedThisSession = true;

    // Start fading out
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 450);

    // Unmount from DOM completely
    const unmountTimer = setTimeout(() => {
      setIsMounted(false);
    }, 1100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[1000] bg-background flex flex-col items-center justify-center pointer-events-none transition-all duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isFading ? "opacity-0 scale-110 blur-[20px]" : "opacity-100 scale-100"
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-violet-600/20 blur-[100px] -z-10 rounded-full animate-pulse" />

        {/* Logo Animation */}
        <div className="flex items-center justify-center relative my-4 animate-in fade-in zoom-in-75 duration-[700ms] ease-out">
          <XylosLogo size={140} animated={true} />
        </div>
      </div>
    </div>
  );
}
