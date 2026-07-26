"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Crown, Flame } from "lucide-react";
import { viewportOnce } from "@/lib/motion";
import { ScrollHint } from "@/components/landing/ScrollHint";

/**
 * Scene 7 — LEADERBOARD SCENE
 * Podium animation with counting XP.
 */
const top3 = [
  { rank: 1, name: "Budi Santoso", xp: 3580, streak: 24, initial: "BS" },
  { rank: 2, name: "Siti Nurhaliza", xp: 3120, streak: 18, initial: "SN" },
  { rank: 3, name: "Rina Maharani", xp: 2980, streak: 15, initial: "RM" },
];

export function LeaderboardScene() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const yPodium = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  return (
    <section aria-label="Leaderboard" ref={ref} className="relative h-[130vh] bg-cream">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        {/* Kanji watermark */}
        <span className="lf-kanji text-[30vw] left-[-10%] bottom-[-10%] text-yozora/5">競</span>

        <div className="flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 pb-8 md:px-10 md:pb-10">
          <motion.div
            style={{ opacity, y: yPodium }}
            className="w-full"
          >
            <p className="mb-12 text-center text-xs font-semibold uppercase tracking-[0.4em] text-sakura">
              Peringkat Kelas — XII RPL 1
            </p>

            {/* podium */}
            <div className="flex items-end justify-center gap-4">
              {/* 2nd */}
              <div className="flex flex-1 flex-col items-center">
                <div className="flex h-24 w-full flex-col items-center justify-end rounded-t-2xl bg-yozora/20 md:h-28">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-yozora text-sm font-bold text-cream">
                    SN
                  </div>
                </div>
                <p className="mt-3 text-center text-sm font-bold text-yozora">Siti N.</p>
                <p className="text-xs text-ink-soft">{top3[1].xp.toLocaleString()} XP</p>
              </div>

              {/* 1st */}
              <div className="flex flex-1 flex-col items-center">
                <div className="relative flex h-32 w-full flex-col items-center justify-end rounded-t-2xl bg-gradient-to-t from-yozora to-yozora/60 md:h-40">
                  {/* crown */}
                  <div className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-gold shadow-lg">
                    <Crown size={16} className="text-yozora" />
                  </div>
                  <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-gold bg-yozora text-lg font-bold text-cream">
                    BS
                  </div>
                </div>
                <p className="mt-3 text-center text-sm font-bold text-yozora">Budi S.</p>
                <p className="text-xs font-semibold text-gold">{top3[0].xp.toLocaleString()} XP</p>
              </div>

              {/* 3rd */}
              <div className="flex flex-1 flex-col items-center">
                <div className="flex h-20 w-full flex-col items-center justify-end rounded-t-2xl bg-yozora/20 md:h-24">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-yozora text-sm font-bold text-cream">
                    RM
                  </div>
                </div>
                <p className="mt-3 text-center text-sm font-bold text-yozora">Rina M.</p>
                <p className="text-xs text-ink-soft">{top3[2].xp.toLocaleString()} XP</p>
              </div>
            </div>

            {/* current user highlight */}
            <div className="mx-auto mt-10 max-w-sm rounded-xl border border-sakura/20 bg-sakura/5 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sakura text-sm font-bold text-cream">
                  AF
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-yozora">
                    Kamu (Ahmad Fauzi) <span className="text-sakura">· #5</span>
                  </p>
                  <p className="flex items-center gap-1 text-xs text-ink-soft">
                    <Flame size={12} className="text-sakura" /> Streak 12 hari
                  </p>
                </div>
                <span className="text-lg font-bold text-yozora">2.450</span>
              </div>
            </div>
          </motion.div>
          <ScrollHint />
        </div>
      </div>
    </section>
  );
}
