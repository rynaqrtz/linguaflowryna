"use client";

import { Download, TrendingUp, CheckCircle2, Award, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

const catScores = [
  { cat: "Kata Benda", score: 82 },
  { cat: "Kata Kerja", score: 75 },
  { cat: "Kata Sifat", score: 80 },
  { cat: "Partikel", score: 68 },
  { cat: "Kanji", score: 71 },
];

const students = [
  { name: "Siti Nurhaliza", xp: 3120, avg: 92, done: 100 },
  { name: "Rina Maharani", xp: 2980, avg: 89, done: 96 },
  { name: "Ahmad Fauzi", xp: 2450, avg: 85, done: 88 },
  { name: "Dewi Lestari", xp: 2760, avg: 78, done: 82 },
  { name: "Budi Santoso", xp: 1980, avg: 64, done: 70 },
];

export default function TeacherReport() {
  function exportCsv() {
    const header = "Murid,Total XP,Rata-rata Skor,Penyelesaian\n";
    const rows = students
      .map((s) => `${s.name},${s.xp},${s.avg},${s.done}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "laporan-xii-rpl-1.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink jp-rule">Laporan</h1>
          <p className="text-sm text-ink-soft">XII RPL 1 · Semester Ganjil 2026</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download size={15} /> Export CSV
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { k: "Rata-rata Skor", v: "78", icon: TrendingUp },
          { k: "Penyelesaian Tugas", v: "85%", icon: CheckCircle2 },
          { k: "Murid Paling Aktif", v: "Siti", icon: Award },
          { k: "Perlu Perhatian", v: "3", icon: AlertTriangle },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.k} padded>
              <Icon size={18} className="text-sora/60" />
              <p className="mt-2 text-xs text-ink-soft">{s.k}</p>
              <p className="mt-0.5 text-lg font-bold text-sora">{s.v}</p>
            </Card>
          );
        })}
      </div>

      <Card className="mt-4" padded>
        <h2 className="text-sm font-bold tracking-tight text-ink">Rata-rata Skor per Kategori</h2>
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
                    backgroundColor: c.score < 70 ? "var(--color-gold-app)" : "var(--color-sora)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

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

      <div className="mt-4 space-y-3 md:hidden">
        {students.map((s) => (
          <Card key={s.name} padded>
            <div className="flex items-center gap-3">
              <Avatar name={s.name} size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{s.name}</p>
                <p className="text-xs text-ink-soft">{s.xp.toLocaleString()} XP</p>
              </div>
              <Badge tone={s.avg >= 80 ? "success" : "gold"}>{s.avg}</Badge>
            </div>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-ink-soft">Penyelesaian</span>
                <span className="font-semibold text-sora">{s.done}%</span>
              </div>
              <ProgressBar value={s.done} />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
