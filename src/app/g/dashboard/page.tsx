"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, ClipboardList, AlertTriangle, FileCheck, Plus, FileQuestion } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { useTimeGreeting } from "@/lib/time-greeting";
import { TeacherBell } from "@/components/layout/TeacherBell";
import { useUser } from "@/lib/user-context";

const summary = [
  { icon: Users, label: "Kelas Diajar", value: "3", hint: "XII RPL 1 · XII RPL 2 · XI TKJ 1" },
  { icon: ClipboardList, label: "Total Murid", value: "84", hint: "Aktif minggu ini" },
  { icon: AlertTriangle, label: "Tugas Aktif", value: "12", hint: "5 menunggu review" },
];

const classes = [
  { name: "XII RPL 1", students: 28, avg: 72, attention: 5 },
  { name: "XII RPL 2", students: 30, avg: 68, attention: 3 },
  { name: "XI TKJ 1", students: 26, avg: 81, attention: 1 },
];

const reviews = [
  { task: "Latihan Ucapan 3", newCount: 12 },
  { task: "Kuis Partikel N5", newCount: 8 },
  { task: "Hafalan Kanji Bab 2", newCount: 5 },
];

const activity = [42, 55, 38, 61, 73, 58, 82];
const dayLabels = ["S", "S", "R", "K", "J", "S", "M"];

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const peak = data.indexOf(max);
  return (
    <div>
      <div className="flex h-14 items-end gap-1.5">
        {data.map((v, i) => (
          <div key={i} className="group relative flex-1">
            <div
              className={
                "w-full rounded-t-md bg-gradient-to-t transition-all " +
                (i === peak ? "from-sora/50 to-sora" : "from-sora/25 to-sora/70")
              }
              style={{ height: `${(v / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {dayLabels.map((d, i) => (
          <span
            key={i}
            className={
              "flex-1 text-center text-[10px] " +
              (i === peak ? "font-semibold text-sora" : "text-ink-soft/70")
            }
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const router = useRouter();
  const timeGreeting = useTimeGreeting();
  const { user } = useUser();

  const teacherName = user?.name ?? "Guru";
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="relative overflow-hidden rounded-card">
        <div className="sakura-petals pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink jp-rule">{timeGreeting.greeting}, {teacherName}</h1>
            <p className="mt-1 text-sm text-ink-soft">{today}</p>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <TeacherBell />
            <Button size="sm" fullWidth onClick={() => router.push("/g/tugas")}>
              <Plus size={16} /> Assign Tugas
            </Button>
            <Button size="sm" variant="outline" fullWidth onClick={() => router.push("/g/kuis")}>
              <FileQuestion size={16} /> Buat Kuis
            </Button>
          </div>
        </div>
      </div>

      <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
        Ikhtisar
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summary.map((s) => {
          const Icon = s.icon;
          const warn = s.label === "Tugas Aktif";
          return (
            <Card key={s.label} className="flex items-center gap-4 transition-shadow hover:shadow-soft-lg">
              <span
                className={
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-btn " +
                  (warn ? "bg-sakura/10" : "bg-sora-tint-soft")
                }
              >
                <Icon size={22} className={warn ? "text-sakura" : "text-sora"} />
              </span>
              <div className="min-w-0">
                <p className="text-2xl font-bold leading-none text-ink">{s.value}</p>
                <p className="mt-1 text-sm font-semibold text-ink">{s.label}</p>
                <p className="truncate text-xs text-ink-soft">{s.hint}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-ink">Kelas Saya</h2>
            <Link href="/g/kelas" className="text-sm font-semibold text-sora hover:underline">
              Lihat semua
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {classes.map((c) => (
              <Card key={c.name} interactive padded>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-ink">{c.name}</h3>
                  {c.attention > 0 && <Badge tone="gold">{c.attention} perhatian</Badge>}
                </div>
                <p className="mt-1 text-sm text-ink-soft">{c.students} murid</p>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-ink-soft">Rata-rata penyelesaian</span>
                    <span className="font-semibold text-sora">{c.avg}%</span>
                  </div>
                  <ProgressBar value={c.avg} />
                </div>
                {c.attention > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3 text-xs font-medium text-sakura">
                    <AlertTriangle size={13} />
                    {c.attention} murid perlu perhatian
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h2 className="mb-3 text-lg font-bold tracking-tight text-ink">Tugas Perlu Direview</h2>
            <div className="flex flex-col gap-3">
              {reviews.map((r) => (
                <Card key={r.task} padded>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-sora-tint-soft">
                      <FileCheck size={18} className="text-sora" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink">{r.task}</p>
                      <p className="mt-0.5 text-sm text-ink-soft">
                        <span className="font-bold text-sakura">{r.newCount}</span> submission baru
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => router.push("/g/kelas/murid")}>
                    Review
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          <Card padded>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-ink">Aktivitas Kelas</p>
              <span className="text-xs text-ink-soft">7 hari terakhir</span>
            </div>
            <div className="mt-4">
              <Sparkline data={activity} />
            </div>
            <p className="mt-3 text-xs text-ink-soft">
              Puncak engagement hari ini: <span className="font-semibold text-sora">82%</span> murid aktif
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
