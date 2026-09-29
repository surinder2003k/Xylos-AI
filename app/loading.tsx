/**
 * Root fallback loading state.
 *
 * This is what renders for any route that has no closer loading.tsx. It used to
 * take over the whole viewport with a centred spinner, which meant a client-side
 * route change wiped the page and re-rendered it around a spinner. Keeping it
 * compact and top-anchored lets the outgoing page stay readable underneath
 * while the next route resolves.
 */
export default function RootLoading() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-5 px-6">
      <div
        className="relative h-9 w-9"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span className="sr-only">Loading…</span>
        {/* Static track + rotating arc: a determinate-looking ring rather than a
            plain border spinner, so it does not read as a hard stall. */}
        <span
          className="absolute inset-0 rounded-full"
          style={{ border: "2px solid rgba(54, 183, 176, 0.15)" }}
        />
        <span
          className="absolute inset-0 animate-spin rounded-full"
          style={{
            border: "2px solid transparent",
            borderTopColor: "#36b7b0",
            borderRightColor: "rgba(54, 183, 176, 0.35)",
            animationDuration: "900ms",
            animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
      <p
        className="text-[9px] font-semibold uppercase tracking-[0.42em] text-[#5f6b6d]"
        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
      >
        Xylos AI
      </p>
    </div>
  );
}
