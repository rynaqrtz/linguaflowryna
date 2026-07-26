import type { Variants, Transition } from "framer-motion";

/** Premium easings — Apple/Vercel feel. */
export const easeOut = [0.16, 1, 0.3, 1] as const; // expo-out
export const easeInOut = [0.65, 0, 0.35, 1] as const; // cinematic
export const easeBack = [0.34, 1.56, 0.64, 1] as const; // soft overshoot

export const slowInOut: Transition = { duration: 1.1, ease: easeInOut };
export const medInOut: Transition = { duration: 0.8, ease: easeOut };

/** Line of text that reveals upward (Story section). */
export const lineReveal: Variants = {
  hidden: { y: "110%" },
  show: (i: number = 0) => ({
    y: "0%",
    transition: { duration: 0.9, ease: easeOut, delay: i * 0.08 },
  }),
};

/** Mask-reveal wrapper for big headlines. */
export const maskUp: Variants = {
  hidden: { y: "100%" },
  show: { y: "0%", transition: { duration: 1, ease: easeOut } },
};

/** Fade + slight rise for blocks. */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: medInOut },
};

/** Generic viewport config so sections animate once on enter. */
export const viewportOnce = { once: true, amount: 0.35 } as const;
