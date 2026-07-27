"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ScrollHint } from "@/components/landing/ScrollHint";

export function FlashcardScene() {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const rotateYVal = useTransform(scrollYProgress, [0.1, 0.5], [0, 180]);
  const opContentVal = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const progressVal = useTransform(scrollYProgress, [0.35, 0.75], [32, 50]);
  const noParallax = prefersReduced;
  const rotateY = noParallax ? 180 : rotateYVal;
  const opContent = noParallax ? 1 : opContentVal;
  const progress = noParallax ? 50 : progressVal;

  return (
    <section aria-label="Flashcard demo" ref={ref} className="relative h-[130vh] bg-cream">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6 md:px-10">
        <div className="flex w-full max-w-xl flex-1 flex-col items-center justify-center pb-8 text-center md:pb-10">
          <motion.p
            className="mb-10 text-xs font-semibold uppercase tracking-[0.4em] text-sakura"
            style={{ opacity: opContent }}
          >
            Flashcard
          </motion.p>

          <div className="perspective-[800px] mx-auto w-full" style={{ perspective: 800 }}>
            <motion.div
              className="relative mx-auto h-[340px] w-full max-w-sm cursor-default"
              style={{ transformStyle: "preserve-3d", rotateY }}
            >
              <div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-line bg-white p-8 shadow-xl backface-hidden dark:bg-yozora-soft/80"
                style={{ backfaceVisibility: "hidden" }}
              >
                <span lang="ja" className="jp-bold text-6xl text-yozora md:text-7xl">食べる</span>
                <span lang="ja" className="jp mt-4 text-xl text-ink-soft">たべる</span>
                <span className="mt-2 text-sm text-ink-soft">taberu</span>
                <span className="mt-8 text-xs uppercase tracking-[0.2em] text-ink-soft/60">Scroll to reveal</span>
              </div>

              <div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-line bg-yozora p-8 shadow-xl backface-hidden"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold">Arti</p>
                <p className="text-3xl font-bold text-cream">Makan</p>
                <p lang="ja" className="jp mt-6 text-sm text-cream/60">毎日ご飯を食べる</p>
                <p className="mt-1 text-xs text-cream/40">Setiap hari makan nasi</p>

                <motion.div className="mt-8 w-full">
                  <div className="flex justify-between text-xs text-cream/60">
                    <span>Progress</span>
                    <span className="flex items-center gap-0.5">
                      <motion.span>{progress}</motion.span>%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gold"
                      style={{ width: progress }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <motion.p
            className="mt-8 text-sm text-ink-soft"
            style={{ opacity: opContent }}
          >
            Dari N5 sampai N3 — satu kartu setiap hari.
          </motion.p>
          <ScrollHint />
        </div>
      </div>
    </section>
  );
}
