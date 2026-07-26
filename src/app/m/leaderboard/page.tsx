"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Medal, TrendingUp, Flame, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { StudentShell } from "@/components/layout/StudentShell";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { AnimatedPage, staggerContainer, staggerItem } from "@/components/ui/AnimatedPage";

type Filter = "kelas" | "sekolah" | "mingguan";

type RankEntry = {
  rank: number;
  name: string;
  xp: number;
  color?: string;
  streak: number;
  me?: boolean;
};

const top3: RankEntry[] = [
  { rank: 2, name: "Siti Nurhaliza", xp: 3120, color: "#7fadd1", streak: 18 },
  { rank: 1, name: "Budi Santoso", xp: 3580, color: "#c24d77", streak: 24 },
  { rank: 3, name: "Rina Maharani", xp: 2980, color: "#e8b04b", streak: 15 },
];

const rest = [
  { rank: 4, name: "Dewi Lestari", xp: 2760, streak: 11 },
  { rank: 5, name: "Ahmad Fauzi", xp: 2450, streak: 12, me: true },
  { rank: 6, name: "Eko Prasetyo", xp: 2310, streak: 9 },
  { rank: 7, name: "Fitri Anggraini", xp: 2180, streak: 14 },
  { rank: 8, name: "Gilang Ramadhan", xp: 1990, streak: 7 },
];

const rankings: Record<Filter, { top3: typeof top3; rest: typeof rest }> = {
  kelas: { top3, rest },
  sekolah: {
    top3: [
      { rank: 2, name: "Rina Maharani", xp: 4210, color: "#e8b04b", streak: 21 },
      { rank: 1, name: "Budi Santoso", xp: 3980, color: "#c24d77", streak: 24 },
      { rank: 3, name: "Siti Nurhaliza", xp: 3650, color: "#7fadd1", streak: 18 },
    ],
    rest: [
      { rank: 4, name: "Dewi Lestari", xp: 3320, streak: 14 },
      { rank: 5, name: "Ahmad Fauzi", xp: 2450, streak: 12, me: true },
      { rank: 6, name: "Eko Prasetyo", xp: 2290, streak: 9 },
      { rank: 7, name: "Fitri Anggraini", xp: 2110, streak: 16 },
      { rank: 8, name: "Gilang Ramadhan", xp: 1980, streak: 7 },
    ],
  },
  mingguan: {
    top3: [
      { rank: 2, name: "Dewi Lestari", xp: 540, color: "#7fadd1", streak: 14 },
      { rank: 1, name: "Ahmad Fauzi", xp: 620, color: "#c24d77", streak: 12, me: true },
      { rank: 3, name: "Budi Santoso", xp: 510, color: "#e8b04b", streak: 24 },
    ],
    rest: [
      { rank: 4, name: "Siti Nurhaliza", xp: 480, streak: 18 },
      { rank: 5, name: "Fitri Anggraini", xp: 430, streak: 16 },
      { rank: 6, name: "Eko Prasetyo", xp: 360, streak: 9 },
      { rank: 7, name: "Rina Maharani", xp: 310, streak: 21 },
      { rank: 8, name: "Gilang Ramadhan", xp: 250, streak: 7 },
    ],
  },
};

export default function Leaderboard() {
  const [filter, setFilter] = useState<Filter>("kelas");

  return (
    <StudentShell noHeader>
      <AnimatedPage>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold text-ink">Peringkat</h1>
            <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold">DEMO</span>
          </motion.div>

          {/* Filter tabs */}
          <motion.div variants={staggerItem} className="mt-4 flex gap-2" role="tablist" aria-label="Filter peringkat">
            {([
              { id: "kelas", label: "Kelas", icon: Medal },
              { id: "sekolah", label: "Sekolah", icon: TrendingUp },
              { id: "mingguan", label: "Mingguan", icon: Calendar },
            ] as { id: Filter; label: string; icon: any }[]).map((f) => {
              const active = filter === f.id;
              return (
                <motion.button
                  key={f.id}
                  role="tab"
                  aria-selected={active}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-btn py-2.5 text-sm font-bold transition-colors cursor-pointer",
                    active ? "bg-sora text-white shadow-soft" : "bg-paper text-ink-soft border border-line hover:border-sora/30",
                  )}
                >
                  <f.icon size={16} />
                  {f.label}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Podium with staggered entrance */}
          <motion.div variants={staggerItem} className="mt-8 flex items-end justify-center gap-3">
            {rankings[filter].top3.map((entry, i) => (
              <motion.div
                key={entry.name}
                className="flex flex-1 flex-col items-center"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Crown for #1 */}
                {entry.rank === 1 && (
                  <motion.span
                    className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-white shadow-soft"
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <Crown size={16} fill="currentColor" />
                  </motion.span>
                )}
                {/* Medal for #2, #3 */}
                {(entry.rank === 2 || entry.rank === 3) && (
                  <span className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-sora-tint-soft text-[11px] font-bold text-sora">
                    #{entry.rank}
                  </span>
                )}
                <div
                  className={
                    "flex w-full flex-col items-center justify-end rounded-t-card transition-all hover:opacity-90 " +
                    (entry.rank === 1 ? "h-36" : entry.rank === 2 ? "h-28" : "h-24")
                  }
                  style={{
                    backgroundColor: entry.color,
                    opacity: entry.rank === 1 ? 1 : 0.85,
                  }}
                >
                  <Avatar name={entry.name} size={entry.rank === 1 ? 48 : 40} className="mb-2" />
                </div>
                <p className="mt-2 text-center text-xs font-bold text-ink">{entry.name.split(" ")[0]}</p>
                <p className="text-[11px] text-ink-soft">{entry.xp.toLocaleString()} XP</p>
              </motion.div>
            ))}
          </motion.div>

          {/* My rank highlighted card */}
          <motion.div variants={staggerItem}>
            <Card className="mt-6 bg-sora-tint-soft border-2 border-sora/20 transition-all hover:shadow-soft-lg" padded>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sora text-sm font-bold text-white">
                  #5
                </span>
                <Avatar name="Ahmad Fauzi" size={36} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink">Kamu</p>
                  <p className="text-xs text-ink-soft"><Flame size={14} className="inline text-sakura" /> 12 hari streak</p>
                </div>
                <span className="text-sm font-bold text-sora">2.450 XP</span>
              </div>
            </Card>
          </motion.div>

          {/* Rest of rankings */}
          <motion.div variants={staggerItem} className="mt-4 space-y-2">
            {rankings[filter].rest.map((r, i) => (
              <motion.div
                key={r.rank}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.4 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card
                  padded
                  className={
                    "transition-all hover:shadow-soft-lg " +
                    (r.me ? "border-2 border-sora bg-sora-tint-soft/30" : "")
                  }
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        "w-7 text-center text-sm font-bold " + (r.me ? "text-sora" : "text-ink-soft")
                      }
                    >
                      {r.rank}
                    </span>
                    <Avatar name={r.name} size={36} />
                    <div className="flex-1">
                      <p className={"text-sm font-semibold " + (r.me ? "text-sora" : "text-ink")}>
                        {r.name}
                        {r.me && (
                          <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-sora/10 px-2 py-0.5 text-[10px] font-bold text-sora">
                            Kamu
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-ink-soft"><Flame size={14} className="inline text-sakura" /> {r.streak} hari</p>
                    </div>
                    <span className="text-sm font-bold text-sora">{r.xp.toLocaleString()} XP</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </AnimatedPage>
    </StudentShell>
  );
}
