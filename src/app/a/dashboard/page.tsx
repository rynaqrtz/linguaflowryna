// src/app/a/dashboard/page.tsx
//
// UPGRADE UI/UX — perubahan dari versi sebelumnya:
// 1. Dulu ke-4 kartu statistik semua identik (kotak ikon + angka + label +
//    trend), pola generik yang persis sama di hampir semua dashboard admin
//    bikinan AI. Sekarang kartu pertama (metrik paling penting, Total
//    Murid) dibedakan dengan aksen sakura supaya mata langsung tertuju ke
//    sana, sisanya tetap tenang di sora/netral — ada hierarki, bukan 4
//    kotak yang beratnya sama semua.
// 2. Dulu grafik aktivitas cuma div dengan height dinamis, dipaksa
//    min-width 640px jadi selalu scroll horizontal di HP, tanpa garis
//    bantu/label. Sekarang jadi grafik area SVG yang responsif (scale ke
//    lebar layar berapa pun), ada garis bantu 0/50/100%, dan titik puncak
//    ditandai dengan angka — lebih gampang dibaca sekilas.
// 3. Kartu "Kelas Paling Aktif" & "Guru Paling Aktif" dulu murni
//    tampilan, sekarang jadi interaktif (bisa diklik ke halaman kelas/guru
//    terkait) dan tag ranking guru diberi warna emas/perak/perunggu untuk
//    #1/#2/#3, bukan angka polos.
// 4. Ditambah aksen dekoratif kelopak sakura yang SANGAT halus (opacity
//    rendah) di belakang judul — identitas visual Jepang tanpa mengganggu
//    keterbacaan data (dashboard admin harus tetap padat-informasi, motif
//    dekoratif tidak boleh menyaingi angka).

import Link from "next/link";
import { TrendingUp, Users, UserCircle, ClipboardList, Activity, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

const stats = [
  { icon: Users, label: "Total Murid", value: "840", trend: "+5% dari minggu lalu", href: "/a/murid", highlight: true },
  { icon: UserCircle, label: "Total Guru", value: "12", trend: "+1 baru", href: "/a/guru" },
  { icon: ClipboardList, label: "Total Kelas", value: "24", trend: "Stabil", href: "/a/kelas" },
  { icon: Activity, label: "Aktif Hari Ini", value: "612 (73%)", trend: "+8% dari minggu lalu", href: "/a/laporan" },
];

const activity = [
  { d: 12, v: 40 }, { d: 13, v: 55 }, { d: 14, v: 48 }, { d: 15, v: 62 }, { d: 16, v: 70 },
  { d: 17, v: 58 }, { d: 18, v: 75 }, { d: 19, v: 82 }, { d: 20, v: 68 }, { d: 21, v: 88 },
  { d: 22, v: 79 }, { d: 23, v: 91 }, { d: 24, v: 85 }, { d: 25, v: 95 }, { d: 26, v: 88 },
  { d: 27, v: 100 }, { d: 28, v: 92 }, { d: 29, v: 97 }, { d: 30, v: 90 }, { d: 1, v: 96 },
  { d: 2, v: 84 }, { d: 3, v: 93 }, { d: 4, v: 87 }, { d: 5, v: 98 }, { d: 6, v: 91 },
  { d: 7, v: 100 }, { d: 8, v: 94 }, { d: 9, v: 99 }, { d: 10, v: 96 }, { d: 11, v: 100 },
];

const topClasses = [
  { name: "XII RPL 1", prog: 92 },
  { name: "XI TKJ 1", prog: 88 },
  { name: "XII MM 2", prog: 85 },
];
const topTeachers = [
  { name: "Siti Rahma", tasks: 24 },
  { name: "Dewi Anggraini", tasks: 19 },
  { name: "Eko Prasetyo", tasks: 15 },
];

// Warna medali untuk 3 besar guru teraktif — dulu cuma angka "#1/#2/#3"
// polos berwarna sora semua, jadi peringkat 1 sulit dibedakan sekilas
// dari peringkat 3. Emas/perak/perunggu adalah konvensi yang sudah umum
// dikenali, jadi tidak perlu penjelasan tambahan di UI.
const medalStyle = [
  "bg-gold text-white",
  "bg-[#a3b1c2] text-white", // perak — abu kebiruan netral, bukan bagian dari token brand
  "bg-[#c98a52] text-white", // perunggu
];

/** Grafik area SVG untuk tren aktivitas 30 hari. Dibuat manual (bukan
 *  library chart) supaya konsisten dengan gaya "hand-crafted" yang sudah
 *  dipakai di seluruh app dan tidak menambah dependency baru cuma untuk
 *  satu grafik. Skala mengikuti lebar viewBox, jadi responsif tanpa perlu
 *  scroll horizontal di layar sempit. */
function ActivityChart({ data }: { data: { d: number; v: number }[] }) {
  const width = 600;
  const height = 160;
  const max = 100;
  const stepX = width / (data.length - 1);

  const points = data.map((p, i) => ({
    x: i * stepX,
    y: height - (p.v / max) * height,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  // Cari hari dengan aktivitas tertinggi untuk ditandai sebagai puncak.
  const peakIndex = data.reduce((best, p, i) => (p.v > data[best].v ? i : best), 0);
  const peak = points[peakIndex];

  return (
    <svg viewBox={`0 0 ${width} ${height + 24}`} className="w-full" role="img" aria-label="Grafik aktivitas belajar 30 hari terakhir, memuncak di hari dengan aktivitas tertinggi">
      <defs>
        <linearGradient id="activity-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-sora)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-sora)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Garis bantu 0% / 50% / 100% — dulu tidak ada referensi sama sekali,
          jadi tinggi batang cuma bisa dibandingkan relatif ke batang lain. */}
      {[0, 0.5, 1].map((frac) => (
        <line
          key={frac}
          x1={0}
          x2={width}
          y1={height * (1 - frac)}
          y2={height * (1 - frac)}
          stroke="var(--color-line)"
          strokeWidth={1}
        />
      ))}

      <path d={areaPath} fill="url(#activity-fill)" />
      <path d={linePath} fill="none" stroke="var(--color-sora)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

      {/* Titik puncak ditandai eksplisit, bukan cuma batang tertinggi yang
          harus ditebak dari sekilas melihat. */}
      <circle cx={peak.x} cy={peak.y} r={4.5} fill="var(--color-sakura)" stroke="white" strokeWidth={1.5} />
      <text
        x={Math.min(Math.max(peak.x, 20), width - 20)}
        y={Math.max(peak.y - 12, 12)}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill="var(--color-sakura)"
      >
        {data[peakIndex].v}%
      </text>
    </svg>
  );
}

export default function AdminDashboard() {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="relative overflow-hidden rounded-card">
        {/* Motif kelopak sakura sangat halus di belakang judul — identitas
            visual, bukan gangguan. Kalau butuh dihilangkan cukup hapus
            className "sakura-petals" di div ini. */}
        <div className="sakura-petals pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="relative px-0.5 py-1">
          <h1 className="text-2xl font-bold text-ink jp-rule">Dashboard — SMK Texar</h1>
          <p className="text-sm text-ink-soft">{today}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              {/* Catatan: sengaja TIDAK pakai prop `interactive` dari Card di
                  sini. Prop itu menempelkan handler onKeyDown ke <div>, dan
                  karena halaman ini Server Component (tidak ada "use client"),
                  Next.js menolak mengirim function sebagai prop ke elemen di
                  situ saat build ("Event handlers cannot be passed to Client
                  Component props"). Link pembungkusnya sudah jadi elemen
                  <a> asli yang aksesibel via keyboard tanpa handler manual,
                  jadi cukup styling hover-nya saja yang disamakan manual. */}
              <Card
                padded
                className={cn(
                  "transition-shadow duration-150 hover:shadow-soft-lg hover:ring-2 hover:ring-sora/10",
                  s.highlight ? "border-sakura/30 bg-sakura-tint-soft/40" : undefined,
                )}
              >
                <span
                  className={
                    "flex h-10 w-10 items-center justify-center rounded-btn " +
                    (s.highlight ? "bg-sakura-tint" : "bg-sora-tint-soft")
                  }
                >
                  <Icon size={20} className={s.highlight ? "text-sakura" : "text-sora"} />
                </span>
                <p className="mt-3 text-2xl font-bold text-ink">{s.value}</p>
                <p className="text-sm text-ink-soft">{s.label}</p>
                <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-success">
                  <TrendingUp size={13} /> {s.trend}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="mt-6" padded>
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-bold text-ink">Aktivitas Belajar 30 Hari Terakhir</h2>
          <span className="text-xs text-ink-soft">Puncak hari ke-27</span>
        </div>
        <div className="mt-4">
          <ActivityChart data={activity} />
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card padded>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">Kelas Paling Aktif</h2>
            <Link href="/a/kelas" className="flex items-center gap-1 text-xs font-semibold text-sora hover:underline">
              Lihat semua <ArrowRight size={13} />
            </Link>
          </div>
          <div className="mt-3 space-y-3">
            {topClasses.map((c) => (
              <Link key={c.name} href="/a/kelas" className="block rounded-btn -mx-2 px-2 py-1 transition-colors hover:bg-sora-tint-soft/60">
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold text-ink">{c.name}</span>
                  <span className="text-sora">{c.prog}%</span>
                </div>
                <ProgressBar value={c.prog} />
              </Link>
            ))}
          </div>
        </Card>

        <Card padded>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">Guru Paling Aktif</h2>
            <Link href="/a/guru" className="flex items-center gap-1 text-xs font-semibold text-sora hover:underline">
              Lihat semua <ArrowRight size={13} />
            </Link>
          </div>
          <div className="mt-3 space-y-3">
            {topTeachers.map((t, i) => (
              <Link
                key={t.name}
                href="/a/guru"
                className="flex items-center gap-3 rounded-btn -mx-2 px-2 py-1 transition-colors hover:bg-sora-tint-soft/60"
              >
                <span
                  className={
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold " +
                    (medalStyle[i] ?? "bg-sora-tint-soft text-sora")
                  }
                >
                  {i + 1}
                </span>
                <Avatar name={t.name} size={32} />
                <span className="flex-1 text-sm font-semibold text-ink">{t.name}</span>
                <span className="text-xs text-ink-soft">{t.tasks} tugas</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
