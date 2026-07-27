"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Users, BookOpen, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useRouter } from "next/navigation";

const slug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

interface SchoolClass {
  name: string;
  level: string;
  major: string;
  wali: string;
  students: number;
  avg: number;
}

const initialClasses: SchoolClass[] = [
  { name: "XII RPL 1", level: "XII", major: "RPL", wali: "Bu Siti Rahma", students: 28, avg: 72 },
  { name: "XII RPL 2", level: "XII", major: "RPL", wali: "Bu Dewi A.", students: 30, avg: 68 },
  { name: "XI TKJ 1", level: "XI", major: "TKJ", wali: "Pak Eko P.", students: 26, avg: 81 },
  { name: "XII MM 2", level: "XII", major: "MM", wali: "Bu Faridah", students: 24, avg: 76 },
  { name: "X RPL 1", level: "X", major: "RPL", wali: "Bu Ani W.", students: 32, avg: 64 },
];

export default function KelolaKelas() {
  const router = useRouter();
  const [classes, setClasses] = useState(initialClasses);
  const [modal, setModal] = useState(false);
  const [query, setQuery] = useState("");

  const [newLevel, setNewLevel] = useState("X");
  const [newMajor, setNewMajor] = useState("RPL");
  const [newNumber, setNewNumber] = useState("");
  const [newWali, setNewWali] = useState("Bu Siti Rahma");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return classes;
    return classes.filter((c) => c.name.toLowerCase().includes(q) || c.wali.toLowerCase().includes(q));
  }, [classes, query]);

  const totalStudents = classes.reduce((sum, c) => sum + c.students, 0);

  function submitNewClass() {
    if (!newNumber.trim()) return;
    const name = `${newLevel} ${newMajor} ${newNumber.trim()}`;
    setClasses((prev) => [...prev, { name, level: newLevel, major: newMajor, wali: newWali, students: 0, avg: 0 }]);
    setModal(false);
    setNewNumber("");
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink jp-rule">Kelola Kelas</h1>
        <Button size="sm" onClick={() => setModal(true)}>
          <Plus size={15} /> Buat Kelas
        </Button>
      </div>

      <div className="mt-4 flex gap-6 text-sm">
        <p>
          <span className="font-bold text-ink">{classes.length}</span>{" "}
          <span className="text-ink-soft">total kelas</span>
        </p>
        <p>
          <span className="font-bold text-sora">{totalStudents}</span>{" "}
          <span className="text-ink-soft">total murid</span>
        </p>
      </div>

      <div className="relative mt-4 max-w-sm">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
        <Input placeholder="Cari kelas / wali kelas..." className="pl-10" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-4" padded>
          <p className="py-6 text-center text-sm text-ink-soft">
            Tidak ada kelas yang cocok dengan pencarian &ldquo;{query}&rdquo;.
          </p>
        </Card>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Card key={c.name} padded className="transition-shadow duration-150 hover:shadow-soft-lg">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-btn bg-sora text-white">
                  <BookOpen size={20} />
                </span>
                <Badge tone="sora">{c.level}</Badge>
              </div>
              <h3 className="mt-3 text-base font-bold text-ink">{c.name}</h3>
              <p className="text-sm text-ink-soft">Wali: {c.wali}</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-ink-soft">
                <Users size={14} /> {c.students} murid
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-ink-soft">Rata-rata</span>
                  <span className="font-semibold text-sora">{c.avg}%</span>
                </div>
                <ProgressBar value={c.avg} />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 w-full"
                onClick={() => router.push(`/g/kelas/${slug(c.name)}`)}
              >
                <ExternalLink size={15} /> Lihat sebagai Guru
              </Button>
            </Card>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setModal(false)} />
          <Card className="relative z-10 w-full max-w-md" padded>
            <h2 className="text-lg font-bold text-ink">Buat Kelas Baru</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Nomor Kelas</label>
                <Input placeholder="3" value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
                <p className="mt-1 text-xs text-ink-soft">
                  Akan menjadi: <span className="font-semibold text-ink">{newLevel} {newMajor} {newNumber || "…"}</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-ink">Tingkat</label>
                  <Select value={newLevel} onChange={(e) => setNewLevel(e.target.value)}>
                    <option>X</option>
                    <option>XI</option>
                    <option>XII</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-ink">Jurusan</label>
                  <Select value={newMajor} onChange={(e) => setNewMajor(e.target.value)}>
                    <option>RPL</option>
                    <option>TKJ</option>
                    <option>MM</option>
                  </Select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Wali Kelas</label>
                <Select value={newWali} onChange={(e) => setNewWali(e.target.value)}>
                  <option>Bu Siti Rahma</option>
                  <option>Pak Eko Prasetyo</option>
                  <option>Bu Dewi Anggraini</option>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" fullWidth onClick={() => setModal(false)}>
                Batal
              </Button>
              <Button fullWidth onClick={submitNewClass} disabled={!newNumber.trim()}>
                Buat Kelas
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
