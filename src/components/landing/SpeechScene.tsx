"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollHint } from "@/components/landing/ScrollHint";

const bars = [1, 2, 3, 4, 5, 6, 7];

export function SpeechScene() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const opContent = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const yContent = useTransform(scrollYProgress, [0, 0.4], [30, 0]);
  const scoreReveal = useTransform(scrollYProgress, [0.45, 0.7], [0, 1]);

  return (
    <section aria-label="Speech recognition demo" ref={ref} className="relative h-[140vh] bg-yozora">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <span className="lf-kanji text-[28vw] right-[-8%] top-[-10%] text-white/5">
          話
        </span>

        <div className="flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-8 md:px-10 md:pb-10">
          <motion.div
            style={{ y: yContent, opacity: opContent }}
            className="w-full text-center"
          >
            <p className="mb-10 text-xs font-semibold uppercase tracking-[0.4em] text-gold">
              Latihan Ucapan
            </p>

            <div className="mb-14">
              <p lang="ja" className="jp-bold text-5xl text-cream md:text-7xl">
                おはようございます
              </p>
              <p className="mt-3 text-lg text-cream/50">Ohayou gozaimasu</p>
            </div>

            <div className="mx-auto flex h-24 items-center justify-center gap-1.5" aria-hidden="true">
              {bars.map((_, i) => (
                <div
                  key={i}
                  className="lf-waveform-bar h-16 w-2 rounded-full bg-gold/70"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>

            <motion.div
              style={{ opacity: scoreReveal, scale: scoreReveal }}
              className="mt-10"
            >
              <div className="inline-flex items-center gap-4 rounded-2xl bg-white/10 px-8 py-4 backdrop-blur-sm">
                <span className="text-5xl font-bold text-gold">92</span>
                <span className="text-2xl font-bold text-cream/80">/ 100</span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { label: "Kejelasan", val: 95 },
                  { label: "Intonasi", val: 88 },
                  { label: "Kelancaran", val: 92 },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-white/5 p-3">
                    <p className="text-xs text-cream/50">{s.label}</p>
                    <p className="text-xl font-bold text-cream">{s.val}%</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
          <ScrollHint />
        </div>
      </div>
    </section>
  );
}
