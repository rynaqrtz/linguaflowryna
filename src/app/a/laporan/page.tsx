"use client";

import { Download, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

const catScores = [
  { cat: "Kata Benda", score: 79 },
  { cat: "Kata Kerja", score: 74 },
  { cat: "Kata Sifat", score: 81 },
  { cat: "Partikel", score: 66 },
  { cat: "Kanji", score: 70 },
];

const students = [
  { name: "Siti Nurhaliza", xp: 3120, avg: 92, done: 100 },
  { name: "Rina Maharani", xp: 2980, avg: 89, done: 96 },
  { name: "Ahmad Fauzi", xp: 2450, avg: 85, done: 88 },
  { name: "Dewi Lestari", xp: 2760, avg: 78, done: 82 },
  { name: "Budi Santoso", xp: 1980, avg: 64, done: 70 },
];

export default function LaporanSekolah() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink jp-rule">Laporan Sekolah</h1>
          <p className="text-sm text-ink-soft">SMK Texar · Semester Ganjil 2026</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => alert("Export PDF belum tersambung ke backend.")}>
            <Download size={15} /> Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => alert("Export CSV belum tersambung ke backend.")}>
            <Download size={15} /> Export CSV
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { k: "Rata-rata Skor", v: "78", highlight: false },
          { k: "Penyelesaian Tugas", v: "85%", highlight: false },
          { k: "Murid Paling Aktif", v: "Siti Nurhaliza", highlight: false },
          { k: "Perlu Perhatian", v: "3 orang", highlight: true },
        ].map((s) => (
          <Card key={s.k} padded className={s.highlight ? "border-sakura/30 bg-sakura-tint-soft/40" : undefined}>
            <p className="text-xs text-ink-soft">{s.k}</p>
            <p className={"mt-1 text-lg font-bold " + (s.highlight ? "text-sakura" : "text-sora")}>{s.v}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-4" padded>
        <h2 className="text-sm font-bold text-ink">Skor Rata-rata per Kategori</h2>
        <div className="mt-4 space-y-3">
          {catScores.map((c) => (
            <div key={c.cat}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-ink-soft">{c.cat}</span>
                <span className="font-semibold text-ink">{c.score}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-sora-tint-soft">
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${c.score}%`,
                    backgroundColor: c.score < 70 ? "var(--color-gold)" : "var(--color-sora)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-4 space-y-3 md:hidden">
        {students.map((s) => (
          <Card key={s.name} padded>
            <div className="flex items-center gap-3">
              <Avatar name={s.name} size={40} />
              <span className="flex-1 truncate font-semibold text-ink">{s.name}</span>
              <Badge tone={s.avg >= 80 ? "success" : "gold"}>{s.avg}</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
              <span className="text-ink-soft">{s.done}% selesai</span>
              <span className="font-bold text-sora">{s.xp.toLocaleString()} XP</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-4 hidden overflow-hidden p-0 md:block" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-line bg-sora-tint-soft/40 text-left text-xs font-bold text-ink-soft">
                <th className="px-4 py-3">Murid</th>
                <th className="px-4 py-3">Total XP</th>
                <th className="px-4 py-3">Rata² Skor</th>
                <th className="px-4 py-3">Penyelesaian</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.name} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} size={32} />
                      <span className="font-semibold text-ink">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-sora">{s.xp.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge tone={s.avg >= 80 ? "success" : "gold"}>{s.avg}</Badge>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{s.done}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
