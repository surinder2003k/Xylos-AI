"use client";

import { useEffect, useRef } from "react";
import { touchLastSeen } from "@/app/actions/settings";

/**
 * PresenceHeartbeat — invisible component that keeps profiles.last_seen_at
 * fresh while the signed-in user has the dashboard open. The admin user
 * directory turns this into "Online" / "Last seen Xm ago".
 *
 * Cadence: immediate beat on mount, then every 60s, plus an extra beat when
 * the tab becomes visible again (after >=45s since the last one). Skipped
 * entirely when the document is hidden so background tabs don't write.
 */
export function PresenceHeartbeat() {
  const lastBeatRef = useRef(0);

  useEffect(() => {
    const beat = async (force = false) => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden" && !force) return;
      const now = Date.now();
      if (!force && now - lastBeatRef.current < 45_000) return;
      lastBeatRef.current = now;
      try {
        await touchLastSeen();
      } catch {
        // Heartbeat failures are non-fatal by design.
      }
    };

    beat(true);
    const interval = setInterval(() => beat(), 60_000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") beat(true);
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
}
