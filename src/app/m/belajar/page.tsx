"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ChevronRight, BookOpen, Zap, Package, Palette, Link2, Flame, Check } from "lucide-react";
import { StudentShell } from "@/components/layout/StudentShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RingProgress } from "@/components/ui/ProgressBar";
import { AnimatedPage, staggerContainer, staggerItem } from "@/components/ui/AnimatedPage";
import { useTimeGreeting } from "@/lib/time-greeting";

const levels = [
  { id: "N5", label: "N5", active: true, locked: false, progress: 78 },
  { id: "N4", label: "N4", active: false, locked: true, progress: 0 },
  { id: "N3", label: "N3", active: false, locked: true, progress: 0 },
];

const categories = [
  { name: "Kata Benda", done: 32, total: 50, icon: Package, desc: "Kosakata dasar", color: "sora" },
  { name: "Kata Kerja", done: 20, total: 40, icon: Zap, desc: "Godan & Ichidan", color: "sakura" },
  { name: "Kata Sifat", done: 15, total: 30, icon: Palette, desc: "い & な adjektiva", color: "gold" },
  { name: "Partikel", done: 8, total: 20, icon: Link2, desc: "は, を, が, に, へ", color: "success" },
];

export default function ChooseDeck() {
  const timeGreeting = useTimeGreeting();
  const totalDone = categories.reduce((s, c) => s + c.done, 0);
  const totalAll = categories.reduce((s, c) => s + c.total, 0);
  const overallPct = Math.round((totalDone / totalAll) * 100);

  return (
    <StudentShell noHeader>
      <AnimatedPage>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <div className={"relative overflow-hidden rounded-card bg-gradient-to-br px-5 py-6 text-white " + timeGreeting.gradient}>
              {timeGreeting.period === "malam" && (
                <div className="absolute inset-0 opacity-20" style={{background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 70%)"}} />
              )}
              {timeGreeting.period === "pagi" && (
                <div className="absolute inset-0" style={{background: "radial-gradient(ellipse at 20% 30%, rgba(255,200,100,0.25) 0%, transparent 60%)"}} />
              )}
              <div className="seigaiha absolute inset-0 opacity-[0.07]" />
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5" />
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/[0.03]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white">
                      <timeGreeting.icon size={18} strokeWidth={2.25} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-white/70">{timeGreeting.greeting}, Ahmad</p>
                      <p className="text-sm font-bold leading-tight">Level N5 — {timeGreeting.jpGreeting}</p>
                    </div>
                  </div>
                  <Badge tone="gold" className="text-[11px]">
                    JP Learn
                  </Badge>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Progress Keseluruhan</span>
                    <span className="font-bold text-gold">{overallPct}%</span>
                  </div>
                  <div className="mt-1.5 h-2.5 w-full rounded-full bg-white/20 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-gold to-[#f0c25e]"
                      initial={{ width: "0%" }}
                      animate={{ width: `${overallPct}%` }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-btn bg-white/10 px-3 py-2 text-center">
                    <p className="text-lg font-bold leading-none">{totalDone}</p>
                    <p className="mt-0.5 text-[10px] text-white/70">Kata Dikuasai</p>
                  </div>
                  <div className="rounded-btn bg-white/10 px-3 py-2 text-center">
                    <p className="text-lg font-bold leading-none">12</p>
                    <p className="mt-0.5 text-[10px] text-white/70"><Flame size={14} className="text-sakura" /> Streak</p>
                  </div>
                  <div className="rounded-btn bg-white/10 px-3 py-2 text-center">
                    <p className="text-lg font-bold leading-none">156</p>
                    <p className="mt-0.5 text-[10px] text-white/70">XP Hari Ini</p>
                  </div>
                </div>

                <Link href="/m/belajar/sesi" className="mt-4 block">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 rounded-btn bg-white px-4 py-3 text-sm font-bold text-sora transition-all hover:bg-white/90"
                  >
                    <BookOpen size={18} />
                    Lanjutkan Belajar
                    <ChevronRight size={18} />
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="mt-5">
            <h2 className="text-base font-bold text-ink">Pilih Level JLPT</h2>
            <div className="mt-2 flex gap-2">
              {levels.map((l) => {
                const active = l.active;
                return (
                  <motion.button
                    key={l.id}
                    whileTap={!l.locked ? { scale: 0.95 } : undefined}
                    disabled={l.locked}
                    className={
                      "relative flex flex-1 flex-col items-center gap-1.5 rounded-btn py-3 text-sm font-bold transition-all duration-200 " +
                      (active
                        ? "bg-sora text-white shadow-soft"
                        : l.locked
                          ? "bg-paper text-ink-soft border border-line opacity-60"
                          : "bg-paper text-ink-soft border border-line hover:border-sora/30")
                    }
                  >
                    {active && (
                      <motion.span
                        className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white"
                        layoutId="activeLevel"
                      >
                        <Check size={10} />
                      </motion.span>
                    )}
                    <span className="text-base">{l.label}</span>
                    {l.locked && <Lock size={12} className="text-ink-soft" />}
                    {active && !l.locked && (
                      <span className="text-[10px] text-white/70">{l.progress}%</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="mt-4 flex items-center gap-5 transition-all hover:shadow-soft-lg" padded>
              <div className="shrink-0">
                <RingProgress value={78} size={88} stroke={8}>
                  <span className="text-base font-bold text-sora">78%</span>
                  <span className="text-[9px] text-ink-soft">N5</span>
                </RingProgress>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-ink">Level N5</p>
                  <span className="rounded-full bg-sora-tint-soft px-2 py-0.5 text-[10px] font-semibold text-sora">
                    JLPT N5
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-ink-soft">156 / 200 kata dikuasai</p>
                <div className="mt-2 flex items-center gap-2">
                  <motion.div
                    className="h-1.5 flex-1 rounded-full bg-sora-tint-soft overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-full rounded-full bg-sora"
                      initial={{ width: "0%" }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                    />
                  </motion.div>
                  <Link
                    href="/m/belajar/sesi"
                    className="shrink-0 text-xs font-semibold text-sora transition-colors hover:text-sora-tint"
                  >
                    Lanjutkan →
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem} className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-ink">Kategori</h2>
              <span className="text-xs text-ink-soft/60">{totalDone}/{totalAll} kata</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((c, i) => {
                const pct = Math.round((c.done / c.total) * 100);
                const barColor =
                  c.color === "sakura"
                    ? "bg-sakura"
                    : c.color === "gold"
                      ? "bg-gold"
                      : c.color === "success"
                        ? "bg-success"
                        : "bg-sora";
                const iconColors: Record<string, string> = {
                  sora: "text-sora",
                  sakura: "text-sakura",
                  gold: "text-gold",
                  success: "text-success",
                };
                return (
                  <motion.div key={c.name} variants={staggerItem} custom={i}>
                    <Link href="/m/belajar/sesi">
                      <Card interactive padded>
                        <div className="flex items-start justify-between">
                          <span className={"flex h-10 w-10 items-center justify-center " + iconColors[c.color]}><c.icon size={24} /></span>
                          <span className="rounded-full bg-sora-tint-soft px-2 py-0.5 text-[10px] font-semibold text-sora">
                            {c.done}/{c.total}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-bold text-ink">{c.name}</p>
                        <p className="text-xs text-ink-soft">{c.desc}</p>
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-sora">{pct}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-sora-tint-soft overflow-hidden">
                            <motion.div
                              className={"h-full rounded-full " + barColor}
                              initial={{ width: "0%" }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                duration: 0.8,
                                ease: [0.16, 1, 0.3, 1],
                                delay: 0.3 + i * 0.08,
                              }}
                            />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="mt-6">
            <Link href="/m/belajar/sesi">
              <motion.div whileTap={{ scale: 0.97 }}>
                <Button fullWidth size="lg" className="relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap size={20} /> Mulai Sesi Acak (20 kata)
                  </span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </AnimatedPage>
    </StudentShell>
  );
}
