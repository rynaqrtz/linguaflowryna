"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { viewportOnce, easeOut } from "@/lib/motion";
import { ScrollHint } from "@/components/landing/ScrollHint";

/**
 * Scene 10 — TEAM (zig-zag, borderless)
 * Photo half-body + name/role, alternating sides.
 * No cards / borders — just photo (edge-blurred so the crop fades)
 * and editorial text. Mobile stacks: photo on top, text below.
 */
type Member = {
  name: string;
  role: string;
  focus: string;
  initials: string;
  photo?: string; // drop file at /public/team/<slug>.jpg
};

const team: Member[] = [
  {
    name: "Sensei Khudori",
    role: "Project Manager & Business Analyst",
    focus: "Menyusun alur produk, riset kebutuhan sekolah, dan menjaga tim tetap pada tujuan.",
    initials: "SK",
  },
  {
    name: "Umar Khanif",
    role: "UI/UX Designer & Frontend",
    focus: "Merancang tampilan dan pengalaman belajar agar nyaman dipakai murid setiap hari.",
    initials: "UK",
  },
  {
    name: "Wildan Mubarok",
    role: "DevOps & QA Tester & Backend",
    focus: "Menjaga server tetap stabil, menguji fitur, dan meracik logika di balik layar.",
    initials: "WM",
  },
  {
    name: "Krisna Dwi Muthi",
    role: "Copywriter & SEO",
    focus: "Menulis cerita LinguaFlow dan membuat platform mudah ditemukan calon pengguna.",
    initials: "KM",
  },
];

function TeamPhoto({ member, index }: { member: Member; index: number }) {
  const fromLeft = index % 2 === 1; // odd rows: photo on the left
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.7, ease: easeOut, delay: 0.05 }}
      className="relative mx-auto aspect-[4/5] w-full max-w-[200px] sm:max-w-[260px] md:max-w-[300px]"
    >
      {/* soft halo behind photo */}
      <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-gold/20 via-yozora/10 to-sakura/15 blur-xl" />
      <div
        className={`relative h-full w-full overflow-hidden rounded-[2rem] ${
          fromLeft ? "rounded-br-[4rem]" : "rounded-bl-[4rem]"
        }`}
        style={{
          // edge-blur mask: fades the bottom where the half-body crop sits
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 78%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)",
        }}
      >
        {member.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photo}
            alt={member.name}
            className="h-full w-full object-cover object-top [filter:blur(0.3px)]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-yozora-soft to-yozora">
            <span className="font-jp text-6xl font-bold text-cream/80">
              {member.initials}
            </span>
          </div>
        )}
        {/* subtle grain so the fade blends with the yozora section */}
        <div className="pointer-events-none absolute inset-0 bg-yozora/10" />
      </div>
    </motion.div>
  );
}

function TeamText({ member }: { member: Member }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.7, ease: easeOut, delay: 0.12 }}
      className="text-center md:text-left"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold/80 sm:text-xs">
        {member.role}
      </p>
      <h3 className="mt-1.5 text-xl font-bold text-cream sm:text-2xl md:text-3xl">
        {member.name}
      </h3>
      <span className="lf-stroke mt-2.5" />
      <p className="mt-3 max-w-sm text-xs leading-relaxed text-cream/55 sm:text-sm md:mx-0 mx-auto">
        {member.focus}
      </p>
    </motion.div>
  );
}

export function TeamScene() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.3"] });
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <section aria-label="Tim kami" id="tim" ref={ref} className="relative bg-yozora pb-[10vh] pt-[34vh] overflow-hidden md:pt-[26vh]">
      {/* Kanji watermark */}
      <span className="lf-kanji text-[25vw] right-[-12%] bottom-[-5%] text-cream/5">友</span>

      <motion.div style={{ opacity }} className="relative mx-auto max-w-5xl px-6 md:px-10">
        {/* heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
            Tim
          </p>
          <h2 className="mt-4 text-3xl font-bold text-cream md:text-4xl">
            Siswa SMK Texar di balik layar
          </h2>
          <p className="mt-3 text-sm text-cream/40">
            Bukan perusahaan. Bukan startup. Empat orang yang percaya pendidikan
            bisa diubah.
          </p>
        </div>

        {/* zig-zag rows — 2 columns on all sizes (mobile keeps the laptop look) */}
        <div className="flex flex-col gap-12 sm:gap-16 md:gap-24">
          {team.map((member, i) => {
            const photoLeft = i % 2 === 1;
            return (
              <div
                key={member.name}
                className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2 sm:gap-4 md:gap-12"
              >
                <div className={photoLeft ? "order-1" : "order-2"}>
                  <TeamPhoto member={member} index={i} />
                </div>
                <div className={photoLeft ? "order-2" : "order-1"}>
                  <TeamText member={member} />
                </div>
              </div>
            );
          })}
        </div>

        <ScrollHint />
      </motion.div>
    </section>
  );
}
