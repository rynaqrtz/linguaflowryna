"use client";

import { useEffect, useState, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

/**
 * Scene 8 — EXIT TRANSITION
 * Camera zooms out of the app back to cream void.
 * 1.5s of silence. Then the story begins.
 */
export function ExitTransition() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0.3, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100vh] bg-cream">
      <motion.div
        style={{ scale, opacity }}
        className="sticky top-0 flex h-screen items-center justify-center"
      >
        {/* The app shrinking away */}
        <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
          <div className="overflow-hidden rounded-2xl border border-line/60 bg-white/80 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-line/40 px-5 py-3">
              <div className="h-6 w-6 rounded-full bg-yozora/30" />
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-full bg-sakura/30" />
                <div className="h-2 w-2 rounded-full bg-gold/30" />
                <div className="h-2 w-2 rounded-full bg-success/30" />
              </div>
            </div>
            <div className="h-48 md:h-64" />
          </div>
        </div>

        {/* fade-out overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cream via-transparent to-cream" />
      </motion.div>
    </section>
  );
}
