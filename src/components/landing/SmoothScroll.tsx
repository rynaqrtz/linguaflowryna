"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Smooth-scroll provider (Lenis). Mounted once at the landing root. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Let Lenis manage its own rAF loop (pauses when idle, saves battery)
      autoRaf: true,
    });

    // No manual rAF needed — autoRaf handles it.
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
