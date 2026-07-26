"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { viewportOnce } from "@/lib/motion";

export function CtaMassive() {
  return (
    <section className="relative overflow-hidden bg-cream py-40 md:py-56">
      <div className="mx-auto max-w-6xl px-6 text-center md:px-10">
        <motion.h2
          className="text-[12vw] font-bold leading-[0.95] tracking-tight text-yozora md:text-8xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          Gerbangmu ke Jepang
          <br />
          <span className="text-sakura">dimulai hari ini.</span>
        </motion.h2>
        <motion.div
          className="mt-12 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/register-sekolah"
            className="group inline-flex items-center gap-3 rounded-full bg-yozora px-9 py-4 text-lg font-semibold text-cream transition-colors hover:bg-yozora-soft"
          >
            Daftarkan sekolah
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/login" className="text-sm font-semibold text-ink-soft underline-offset-4 hover:underline">
            Sudah punya akun? Masuk
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
