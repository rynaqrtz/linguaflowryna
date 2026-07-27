"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { viewportOnce, easeOut } from "@/lib/motion";
import { ScrollHint } from "@/components/landing/ScrollHint";

function Dashboard({ compact }: { compact?: boolean }) {
  const pad = compact ? "px-3 pt-5 pb-4 sm:px-4 sm:pt-6 sm:pb-5" : "px-4 pt-8 pb-5 sm:px-6 sm:pt-10 sm:pb-6";
  const gap = compact ? "gap-2 sm:gap-3" : "gap-4 sm:gap-6";
  return (
    <div className={pad}>
      <div className={"flex " + gap}>
        <div className="hidden w-32 shrink-0 space-y-2 sm:block">
          {["Belajar", "Kuis", "Kamus", "Sensei"].map((item) => (
            <div
              key={item}
              className="rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white/70"
            >
              {item}
            </div>
          ))}
        </div>
        <div className="flex-1 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gold/60 sm:h-8 sm:w-8" />
              <div>
                <p className="text-xs font-semibold text-white sm:text-sm">Ahmad Fauzi</p>
                <p className="text-[10px] text-white/50 sm:text-xs">XII RPL 1</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-4 w-10 rounded-full bg-sakura/70 sm:h-5 sm:w-12" />
              <div className="h-4 w-4 rounded-full bg-white/20 sm:h-5 sm:w-5" />
            </div>
          </div>
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm sm:p-4">
            <p className="text-[10px] font-semibold text-white/60 sm:text-xs">LANJUTKAN BELAJAR</p>
            <p className="mt-1 text-sm font-bold text-white sm:text-lg">Flashcard N5 — Bab 3: Kata Kerja</p>
            <div className="mt-2 sm:mt-3 h-2 w-full rounded-full bg-white/20">
              <div className="h-2 w-[65%] rounded-full bg-sakura" />
            </div>
            <p className="mt-1 text-right text-[10px] text-white/50 sm:text-xs">65%</p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            {[
              { label: "Streak", val: "12 hari" },
              { label: "XP", val: "2.450" },
            ].map((s) => (
              <div key={s.label} className="flex-1 rounded-xl bg-white/5 p-2 text-center backdrop-blur-sm sm:p-3">
                <p className="text-sm font-bold text-white sm:text-lg">{s.val}</p>
                <p className="text-[10px] text-white/50 sm:text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductReveal() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.4"] });
  const yLaptop = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opLaptop = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const rotLaptop = useTransform(scrollYProgress, [0, 1], [5, 4]);

  return (
    <section aria-label="Product showcase" id="demo" ref={ref} className="relative min-h-[120vh] bg-cream overflow-hidden">
      <div className="h-[20vh]" />

      <motion.div
        style={{ y: yLaptop, opacity: opLaptop, rotateX: rotLaptop, transformPerspective: 1400 }}
        className="mx-auto hidden max-w-6xl px-4 md:px-8 lg:block"
      >
        <div className="relative [transform-style:preserve-3d]">
          <div className="absolute left-1/2 top-[94%] -translate-x-1/2 h-14 w-[76%] rounded-[50%] bg-yozora/40 blur-2xl" />

          <div className="relative rounded-[1.5rem] bg-[#0a1120] p-2 shadow-[0_35px_75px_-28px_rgba(8,14,28,0.6)] ring-1 ring-white/10">
            <div className="absolute left-1/2 top-1.5 -translate-x-1/2 z-20 h-1 w-1 rounded-full bg-white/25" />
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[0.7rem] bg-yozora">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent" />
              <div className="flex h-full flex-col justify-center">
                <Dashboard />
              </div>
            </div>
          </div>

          <div className="relative z-10 mx-auto h-1.5 w-[98%] -mt-px rounded-full bg-gradient-to-b from-yozora-soft to-[#0a1120] shadow-[0_3px_6px_rgba(0,0,0,0.45)]" />

          <div className="relative mx-auto w-[113%] -ml-[6.5%]">
            <div
              className="relative h-5 rounded-b-[1.4rem] bg-gradient-to-b from-yozora-soft to-yozora shadow-[0_22px_45px_-15px_rgba(18,32,58,0.5)]"
              style={{ clipPath: "polygon(3.5% 0, 96.5% 0, 100% 100%, 0% 100%)" }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-white/15" />
              <div className="absolute left-1/2 top-1/2 h-1.5 w-24 -translate-x-1/2 -translate-y-1/2 rounded-md bg-cream/10" />
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-sm font-medium text-ink-soft tracking-wide">
          Ini yang dilihat murid setiap hari.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.8, ease: easeOut }}
        className="mx-auto max-w-[230px] px-6 lg:hidden"
      >
        <div className="relative">
          <div className="relative mx-auto aspect-[9/19.5] w-full overflow-hidden rounded-[2.75rem] bg-gradient-to-b from-yozora-soft to-yozora shadow-2xl">
            <div className="absolute inset-[2px] rounded-[2.6rem] bg-yozora ring-1 ring-white/10" />

            <div className="absolute inset-[4px] overflow-hidden rounded-[2.4rem] bg-yozora">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent z-20" />

              <div className="absolute top-2 left-1/2 z-30 h-[18px] w-[80px] -translate-x-1/2 rounded-full bg-yozora flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
              </div>

              <div className="absolute top-3 left-6 right-6 z-20 flex items-center justify-between">
                <span className="text-[9px] font-semibold text-white/60">9:41</span>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-3 rounded-full bg-white/30" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                </div>
              </div>

              <div className="relative h-full">
                <Dashboard compact />
              </div>
            </div>
          </div>

          <div className="absolute -right-[3px] top-20 h-10 w-[3px] rounded-r-full bg-yozora-soft opacity-60" />
          <div className="absolute -right-[3px] top-28 h-14 w-[3px] rounded-r-full bg-yozora-soft opacity-60" />
          <div className="absolute -left-[3px] top-24 h-8 w-[3px] rounded-l-full bg-yozora-soft opacity-40" />
        </div>
        <p className="mt-8 text-center text-xs font-medium text-ink-soft tracking-wide">
          Ini yang dilihat murid setiap hari.
        </p>
      </motion.div>

      <ScrollHint />
    </section>
  );
}
