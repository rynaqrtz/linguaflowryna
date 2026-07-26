"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { viewportOnce } from "@/lib/motion";
import { ToriiGate } from "@/components/landing/ToriiGate";

export function EndingScene() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end 0.6"] });
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const yContent = useTransform(scrollYProgress, [0, 0.3], [30, 0]);

  return (
    <section aria-label="Call to action" ref={ref} className="relative min-h-screen bg-cream overflow-hidden flex items-center justify-center">
      <span className="lf-kanji text-[35vw] left-[-15%] top-[-18%] text-yozora/5">始</span>
      <span className="lf-kanji text-[25vw] right-[-15%] bottom-[-12%] text-yozora/5">旅</span>

      <div className="pointer-events-none absolute left-1/2 top-10 w-72 -translate-x-1/2 opacity-[0.1] md:w-96">
        <ToriiGate animated strokeColor="var(--color-sakura)" />
      </div>

      <motion.div
        style={{ opacity, y: yContent }}
        className="relative z-10 mx-auto w-full max-w-3xl px-6 text-center md:px-10"
      >
        <div className="lf-ending space-y-2">
          <p className="text-xl font-light text-ink-soft md:text-2xl">
            Gerbangnya sudah terbuka.
          </p>
          <p className="text-xl font-light text-ink-soft md:text-2xl">
            Tinggal kamu yang melangkah.
          </p>
          <p className="text-3xl font-bold text-yozora md:text-5xl">
            Mulai perjalananmu ke Jepang.
          </p>
        </div>

        <div className="lf-ending-line mx-auto mt-8" />
        <p className="mt-3 text-xs text-ink-soft/60">Gratis untuk murid pertama</p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          viewport={viewportOnce}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/register-sekolah"
            className="w-full rounded-full bg-yozora px-10 py-4 text-sm font-bold text-cream shadow-xl shadow-black/15 transition-all duration-300 hover:bg-yozora-soft hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:w-auto"
          >
            Coba Sekarang — Gratis
          </Link>
          <Link
            href="/login"
            className="w-full rounded-full border border-line bg-white px-10 py-4 text-sm font-bold text-yozora transition-all duration-300 hover:bg-yozora/5 hover:border-yozora/30 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yozora focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:w-auto dark:bg-yozora-soft/50 dark:border-white/10 dark:text-cream"
          >
            Masuk
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
