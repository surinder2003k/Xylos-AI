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

    const fadeTimer = setTimeout(() => setIsFading(true), 350);
    const unmountTimer = setTimeout(() => setIsMounted(false), 750);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[1000] bg-background flex flex-col items-center justify-center transition-opacity duration-400 ease-out ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex items-center justify-center">
        <XylosLogo size={64} animated={false} className="text-[#00f0ff]" />
      </div>
    </div>
  );
}
