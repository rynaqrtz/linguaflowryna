"use client";

import { motion } from "framer-motion";

interface ToriiGateProps {
  className?: string;
  animated?: boolean;
  strokeColor?: string;
}

export function ToriiGate({ className, animated = false, strokeColor = "var(--color-sakura)" }: ToriiGateProps) {
  const lineTransition = (delay: number) => ({
    pathLength: { duration: 1.1, delay, ease: [0.65, 0, 0.35, 1] as const },
    opacity: { duration: 0.3, delay },
  });

  const draw = animated
    ? { initial: { pathLength: 0, opacity: 0 }, whileInView: { pathLength: 1, opacity: 1 }, viewport: { once: true, amount: 0.5 } }
    : { initial: { pathLength: 1, opacity: 1 } };

  return (
    <svg viewBox="0 0 200 180" className={className} fill="none" aria-hidden="true">
      <motion.path
        d="M10 40 L190 40 L178 52 L22 52 Z"
        stroke={strokeColor}
        strokeWidth={3}
        strokeLinejoin="round"
        {...draw}
        transition={lineTransition(0)}
      />
      <motion.line
        x1={28}
        y1={78}
        x2={172}
        y2={78}
        stroke={strokeColor}
        strokeWidth={3}
        {...draw}
        transition={lineTransition(0.25)}
      />
      <motion.line
        x1={40}
        y1={52}
        x2={34}
        y2={172}
        stroke={strokeColor}
        strokeWidth={3}
        {...draw}
        transition={lineTransition(0.4)}
      />
      <motion.line
        x1={160}
        y1={52}
        x2={166}
        y2={172}
        stroke={strokeColor}
        strokeWidth={3}
        {...draw}
        transition={lineTransition(0.4)}
      />
      <motion.rect
        x={90}
        y={58}
        width={20}
        height={12}
        rx={1.5}
        stroke="var(--color-gold-app)"
        strokeWidth={2}
        {...draw}
        transition={lineTransition(0.6)}
      />
    </svg>
  );
}

export function ToriiMarker({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 180" className={className} fill="none" aria-hidden="true">
      <path d="M10 40 L190 40 L178 52 L22 52 Z" stroke="currentColor" strokeWidth={5} strokeLinejoin="round" />
      <line x1={28} y1={78} x2={172} y2={78} stroke="currentColor" strokeWidth={5} />
      <line x1={40} y1={52} x2={34} y2={172} stroke="currentColor" strokeWidth={5} />
      <line x1={160} y1={52} x2={166} y2={172} stroke="currentColor" strokeWidth={5} />
    </svg>
  );
}
