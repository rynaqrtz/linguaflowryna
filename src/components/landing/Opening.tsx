"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Opening — a cinematic intro before the hero.
 * Cream void → single kanji fades in → thin line grows → dissolves.
 * - Skipped entirely when the user prefers reduced motion.
 * - Saves a sessionStorage flag so returning visitors skip it.
 * - Traps focus and uses aria-modal for a11y.
 */
export function Opening({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"kanji" | "line" | "out">("kanji");
  const [reduced, setReduced] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Auto-focus the overlay so keyboard users don't tab behind it
  useEffect(() => {
    // Small delay so the DOM is ready
    const id = setTimeout(() => overlayRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    // 1. Skip if user prefers reduced motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      onDone();
      return;
    }

    // 2. Skip for returning visitors (same session)
    try {
      if (sessionStorage.getItem("lf-opening-seen") === "1") {
        setReduced(true);
        onDone();
        return;
      }
    } catch { /* sessionStorage may be blocked */ }

    // 3. Play the cinematic sequence
    const t1 = setTimeout(() => setPhase("line"), 700);
    const t2 = setTimeout(() => setPhase("out"), 1500);
    const t3 = setTimeout(() => {
      try { sessionStorage.setItem("lf-opening-seen", "1"); } catch { /* noop */ }
      onDone();
    }, 1850);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-cream"
        role="dialog"
        aria-modal="true"
        aria-label="Opening animation — tekan Escape untuk lewati"
        tabIndex={-1}
        initial={{ opacity: 1 }}
        animate={phase === "out" ? { opacity: 0 } : { opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            try { sessionStorage.setItem("lf-opening-seen", "1"); } catch { /* noop */ }
            onDone();
          }
        }}
      >
        <div className="flex flex-col items-center">
          <motion.span
            lang="ja"
            className="jp-bold text-7xl text-yozora md:text-9xl"
            initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
            animate={
              phase === "kanji"
                ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                : { opacity: 0.18, scale: 1.04, filter: "blur(0px)" }
            }
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            日本語
          </motion.span>
          <div className="mt-6 h-px w-0 overflow-hidden bg-yozora/40">
            <motion.div
              className="h-px bg-yozora"
              initial={{ width: 0 }}
              animate={phase === "line" ? { width: 160 } : { width: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <motion.p
            className="mt-5 text-xs uppercase tracking-[0.4em] text-ink-soft"
            initial={{ opacity: 0 }}
            animate={phase === "line" ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            LinguaFlow
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
