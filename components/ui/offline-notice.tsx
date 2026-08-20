"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";
import { XylosLogo } from "@/components/premium/xylos-logo";

/**
 * Shows a branded "You're offline" overlay when the connection drops mid-session.
 * Children stay mounted underneath, so no state/scroll is lost, and the overlay
 * auto-dismisses the moment connectivity returns (online event).
 */
export function OfflineNotice() {
  const [mounted, setMounted] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setMounted(true);
    setOnline(navigator.onLine);

    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Only render after mount to avoid SSR/hydration mismatch.
  const show = mounted && !online;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-6"
          style={{
            background: "rgba(10, 11, 14, 0.96)",
            backdropFilter: "blur(10px)",
          }}
          role="alertdialog"
          aria-label="You are offline"
        >
          <div className="text-center max-w-md w-full">
            <div className="mb-8 flex justify-center">
              <XylosLogo size={56} className="text-[#00f0ff]" />
            </div>
            <div
              className="glass-card rounded-3xl p-10 md:p-12"
              style={{ background: "rgba(18, 20, 26, 0.7)" }}
            >
              <div
                className="mx-auto mb-6 w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(0, 240, 255, 0.08)",
                  border: "1px solid rgba(0, 240, 255, 0.2)",
                }}
              >
                <WifiOff className="w-7 h-7 text-[#00f0ff]" />
              </div>
              <h1
                className="text-2xl md:text-3xl font-bold tracking-[-0.02em] text-white mb-3"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                You&apos;re offline
              </h1>
              <p
                className="text-[15px] leading-relaxed"
                style={{ color: "#849495" }}
              >
                Your connection dropped. Don&apos;t worry — your work is safe.
                Xylos will reconnect automatically the moment you&apos;re back online.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[#04141a] transition-colors hover:bg-[#33f3ff]"
                style={{ background: "#00f0ff" }}
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
