"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, RotateCcw, PartyPopper, FileText, Star, Flame, Repeat } from "lucide-react";
import { StudentShell } from "@/components/layout/StudentShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { KanjiText } from "@/components/ui/KanjiText";
import { AnimatedPage, staggerContainer, staggerItem } from "@/components/ui/AnimatedPage";
import { useProgress, dueReviews } from "@/lib/progress";

export default function SessionSummary() {
  const [progress] = useProgress();
  const due = dueReviews(progress);
  const studiedNow = 3;
  const xpGain = studiedNow * 20;

  return (
    <StudentShell noHeader>
      <AnimatedPage>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex flex-col items-center pt-8 text-center">
            <motion.div
              className="relative flex h-24 w-24 items-center justify-center rounded-full bg-sora"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Check size={44} className="text-white" strokeWidth={3} />
              <motion.span
                className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-gold ring-4 ring-warm-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              />
              <motion.span
                className="absolute -bottom-1 -left-1 h-2.5 w-2.5 rounded-full bg-success ring-4 ring-warm-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              />
            </motion.div>
            <motion.h1
              className="mt-5 text-2xl font-bold text-ink"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              Sesi Selesai! <PartyPopper size={24} className="inline text-gold ml-1" />
            </motion.h1>
            <motion.p
              className="text-sm text-ink-soft"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Kamu baru belajar {studiedNow} kata
            </motion.p>
          </motion.div>

          <motion.div variants={staggerItem} className="mt-6 grid grid-cols-3 gap-3">
            {[
              { v: String(progress.reviewed.length), l: "Kata Dipelajari", icon: FileText },
              { v: `+${xpGain}`, l: "XP Sesuai", icon: Star },
              { v: String(progress.streak), l: "Streak", icon: Flame },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <Card className="text-center transition-all hover:shadow-soft-lg">
                  <s.icon size={24} className="mx-auto text-sora/60" />
                  <p className="mt-1 text-xl font-bold text-sora">{s.v}</p>
                  <p className="text-xs text-ink-soft">{s.l}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.section variants={staggerItem} className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-ink">Perlu Diulang Nanti</h2>
              <span className="text-xs text-ink-soft">{due.length} kata</span>
            </div>
            {due.length === 0 ? (
              <Card className="text-center transition-all" padded>
                <p className="text-sm font-semibold text-success">Mantap! Semua kata sudah dikuasai 🎉</p>
                <p className="mt-1 text-xs text-ink-soft">Tandai &ldquo;Belum Hafal&rdquo; saat belajar untuk mengisi antrean ini.</p>
              </Card>
            ) : (
              <div className="space-y-2">
                {due.map((w, i) => (
                  <motion.div
                    key={w.kanji}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                  >
                    <Card
                      className="flex items-center justify-between transition-all hover:shadow-soft-lg"
                      padded
                    >
                      <KanjiText kanji={w.kanji} furigana={w.furigana} romaji={w.romaji} size="sm" align="left" />
                      <span className="text-sm font-semibold text-ink-soft">{w.arti}</span>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          <motion.div variants={staggerItem} className="mt-6 space-y-3">
            {due.length > 0 && (
              <motion.div whileTap={{ scale: 0.97 }}>
                <Link href="/m/deck">
                  <Button fullWidth size="lg" className="relative overflow-hidden">
                    <Repeat size={18} /> Ulangi Kata Sulit ({due.length})
                  </Button>
                </Link>
              </motion.div>
            )}
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link href="/m/belajar/sesi">
                <Button fullWidth variant="outline">
                  <RotateCcw size={18} /> Ulangi Sesi
                </Button>
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link href="/m/dashboard">
                <Button fullWidth size="lg">
                  Kembali ke Dashboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatedPage>
    </StudentShell>
  );
}
