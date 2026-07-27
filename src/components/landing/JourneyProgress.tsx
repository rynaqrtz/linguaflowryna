"use client";

import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";

export function JourneyProgress() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });
  const progress = prefersReduced ? scrollYProgress : smooth;
  const pathLength = useTransform(progress, [0, 1], [0, 1]);
  const fillOpacity = useTransform(progress, [0, 0.05], [0, 1]);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-40 hidden h-14 w-14 md:block" aria-hidden="true">
      <svg viewBox="0 0 200 180" className="h-full w-full drop-shadow-md" fill="none">
        <path
          d="M10 40 L190 40 L178 52 L22 52 Z"
          stroke="var(--color-line)"
          strokeWidth={10}
          strokeLinejoin="round"
        />
        <line x1={28} y1={78} x2={172} y2={78} stroke="var(--color-line)" strokeWidth={10} />
        <line x1={40} y1={52} x2={34} y2={172} stroke="var(--color-line)" strokeWidth={10} />
        <line x1={160} y1={52} x2={166} y2={172} stroke="var(--color-line)" strokeWidth={10} />

        <motion.g style={{ opacity: fillOpacity }}>
          <motion.path
            d="M10 40 L190 40 L178 52 L22 52 Z"
            stroke="var(--color-sakura)"
            strokeWidth={10}
            strokeLinejoin="round"
            style={{ pathLength }}
          />
          <motion.line x1={28} y1={78} x2={172} y2={78} stroke="var(--color-sakura)" strokeWidth={10} style={{ pathLength }} />
          <motion.line x1={40} y1={52} x2={34} y2={172} stroke="var(--color-sakura)" strokeWidth={10} style={{ pathLength }} />
          <motion.line x1={160} y1={52} x2={166} y2={172} stroke="var(--color-sakura)" strokeWidth={10} style={{ pathLength }} />
        </motion.g>
      </svg>
    </div>
  );
}
