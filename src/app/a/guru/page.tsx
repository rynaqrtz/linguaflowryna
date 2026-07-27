"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Upload, Pencil, UserX, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

interface Teacher {
  name: string;
  email: string;
  classes: string[];
  students: number;
  status: "Aktif" | "Nonaktif";
}

const initialTeachers: Teacher[] = [
  { name: "Siti Rahma", email: "siti.rahma@smkn.sch.id", classes: ["XII RPL 1", "XII RPL 2"], students: 58, status: "Aktif" },
  { name: "Dewi Anggraini", email: "dewi.a@smkn.sch.id", classes: ["XI TKJ 1"], students: 26, status: "Aktif" },
  { name: "Eko Prasetyo", email: "eko.p@smkn.sch.id", classes: ["XII MM 2"], students: 30, status: "Aktif" },
  { name: "Farid Nurhadi", email: "farid.n@smkn.sch.id", classes: [], students: 0, status: "Nonaktif" },
];

export default function KelolaGuru() {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [modal, setModal] = useState(false);

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter((t) => t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q));
  }, [teachers, query]);

  function toggleStatus(email: string) {
    setTeachers((prev) =>
      prev.map((t) => (t.email === email ? { ...t, status: t.status === "Aktif" ? "Nonaktif" : "Aktif" } : t)),
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink jp-rule">Kelola Guru</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => alert("Import CSV")}>
            <Upload size={15} /> Import CSV
          </Button>
          <Button size="sm" onClick={() => setModal(true)}>
            <Plus size={15} /> Tambah Guru
          </Button>
        </div>
      </div>

      <div className="mt-4 flex gap-6 text-sm">
        <p>
          <span className="font-bold text-ink">{teachers.length}</span>{" "}
          <span className="text-ink-soft">total guru</span>
        </p>
        <p>
          <span className="font-bold text-success">{teachers.filter((t) => t.status === "Aktif").length}</span>{" "}
          <span className="text-ink-soft">aktif</span>
        </p>
      </div>

      <div className="relative mt-4 max-w-sm">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
        <Input placeholder="Cari guru..." className="pl-10" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {filtered.length === 0 && (
        <Card className="mt-4" padded>
          <p className="py-6 text-center text-sm text-ink-soft">
            Tidak ada guru yang cocok dengan pencarian &ldquo;{query}&rdquo;.
          </p>
        </Card>
      )}

      <div className="mt-4 space-y-3 md:hidden">
        {filtered.map((t) => (
          <Card key={t.email} padded>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar name={t.name} size={40} />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{t.name}</p>
                  <p className="truncate text-xs text-ink-soft">{t.email}</p>
                </div>
              </div>
              <Badge tone={t.status === "Aktif" ? "success" : "neutral"}>{t.status}</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
              <span className="text-ink-soft">{t.students} murid</span>
              <div className="flex flex-wrap justify-end gap-1">
                {t.classes.length ? (
                  t.classes.map((c) => (
                    <Badge key={c} tone="sora">
                      {c}
                    </Badge>
                  ))
                ) : (
                  <span className="text-ink-soft">—</span>
                )}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" fullWidth>
                <Pencil size={15} /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={t.status === "Aktif" ? "text-error" : "text-success"}
                onClick={() => toggleStatus(t.email)}
              >
                {t.status === "Aktif" ? (
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

      <Card className="mt-4 hidden overflow-hidden p-0 md:block" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-line bg-sora-tint-soft/40 text-left text-xs font-bold text-ink-soft">
                <th className="px-4 py-3">Guru</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3">Murid</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.email} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={t.name} size={32} />
                      <span className="font-semibold text-ink">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{t.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {t.classes.length ? (
                        t.classes.map((c) => (
                          <Badge key={c} tone="sora">
                            {c}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-ink-soft">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink">{t.students}</td>
                  <td className="px-4 py-3">
                    <Badge tone={t.status === "Aktif" ? "success" : "neutral"}>{t.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-sora" aria-label="Edit">
                        <Pencil size={16} />
                      </button>
                      <button
                        className={t.status === "Aktif" ? "text-ink-soft hover:text-error" : "text-ink-soft hover:text-success"}
                        aria-label={t.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                        onClick={() => toggleStatus(t.email)}
                      >
                        {t.status === "Aktif" ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setModal(false)} />
          <Card className="relative z-10 w-full max-w-md" padded>
            <h2 className="text-lg font-bold text-ink">Tambah Guru</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Nama</label>
                <Input placeholder="Nama lengkap" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Email</label>
                <Input type="email" placeholder="guru@smkn.sch.id" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Assign ke Kelas</label>
                <div className="flex flex-wrap gap-2">
                  {["XII RPL 1", "XII RPL 2", "XI TKJ 1", "XII MM 2"].map((c) => (
                    <button key={c} className="rounded-full border border-sora px-3 py-1 text-xs font-semibold text-sora">
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-soft">Guru akan menerima email untuk set password.</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" fullWidth onClick={() => setModal(false)}>
                Batal
              </Button>
              <Button fullWidth onClick={() => setModal(false)}>
                Kirim Undangan
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
