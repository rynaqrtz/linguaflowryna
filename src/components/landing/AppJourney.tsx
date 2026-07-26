"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollHint } from "@/components/landing/ScrollHint";

export function AppJourney() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const yContent = useTransform(scrollYProgress, [0, 0.4], [40, 0]);

  return (
    <section aria-label="Study lesson view" ref={ref} className="relative h-[130vh] bg-cream">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6 md:px-10">
        <div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center pb-8 pt-8 md:pb-10 md:pt-12">
          <motion.div
            style={{ opacity, y: yContent }}
            className="w-full"
          >
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-xl dark:bg-yozora-soft/80">
              <div className="border-b border-line/60 bg-cream-deep/30 px-5 py-4 dark:bg-white/5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-ink-soft/50">
                  BAB 3 — KATA KERJA
                </p>
                <h2 className="mt-1 text-lg font-bold text-yozora">
                  Daftar Kosakata
                </h2>
              </div>

              <div className="divide-y divide-line/40 px-5">
                {[
                  { jp: "食べる", reading: "たべる", arti: "Makan" },
                  { jp: "飲む", reading: "のむ", arti: "Minum" },
                  { jp: "話す", reading: "はなす", arti: "Berbicara" },
                  { jp: "聞く", reading: "きく", arti: "Mendengar" },
                  { jp: "見る", reading: "みる", arti: "Melihat" },
                ].map((word, i) => (
                  <div
                    key={word.jp}
                    className="flex items-center gap-4 py-3"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yozora/5 text-xs font-bold text-ink-soft/50">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <span lang="ja" className="jp-bold text-base text-yozora">{word.jp}</span>
                      <span lang="ja" className="jp ml-3 text-sm text-ink-soft">{word.reading}</span>
                    </div>
                    <span className="text-sm text-ink-soft">{word.arti}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-line/60 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink-soft">Progress</span>
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-line">
                    <div className="h-full w-[40%] rounded-full bg-sakura" />
                  </div>
                  <span className="text-xs font-semibold text-sakura">4/10</span>
                </div>
                <span className="rounded-full bg-yozora px-4 py-1.5 text-xs font-semibold text-cream">
                  Mulai Belajar
                </span>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-ink-soft/50">
              Kosakata sehari-hari yang beneran kepakai di dunia kerja — bukan cuma hafalan buat ujian
            </p>
          </motion.div>
          <ScrollHint />
        </div>
      </div>
    </section>
  );
}
