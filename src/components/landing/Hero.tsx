"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowDown, Sparkles, BookOpen, Code2 } from "lucide-react";
import { easeOut } from "@/lib/motion";
import { ToriiGate } from "@/components/landing/ToriiGate";

const drift = ["学", "習", "日本語", "言", "葉", "文字", "会", "話"];

const headline = ["Setiap Kanji,", "Satu Langkah", "Lebih Dekat ke", "Jepang."];

const highlights = [
  { icon: Sparkles, label: "AI Sensei siaga 24 jam" },
  { icon: BookOpen, label: "Kurikulum JLPT N5–N3" },
  { icon: Code2, label: "Dirancang buat anak RPL" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yKanjiVal = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const yHeadVal = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opHeadVal = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const noParallax = prefersReduced;
  const yKanji = noParallax ? 0 : yKanjiVal;
  const yHead = noParallax ? 0 : yHeadVal;
  const opHead = noParallax ? 1 : opHeadVal;

  return (
    <section aria-label="Hero" ref={ref} className="relative min-h-screen overflow-hidden bg-cream">
      <motion.div style={{ y: yKanji }} className="pointer-events-none absolute inset-0" aria-hidden="true">
        {drift.map((k, i) => (
          <span
            key={i}
            className="kanji-bg absolute"
            style={{
              left: `${[6, 78, 52, 88, 14, 64, 30, 82][i]}%`,
              top: `${[12, 6, 60, 34, 74, 46, 18, 68][i]}%`,
              fontSize: `${[110, 150, 90, 130, 100, 140, 80, 120][i]}px`,
            }}
          >
            {k}
          </span>
        ))}
      </motion.div>

      <div className="pointer-events-none absolute -right-16 top-1/2 hidden w-[420px] -translate-y-1/2 opacity-[0.14] lg:block xl:w-[520px]" aria-hidden="true">
        <ToriiGate animated strokeColor="var(--color-yozora)" />
      </div>

      <motion.div
        style={{ y: yHead, opacity: opHead }}
        className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-24 pt-32 md:px-10 md:pt-40"
      >
        <motion.div
          className="mb-6 inline-flex items-center gap-2 self-start rounded-full border border-sakura/20 bg-sakura/5 px-4 py-1.5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sakura opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sakura" />
          </span>
          <span className="text-xs font-semibold text-sakura">Dibuat oleh murid SMK Texar</span>
        </motion.div>

        <h1 className="max-w-5xl text-[15vw] font-bold leading-[1.04] tracking-tight text-yozora md:text-[7.5rem]">
          {headline.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-2">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, ease: easeOut, delay: 0.2 + i * 0.1 }}
              >
                {line === "Jepang." ? <span className="text-sakura">Jepang.</span> : line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-6 max-w-xl text-lg text-ink-soft md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.7 }}
        >
          Bahasa Jepang untuk anak SMK jurusan RPL — bukan cuma buat nilai rapor.
          AI Sensei, flashcard kanji, dan kuis yang nyambung ke dunia IT, biar
          gerbang karier ke Jepang makin dekat.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.85 }}
        >
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-full bg-yozora px-8 py-4 text-base font-semibold text-cream shadow-xl shadow-black/15 transition-all duration-300 hover:bg-yozora-soft hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            Masuk ke kelas
            <ArrowDown size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
          </Link>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut, delay: 1.0 }}
        >
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <div key={h.label} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-sakura/70" />
                  <span className="text-sm font-semibold text-yozora">{h.label}</span>
                </div>
                {i < highlights.length - 1 && <span className="hidden h-4 w-px bg-line sm:block" />}
              </div>
            );
          })}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-ink-soft/30">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-ink-soft/40"
        >
          <ArrowDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}
