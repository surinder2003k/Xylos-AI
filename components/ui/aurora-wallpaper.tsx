"use client";

import { useEffect, useRef } from "react";

// Live aurora wallpaper — flowing gradient mesh, GPU-friendly canvas.
// Luxury-minimal: very low opacity cyan/violet/teal drift over dark base.
// Desktop + reduced-motion aware. Sits behind hero content (z-0), never blocks input.

export function AuroraWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect reduced motion: render a single static frame
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let rafId = 0;
    let w = 0, h = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Aurora blobs — soft radial gradients drifting on sine paths
    const blobs = [
      { x: 0.22, y: 0.30, r: 340, color: "0, 240, 255",   a: 0.055, sx: 0.00013, sy: 0.00009, px: 0,     py: 1.7 },
      { x: 0.75, y: 0.22, r: 300, color: "157, 140, 255", a: 0.045, sx: 0.00010, sy: 0.00014, px: 2.1,   py: 4.2 },
      { x: 0.55, y: 0.70, r: 380, color: "45, 212, 191",  a: 0.035, sx: 0.00008, sy: 0.00011, px: 4.6,   py: 0.8 },
      { x: 0.12, y: 0.80, r: 260, color: "0, 240, 255",   a: 0.040, sx: 0.00016, sy: 0.00007, px: 1.3,   py: 3.1 },
    ];

    let start = performance.now();

    const draw = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, w, h);

      for (const b of blobs) {
        const bx = (b.x + Math.sin(t * b.sx * 2 * Math.PI + b.px) * 0.06) * w;
        const by = (b.y + Math.cos(t * b.sy * 2 * Math.PI + b.py) * 0.05) * h;
        const br = b.r * (1 + Math.sin(t * 0.0002 + b.px) * 0.08);

        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        grad.addColorStop(0, `rgba(${b.color}, ${b.a})`);
        grad.addColorStop(1, `rgba(${b.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(bx - br, by - br, br * 2, br * 2);
      }

      if (!reduced) rafId = requestAnimationFrame(draw);
    };

    if (reduced) {
      draw(start); // single static frame
    } else {
      rafId = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}