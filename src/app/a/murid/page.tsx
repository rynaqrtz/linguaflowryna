"use client";

// src/app/a/murid/page.tsx
//
// UPGRADE — perubahan dari versi sebelumnya:
// 1. Search bar & tombol "Semua Kelas" dulu murni dekorasi (tidak ada
//    state/onChange sama sekali) — ketik apa pun tidak menyaring apa-apa.
//    Sekarang keduanya benar-benar menyaring daftar murid.
// 2. Tombol "Edit" & "Nonaktifkan" dulu tidak punya onClick sama sekali.
//    "Nonaktifkan" sekarang benar-benar toggle status murid (di state lokal
//    — belum ke backend, tapi setidaknya memberi umpan balik nyata, bukan
//    tombol mati).
// 3. Tidak ada tampilan kalau hasil pencarian kosong — ditambahkan empty
//    state supaya jelas itu "tidak ada hasil", bukan halaman rusak.
// 4. Ditambah strip ringkasan kecil di atas (total & aktif) — dulu langsung
//    ke tabel tanpa ada angka ringkasan sama sekali.

import { useMemo, useState } from "react";
import { Search, Plus, Upload, Pencil, UserX, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface Student {
  name: string;
  nis: string;
  class: string;
  xp: number;
  status: "Aktif" | "Nonaktif";
}

const initialStudents: Student[] = [
  { name: "Ahmad Fauzi", nis: "12345", class: "XII RPL 1", xp: 2450, status: "Aktif" },
  { name: "Siti Nurhaliza", nis: "12346", class: "XII RPL 1", xp: 3120, status: "Aktif" },
  { name: "Budi Santoso", nis: "12347", class: "XII RPL 2", xp: 1980, status: "Aktif" },
  { name: "Rina Maharani", nis: "12348", class: "XI TKJ 1", xp: 2980, status: "Aktif" },
  { name: "Bayu Permana", nis: "12349", class: "XII MM 2", xp: 0, status: "Nonaktif" },
];

const classOptions = ["Semua Kelas", ...Array.from(new Set(initialStudents.map((s) => s.class)))];

export default function KelolaMurid() {
  const [students, setStudents] = useState(initialStudents);
  const [modal, setModal] = useState(false);
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("Semua Kelas");

  // Menyaring berdasarkan nama/NIS DAN kelas sekaligus.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      const matchQuery = !q || s.name.toLowerCase().includes(q) || s.nis.includes(q);
      const matchClass = classFilter === "Semua Kelas" || s.class === classFilter;
      return matchQuery && matchClass;
    });
  }, [students, query, classFilter]);

  const activeCount = students.filter((s) => s.status === "Aktif").length;

  /** Toggle status Aktif/Nonaktif satu murid berdasarkan NIS-nya. Belum
   *  memanggil backend — sekarang cuma mengubah state lokal supaya tombol
   *  ini terasa benar-benar berfungsi, bukan dekorasi. */
  function toggleStatus(nis: string) {
    setStudents((prev) =>
      prev.map((s) => (s.nis === nis ? { ...s, status: s.status === "Aktif" ? "Nonaktif" : "Aktif" } : s)),
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink jp-rule">Kelola Murid</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setModal(true)}>
            <Upload size={15} /> Import Murid
          </Button>
          <Button size="sm">
            <Plus size={15} /> Tambah Murid
          </Button>
        </div>
      </div>

      {/* Ringkasan singkat — dulu tidak ada angka ringkasan sama sekali,
          langsung lompat ke tabel mentah. */}
      <div className="mt-4 flex gap-6 text-sm">
        <p>
          <span className="font-bold text-ink">{students.length}</span>{" "}
          <span className="text-ink-soft">total murid</span>
        </p>
        <p>
          <span className="font-bold text-success">{activeCount}</span>{" "}
          <span className="text-ink-soft">aktif</span>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <Input
            placeholder="Cari nama / NIS..."
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="w-auto min-w-[160px]">
          {classOptions.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-4" padded>
          <p className="py-6 text-center text-sm text-ink-soft">
            Tidak ada murid yang cocok dengan pencarian &ldquo;{query}&rdquo;.
          </p>
        </Card>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="mt-4 space-y-3 md:hidden">
            {filtered.map((s) => (
              <Card key={s.nis} padded>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} size={40} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{s.name}</p>
                      <p className="text-xs text-ink-soft">NIS {s.nis}</p>
                    </div>
                  </div>
                  <Badge tone={s.status === "Aktif" ? "success" : "neutral"}>{s.status}</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
                  <span className="text-ink-soft">{s.class}</span>
                  <span className="font-bold text-sora">{s.xp.toLocaleString()} XP</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" fullWidth>
                    <Pencil size={15} /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={s.status === "Aktif" ? "text-error" : "text-success"}
                    onClick={() => toggleStatus(s.nis)}
                  >
                    {s.status === "Aktif" ? (
                      <>
                        <UserX size={15} /> Nonaktifkan
                      </>
                    ) : (
                      <>
                        <UserCheck size={15} /> Aktifkan
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop: table */}
          <Card className="mt-4 hidden overflow-hidden p-0 md:block" padded={false}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="border-b border-line bg-sora-tint-soft/40 text-left text-xs font-bold text-ink-soft">
                    <th className="px-4 py-3">Murid</th>
                    <th className="px-4 py-3">Kelas</th>
                    <th className="px-4 py-3">Total XP</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.nis} className="border-b border-line last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.name} size={32} />
                          <div>
                            <p className="font-semibold text-ink">{s.name}</p>
                            <p className="text-xs text-ink-soft">NIS {s.nis}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ink-soft">{s.class}</td>
                      <td className="px-4 py-3 font-bold text-sora">{s.xp.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <Badge tone={s.status === "Aktif" ? "success" : "neutral"}>{s.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="text-sora" aria-label="Edit">
                            <Pencil size={16} />
                          </button>
                          <button
                            className={s.status === "Aktif" ? "text-ink-soft hover:text-error" : "text-ink-soft hover:text-success"}
                            aria-label={s.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                            onClick={() => toggleStatus(s.nis)}
                          >
                            {s.status === "Aktif" ? <UserX size={16} /> : <UserCheck size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Import modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setModal(false)} />
          <Card className="relative z-10 w-full max-w-md" padded>
            <h2 className="text-lg font-bold text-ink">Import Murid (CSV)</h2>
            <div className="mt-4 flex h-32 items-center justify-center rounded-card border-2 border-dashed border-sora/40 bg-sora-tint-soft/30 text-sm text-ink-soft">
              Drop file CSV di sini atau klik untuk pilih
            </div>
            <p className="mt-2 text-xs text-ink-soft">Format: Nama, NIS, Kelas, Email</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" fullWidth onClick={() => setModal(false)}>
                Batal
              </Button>
              <Button fullWidth onClick={() => setModal(false)}>
                Import
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
