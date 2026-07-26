"use client";

import { motion } from "framer-motion";

/**
 * Scroll-down indicator placed BELOW scene content.
 * Uses margin-top for distance from content above.
 */
export function ScrollHint() {
  return (
    <motion.div
      className="mt-20 flex flex-col items-center gap-1 md:mt-24"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-ink-soft/30">
        Lanjut
      </span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-bounce text-ink-soft/20"
        aria-hidden="true"
      >
        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
      </svg>
    </motion.div>
  );
}
