"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Check,
  X,
  UserCircle,
  Award,
  TrendingUp,
  BookOpen,
  RefreshCw,
  Share2,
  Sparkles,
  PartyPopper,
  Trophy,
  Zap,
  Target,
} from "lucide-react";
import { StudentShell } from "@/components/layout/StudentShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RingProgress } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { AnimatedPage, staggerContainer, staggerItem } from "@/components/ui/AnimatedPage";

const review = [
  { no: 1, q: "食べる artinya?", user: "Makan", correct: "Makan", ok: true, exp: "食べる (taberu) = makan, kata kerja golongan 2." },
  { no: 2, q: "飲む artinya?", user: "Minum", correct: "Minum", ok: true, exp: "飲む (nomu) = minum, kata kerja golongan 1." },
  { no: 3, q: "行く artinya?", user: "Pergi", correct: "Pergi", ok: true, exp: "行く (iku) = pergi." },
  { no: 4, q: "買う artinya?", user: "Tidur", correct: "Membeli", ok: false, exp: "買う (kau) = membeli, bukan tidur (寝る)." },
  { no: 5, q: "待つ artinya?", user: "Menunggu", correct: "Menunggu", ok: true, exp: "待つ (matsu) = menunggu." },
];

const correctCount = review.filter((r) => r.ok).length;
const score = Math.round((correctCount / review.length) * 100);
const baseXP = correctCount * 10;
const bonusXP = score >= 80 ? 20 : score >= 60 ? 10 : 0;
const totalXP = baseXP + bonusXP;

export default function KuisReview() {
  const router = useRouter();
  const [open, setOpen] = useState<number | null>(null);

  const scoreLabel = score >= 80 ? "Lulus!" : score >= 60 ? "Hampir Lulus!" : "Ayo belajar lagi!";
  const scoreColor = score >= 80 ? "success" : score >= 60 ? "gold" : "error";
  const ScoreIcon = score >= 80 ? Trophy : score >= 60 ? TrendingUp : BookOpen;

  return (
    <StudentShell noHeader>
      <AnimatedPage>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex flex-col items-center pt-4 text-center">
            <div className="relative">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                <RingProgress value={score} size={130} color={scoreColor}>
                  <span className="text-3xl font-bold text-sora">{score}</span>
                  <span className="text-[10px] text-ink-soft">/ 100</span>
                </RingProgress>
              </motion.div>

              {score >= 80 && (
                <>
                  <motion.span
                    className="absolute -right-2 -top-1 text-gold"
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <Sparkles size={20} fill="currentColor" />
                  </motion.span>
                  <motion.span
                    className="absolute -left-1 -bottom-2 text-success"
                    initial={{ scale: 0, rotate: 30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <PartyPopper size={18} />
                  </motion.span>
                </>
              )}
              {score >= 60 && score < 80 && (
                <motion.span
                  className="absolute -right-1 -top-1 text-gold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <Target size={18} />
                </motion.span>
              )}
            </div>

            <motion.div
              className="mt-3 flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold ${
                  scoreColor === "success"
                    ? "bg-success/10 text-success"
                    : scoreColor === "gold"
                      ? "bg-gold/10 text-gold"
                      : "bg-error/10 text-error"
                }`}
              >
                <ScoreIcon size={18} />
                {scoreLabel}
              </span>
            </motion.div>

            <motion.p
              className="mt-2 text-xs text-ink-soft"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              {correctCount} dari {review.length} soal dijawab benar
            </motion.p>
          </motion.div>

          <motion.div variants={staggerItem} className="mt-5 grid grid-cols-3 gap-2.5">
            {[
              { v: `${correctCount}/${review.length}`, l: "Benar", icon: Check, c: "text-success", bg: "bg-success/10" },
              { v: `+${totalXP}`, l: "Total XP", icon: Zap, c: "text-gold", bg: "bg-gold/10" },
              { v: "#5", l: "Peringkat", icon: Trophy, c: "text-sora", bg: "bg-sora-tint-soft" },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                className="rounded-card bg-paper border border-line p-3.5 text-center shadow-soft transition-all hover:shadow-soft-lg"
              >
                <div className={`mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`}>
                  <s.icon size={16} className={s.c} />
                </div>
                <p className="text-base font-bold text-sora">{s.v}</p>
                <p className="text-[10px] text-ink-soft">{s.l}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={staggerItem}>
            <div className="mt-5 rounded-card border border-line bg-paper p-4 shadow-soft transition-all hover:shadow-soft-lg">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <UserCircle size={40} className="text-sora" />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-success text-[7px] text-white font-bold ring-2 ring-paper">
                    ✓
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-ink">Bu Siti Rahma</p>
                    <Badge tone="soft" className="text-[9px]">Guru</Badge>
                  </div>
                  <div className="mt-1.5 rounded-btn bg-sora-tint-soft/50 px-3 py-2">
                    <p className="text-xs text-ink leading-relaxed">
                      &ldquo;Bagus, tingkatkan hafalan partikel ya! <Sparkles size={14} className="inline" />&rdquo;
                    </p>
                  </div>
                  <p className="mt-1 text-[10px] text-ink-soft/60">
                    Komentar guru · {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-ink">Review Jawaban</h2>
              <Badge tone="neutral" className="text-[10px]">
                {correctCount} benar · {review.length - correctCount} salah
              </Badge>
            </div>

            <div className="space-y-2">
              {review.map((r, i) => {
                const isOpen = open === r.no;
                return (
                  <motion.div
                    key={r.no}
                    variants={staggerItem}
                    custom={i}
                    className={`overflow-hidden rounded-card border transition-all duration-200 ${
                      isOpen
                        ? r.ok
                          ? "border-success/30 shadow-soft"
                          : "border-error/30 shadow-soft"
                        : "border-line hover:shadow-soft"
                    }`}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : r.no)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isOpen
                          ? r.ok
                            ? "bg-success/[0.02]"
                            : "bg-error/[0.02]"
                          : "bg-paper hover:bg-sora-tint-soft/30"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          r.ok
                            ? "bg-success/10 text-success"
                            : "bg-error/10 text-error"
                        }`}
                      >
                        {r.ok ? <Check size={14} /> : <X size={14} />}
                      </span>

                      <span className="flex-1 text-sm font-semibold text-ink">
                        <span className="text-ink-soft mr-1">{r.no}.</span>
                        {r.q}
                      </span>

                      <ChevronDown
                        size={16}
                        className={`shrink-0 text-ink-soft transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-line bg-gradient-to-b from-sora-tint-soft/20 to-transparent px-4 py-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="rounded-btn bg-paper/80 px-3 py-2">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft/60">
                                  Jawabanmu
                                </p>
                                <p className={`mt-0.5 text-sm font-bold ${
                                  r.ok ? "text-success" : "text-error"
                                }`}>
                                  {r.user}
                                </p>
                              </div>
                              <div className="rounded-btn bg-paper/80 px-3 py-2">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft/60">
                                  Jawaban Benar
                                </p>
                                <p className="mt-0.5 text-sm font-bold text-success">{r.correct}</p>
                              </div>
                            </div>
                            <div className="mt-2 rounded-btn bg-sora-tint-soft/30 px-3 py-2">
                              <p className="text-xs text-ink leading-relaxed">{r.exp}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="mt-6 space-y-2.5">
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
              <Button
                fullWidth
                size="lg"
                onClick={() => router.push("/m/kuis/soal")}
              >
                <RefreshCw size={16} /> Coba Lagi
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
              <Button
                fullWidth
                variant="outline"
                size="lg"
                onClick={() => router.push("/m/dashboard")}
              >
                Kembali ke Dashboard
              </Button>
            </motion.div>
            <div className="flex items-center justify-center pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: "Hasil Kuis LinguaFlow", text: `Aku dapat skor ${score} di kuis bahasa Jepang!` });
                  }
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft transition-colors hover:text-sora"
              >
                <Share2 size={14} /> Bagikan Hasil
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatedPage>
    </StudentShell>
  );
}
