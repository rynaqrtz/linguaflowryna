"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Plus, Users, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Input } from "@/components/ui/Input";

const classes = [
  { id: "xii-rpl-1", name: "XII RPL 1", students: 28, avg: 72, attention: 5 },
  { id: "xii-rpl-2", name: "XII RPL 2", students: 30, avg: 68, attention: 3 },
  { id: "xi-tkj-1", name: "XI TKJ 1", students: 26, avg: 81, attention: 1 },
];

const preview = {
  "xii-rpl-1": ["Ahmad Fauzi", "Siti Nurhaliza", "Budi Santoso", "Rina Maharani", "Dewi Lestari"],
  "xii-rpl-2": ["Andi Pratama", "Maya Sari", "Rendi Saputra", "Nina Agustin", "Bayu Setiawan"],
  "xi-tkj-1": ["Fajar Nugroho", "Intan Permata", "Galih Wibowo", "Salsa Aulia", "Dimas Pradana"],
};

export default function ClassList() {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink jp-rule">Kelas Saya</h1>
          <p className="text-sm text-ink-soft">3 kelas · 84 murid aktif minggu ini</p>
        </div>
        <Button size="sm" onClick={() => router.push("/g/tugas")}>
          <Plus size={16} /> Assign Tugas
        </Button>
      </div>

      <div className="relative mt-5">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
        <Input placeholder="Cari kelas..." className="pl-10" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((c) => (
          <Card key={c.id} interactive padded className="flex flex-col">
            <Link href={`/g/kelas/${c.id}`} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-btn bg-sora-tint-soft text-sora">
                  <Users size={20} />
                </div>
                {c.attention > 0 && <Badge tone="gold">{c.attention} perhatian</Badge>}
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">{c.name}</h3>
                <p className="text-sm text-ink-soft">{c.students} murid</p>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-ink-soft">Rata-rata progress</span>
                  <span className="font-semibold text-sora">{c.avg}%</span>
                </div>
                <ProgressBar value={c.avg} />
              </div>
              <div className="mt-1 flex -space-x-2">
                {preview[c.id as keyof typeof preview].slice(0, 5).map((name) => (
                  <Avatar key={name} name={name} size={28} className="ring-2 ring-paper" />
                ))}
              </div>
            </Link>
            {c.attention > 0 && (
              <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3 text-xs font-medium text-sakura">
                <AlertTriangle size={13} />
                {c.attention} murid perlu perhatian
              </div>
            )}
            <Link
              href={`/g/kelas/${c.id}`}
              className="mt-3 flex items-center justify-end gap-1 text-sm font-semibold text-sora hover:underline"
            >
              Buka kelas <ChevronRight size={15} />
            </Link>
          </Card>
        ))}
      </div>
    </>
  );
}
