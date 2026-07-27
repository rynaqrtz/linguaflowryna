"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dices,
  Trophy,
  Zap,
  ClipboardList,
  TrendingUp,
  Flame,
  Timer,
  ChevronRight,
  ScrollText,
  BookOpen,
  Sword,
  Sparkles,
  Medal,
  Clock,
  Check,
} from "lucide-react";
import { StudentShell } from "@/components/layout/StudentShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AnimatedPage, staggerContainer, staggerItem } from "@/components/ui/AnimatedPage";

type Tab = "guru" | "harian";

function StatCard({ icon: Icon, value, label, iconColor }: {
  icon: React.ElementType;
  value: string;
  label: string;
  iconColor: string;
}) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="rounded-card bg-paper border border-line p-4 shadow-soft transition-all hover:shadow-soft-lg active:scale-[0.98]"
    >
      <Icon size={22} className={iconColor} />
      <span className="mt-2 block text-xl font-bold text-ink leading-none">{value}</span>
      <p className="mt-0.5 text-[11px] font-medium text-ink-soft">{label}</p>
    </motion.div>
  );
}

function EmptyState({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <motion.div variants={staggerItem} className="mt-12 flex flex-col items-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sora-tint-soft">
        <Icon size={32} className="text-sora/40" />
      </div>
      <p className="text-sm font-bold text-ink">{title}</p>
      <p className="mt-1 text-xs text-ink-soft">{desc}</p>
    </motion.div>
  );
}

function DeadlineBar({ deadline, pct = 60 }: { deadline: string; pct?: number }) {
  return (
    <div className="mt-2.5 space-y-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1 font-semibold text-sakura">
          <Timer size={11} /> {deadline}
        </span>
        <span className="text-ink-soft/50">{pct}% waktu terpakai</span>
      </div>
      <div className="h-1 rounded-full bg-sakura/15 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-sakura to-sakura-soft"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

function ChallengeCard({ icon: Icon, title, desc, iconColor, gradient }: {
  icon: React.ElementType;
  title: string;
  desc: string;
  iconColor: string;
  gradient: string;
}) {
  const router = useRouter();
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ scale: 1.01, x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push("/m/kuis/soal")}
      className="cursor-pointer rounded-card bg-paper border border-line p-4 shadow-soft transition-all hover:shadow-soft-lg active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${gradient}`}>
          <Icon size={22} className={iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-ink">{title}</p>
          <p className="text-xs text-ink-soft mt-0.5">{desc}</p>
        </div>
        <ChevronRight size={18} className="shrink-0 text-ink-soft/30 transition-all group-hover:text-sora group-hover:translate-x-0.5" />
      </div>
    </motion.div>
  );
}

export default function KuisList() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("guru");
  const hasTasks = true;

  return (
    <StudentShell noHeader>
      <AnimatedPage>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-sora via-sora-tint to-sora-tint-2 px-5 py-6 text-white shadow-soft-lg">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-[12px] border-white/5" />
              <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-white/[0.03]" />
              <div className="seigaiha absolute inset-0 opacity-[0.06]" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                    <Sword size={22} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold leading-tight">Kuis & Tantangan</h1>
                    <p className="text-[12px] text-white/70">Uji kemampuan bahasa Jepangmu</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-btn bg-white/10 px-3 py-2">
                  <Sparkles size={14} className="text-gold shrink-0" />
                  <p className="text-xs text-white/80">Kuis hari ini: N5 Random · 10 soal</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <StatCard icon={BookOpen} value="85" label="Rata-rata skor" iconColor="text-sora" />
            <StatCard icon={Flame} value="7" label="Hari streak" iconColor="text-gold" />
            <StatCard icon={Medal} value="12" label="Kuis selesai" iconColor="text-success" />
          </div>

          <motion.div
            variants={staggerItem}
            className="mt-5 flex gap-2 rounded-xl bg-sora-tint-soft/60 p-1"
            role="tablist"
            aria-label="Jenis kuis"
          >
            <button
              role="tab"
              aria-selected={tab === "guru"}
              onClick={() => setTab("guru")}
              className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-bold transition-all duration-200 ${
                tab === "guru"
                  ? "bg-paper text-sora shadow-soft"
                  : "text-ink-soft/70 hover:text-ink"
              }`}
            >
              <ScrollText size={16} />
              Tugas Guru
              <span className="flex h-5 min-w-[18px] items-center justify-center rounded bg-sakura/15 px-1.5 text-[10px] font-bold text-sakura">
                2
              </span>
            </button>
            <button
              role="tab"
              aria-selected={tab === "harian"}
              onClick={() => setTab("harian")}
              className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-bold transition-all duration-200 ${
                tab === "harian"
                  ? "bg-paper text-sora shadow-soft"
                  : "text-ink-soft/70 hover:text-ink"
              }`}
            >
              <Dices size={16} />
              Kuis Harian
            </button>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              variants={staggerItem}
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {tab === "guru" && (
                <>
                  {hasTasks ? (
                    <div className="mt-4 space-y-5">
                      <section>
                        <div className="mb-3 flex items-center gap-2">
                          <span className="flex h-5 w-1 rounded-full bg-sakura" />
                          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-sakura">
                            Perlu Segera
                          </p>
                          <span className="h-px flex-1 bg-sakura/20" />
                        </div>

                        <div className="rounded-card border border-sakura/20 bg-paper shadow-soft transition-all hover:shadow-soft-lg active:scale-[0.98]">
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sakura/10">
                                  <Sword size={20} className="text-sakura" />
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-sm font-bold text-ink">Kuis Kata Kerja Bab 3</p>
                                  <p className="text-xs text-ink-soft">Bu Siti Rahma · 10 soal pilihan ganda</p>
                                </div>
                              </div>
                              <Badge tone="sakura" className="shrink-0 text-[10px]">Mendesak</Badge>
                            </div>
                            <DeadlineBar deadline="Besok 23:59" pct={60} />
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.97 }}
                              className="mt-3"
                            >
                              <Button
                                className="w-full shadow-soft"
                                size="sm"
                                onClick={() => router.push("/m/kuis/soal")}
                              >
                                <Zap size={16} /> Kerjakan Sekarang
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </section>

                      <section>
                        <div className="mb-3 flex items-center gap-2">
                          <span className="flex h-5 w-1 rounded-full bg-ink-soft/30" />
                          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-soft">
                            Tugas Lainnya
                          </p>
                          <span className="h-px flex-1 bg-line" />
                        </div>

                        <div className="group relative overflow-hidden rounded-card border border-line bg-paper shadow-soft transition-all hover:shadow-soft-lg active:scale-[0.98]">
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sora-tint-soft">
                                  <BookOpen size={20} className="text-sora" />
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-sm font-bold text-ink">Hafalan Partikel</p>
                                  <p className="text-xs text-ink-soft">Bu Siti Rahma · 15 soal</p>
                                </div>
                              </div>
                              <Badge tone="neutral" className="shrink-0 text-[10px]">5 hari lagi</Badge>
                            </div>

                            <div className="mt-4 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15">
                                    <Check size={12} className="text-success" />
                                  </span>
                                  <span className="text-xs font-semibold text-success">85%</span>
                                </div>
                                <span className="text-[11px] text-ink-soft">Sudah dikerjakan</span>
                              </div>
                              <ProgressBar value={85} color="success" height={4} trackClass="!bg-sora-tint-soft/30" />
                              <div className="flex justify-end pt-1">
                                <motion.button
                                  whileHover={{ x: 3 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => router.push("/m/kuis/review")}
                                  className="flex items-center gap-1 text-xs font-semibold text-sora transition-colors hover:text-sora-tint"
                                >
                                  Lihat Hasil <ChevronRight size={14} />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  ) : (
                    <EmptyState
                      icon={ClipboardList}
                      title="Tidak ada tugas"
                      desc="Gurumu belum memberikan tugas. Santai dulu!"
                    />
                  )}
                </>
              )}

              {tab === "harian" && (
                <div className="mt-4 space-y-3.5">
                  <motion.div
                    variants={staggerItem}
                    whileHover={{ y: -2 }}
                    className="relative overflow-hidden rounded-card bg-gradient-to-br from-sora via-sora-tint to-[#4a5f9e] p-5 shadow-soft-lg transition-all hover:shadow-soft-lg active:scale-[0.98]"
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border-[16px] border-white/5" />
                    <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full border-[8px] border-white/[0.03]" />
                    <div className="seigaiha-yozora absolute inset-0 opacity-[0.08]" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                          <Dices size={24} className="text-white" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-white">Kuis Hari Ini</p>
                          <p className="text-[12px] text-white/60">N5 Random · 10 soal · ±5 menit</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 rounded-btn bg-white/10 px-3 py-2 backdrop-blur-sm">
                        <Clock size={14} className="text-white/60" />
                        <span className="text-xs text-white/70">Tersedia hingga 23:59 WIB</span>
                      </div>

                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }} className="mt-4">
                        <Button
                          fullWidth
                          className="bg-white text-sora font-bold transition-all hover:bg-white/90 active:scale-[0.97] shadow-soft"
                          onClick={() => router.push("/m/kuis/soal")}
                        >
                          <Sparkles size={16} /> Mulai Kuis
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>

                  <ChallengeCard
                    icon={Zap}
                    title="Mode Cepat"
                    desc="5 soal · tebak cepat 30 detik per soal"
                    iconColor="text-gold"
                    gradient="bg-gradient-to-r from-gold/15 to-amber-400/15"
                  />

                  <ChallengeCard
                    icon={Trophy}
                    title="Tantangan Mingguan"
                    desc="Kumpulkan 100 poin · 3 hari lagi"
                    iconColor="text-success"
                    gradient="bg-gradient-to-r from-success/15 to-emerald-400/15"
                  />

                  <motion.div
                    variants={staggerItem}
                    className="mt-2 flex items-center justify-center gap-2 rounded-card bg-sora-tint-soft/50 px-4 py-3 text-center"
                  >
                    <Flame size={16} className="text-gold" />
                    <p className="text-xs text-ink-soft">
                      Streak kamu <span className="font-bold text-sora">7 hari</span> berturut-turut
                    </p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </AnimatedPage>
    </StudentShell>
  );
}
