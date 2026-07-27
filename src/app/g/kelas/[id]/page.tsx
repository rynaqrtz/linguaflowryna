"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const meta: Record<string, { name: string; total: number; avg: number }> = {
  "xii-rpl-1": { name: "XII RPL 1", total: 28, avg: 72 },
  "xii-rpl-2": { name: "XII RPL 2", total: 30, avg: 68 },
  "xi-tkj-1": { name: "XI TKJ 1", total: 26, avg: 81 },
};

const students = [
  { name: "Ahmad Fauzi", nis: "12345", xp: 2450, streak: 12, prog: 78, quiz: 85, pending: 1, active: "2 jam lalu" },
  { name: "Siti Nurhaliza", nis: "12346", xp: 3120, streak: 18, prog: 91, quiz: 92, pending: 0, active: "10 menit lalu" },
  { name: "Budi Santoso", nis: "12347", xp: 1980, streak: 5, prog: 54, quiz: 64, pending: 2, active: "1 hari lalu" },
  { name: "Rina Maharani", nis: "12348", xp: 2980, streak: 15, prog: 88, quiz: 89, pending: 0, active: "30 menit lalu" },
  { name: "Dewi Lestari", nis: "12349", xp: 2760, streak: 11, prog: 80, quiz: 78, pending: 1, active: "3 hari lalu" },
];

export default function ClassDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const info = meta[params.id] ?? { name: "XII RPL 1", total: 28, avg: 72 };
  return (
    <>
      <div className="flex items-center gap-1 text-sm text-ink-soft">
        <Link href="/g/kelas" className="hover:text-sora">
          Kelas Saya
        </Link>
        <ChevronRight size={14} />
        <span className="font-semibold text-ink">{info.name}</span>
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink jp-rule">{info.name}</h1>
          <p className="text-sm text-ink-soft">{info.total} murid · Rata-rata progress {info.avg}%</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => router.push("/g/tugas")}>
            <Plus size={16} /> Assign Tugas
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.push("/g/kuis")}>
            Buat Kuis
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <Input placeholder="Cari murid..." className="pl-10" />
        </div>
        <Select className="sm:w-56">
          <option>Urutkan: Nama</option>
          <option>Urutkan: XP</option>
          <option>Urutkan: Terakhir Aktif</option>
        </Select>
      </div>

      <Card className="mt-4 hidden overflow-hidden p-0 md:block" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-line bg-sora-tint-soft/40 text-left text-xs font-bold text-ink-soft">
                <th className="px-4 py-3">Murid</th>
                <th className="px-4 py-3">Total XP</th>
                <th className="px-4 py-3">Streak</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Rata² Kuis</th>
                <th className="px-4 py-3">Pending</th>
                <th className="px-4 py-3">Terakhir Aktif</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s.nis}
                  onClick={() => router.push(`/g/kelas/${params.id}/murid?class=${params.id}&nis=${s.nis}&name=${encodeURIComponent(s.name)}`)}
                  className="cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-sora-tint-soft/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} size={36} />
                      <div>
                        <p className="font-semibold text-ink">{s.name}</p>
                        <p className="text-xs text-ink-soft">NIS {s.nis}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-sora">{s.xp.toLocaleString()}</td>
                  <td className="px-4 py-3">{s.streak} hari</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20">
                        <ProgressBar value={s.prog} />
                      </div>
                      <span className="text-xs text-ink-soft">{s.prog}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink">{s.quiz}</td>
                  <td className="px-4 py-3">
                    {s.pending > 0 ? <Badge tone="sakura">{s.pending}</Badge> : <span className="text-ink-soft">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={s.active.includes("hari") ? "text-error" : "text-ink-soft"}>{s.active}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-4 space-y-3 md:hidden">
        {students.map((s) => (
          <Card
            key={s.nis}
            interactive
            padded
            onClick={() => router.push(`/g/kelas/${params.id}/murid?class=${params.id}&nis=${s.nis}&name=${encodeURIComponent(s.name)}`)}
          >
            <div className="flex items-center gap-3">
              <Avatar name={s.name} size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{s.name}</p>
                <p className="text-xs text-ink-soft">NIS {s.nis} · {s.streak} hari streak</p>
              </div>
              {s.pending > 0 ? (
                <Badge tone="sakura">{s.pending} pending</Badge>
              ) : (
                <Badge tone="success">beres</Badge>
              )}
            </div>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-ink-soft">Progress</span>
                <span className="font-semibold text-sora">{s.prog}%</span>
              </div>
              <ProgressBar value={s.prog} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-ink-soft">
              <span>{s.xp.toLocaleString()} XP</span>
              <span>Kuis {s.quiz}</span>
              <span className={s.active.includes("hari") ? "text-error" : ""}>{s.active}</span>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
