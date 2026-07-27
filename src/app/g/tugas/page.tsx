"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Layers, FileCheck, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useSchool, type SchoolTask } from "@/lib/school";

const steps = ["Jenis", "Materi", "Target", "Deadline", "Preview"];

const classMap: { name: string; id: string }[] = [
  { name: "XII RPL 1", id: "xii-rpl-1" },
  { name: "XII RPL 2", id: "xii-rpl-2" },
  { name: "XI TKJ 1", id: "xi-tkj-1" },
];

export default function AssignTaskWizard() {
  const router = useRouter();
  const [school, setSchool] = useSchool();
  const [step, setStep] = useState(1);
  const [type, setType] = useState<"flashcard" | "kuis" | null>(null);
  const [level, setLevel] = useState("N5");
  const [category, setCategory] = useState("Kata Kerja");
  const [target, setTarget] = useState("20");
  const [duration, setDuration] = useState("15");
  const [deadline, setDeadline] = useState("2026-07-20");
  const [selectedClass, setSelectedClass] = useState<string | null>("XII RPL 1");

  function handleSubmit() {
    if (!type || !selectedClass) return;
    const cls = classMap.find((c) => c.name === selectedClass)!;
    const task: SchoolTask = {
      id: `t-${Date.now()}`,
      title: type === "kuis" ? `Kuis ${category} ${level}` : `Hafalan ${target} Kata ${level}`,
      type,
      classId: cls.id,
      className: cls.name,
      level,
      category,
      target: Number(target) || 10,
      duration: Number(duration) || 15,
      deadline,
      createdAt: new Date().toISOString().slice(0, 10),
      teacher: "Bu Siti Rahma",
    };
    setSchool((prev) => ({ ...prev, tasks: [task, ...prev.tasks] }));
    router.push("/g/dashboard");
  }

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-ink jp-rule">Assign Tugas</h1>

      <div className="mt-5 flex items-center">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center">
            <div className="flex items-center gap-2">
              <span
                className={
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold " +
                  (i + 1 < step
                    ? "bg-success text-white"
                    : i + 1 === step
                      ? "bg-sora text-white"
                      : "bg-line text-ink-soft")
                }
              >
                {i + 1 < step ? <Check size={16} /> : i + 1}
              </span>
              <span className={"hidden text-xs font-semibold sm:block " + (i + 1 <= step ? "text-ink" : "text-ink-soft")}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className={"mx-2 h-0.5 flex-1 " + (i + 1 < step ? "bg-success" : "bg-line")} />
            )}
          </div>
        ))}
      </div>

      <Card className="mt-6" padded>
        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold tracking-tight text-ink">Jenis & Kelas</h2>
            <p className="text-sm text-ink-soft">Pilih jenis tugas dan kelas tujuan.</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setType("flashcard")}
                className={
                  "flex items-center gap-3 rounded-btn border-2 p-4 text-left transition-colors " +
                  (type === "flashcard" ? "border-sora bg-sora-tint-soft/40" : "border-line")
                }
              >
                <Layers size={24} className="text-sora" />
                <div>
                  <p className="font-bold text-ink">Flashcard Deck</p>
                  <p className="text-xs text-ink-soft">Hafalan vocabulary</p>
                </div>
                {type === "flashcard" && <Check size={18} className="ml-auto text-sora" />}
              </button>
              <button
                onClick={() => setType("kuis")}
                className={
                  "flex items-center gap-3 rounded-btn border-2 p-4 text-left transition-colors " +
                  (type === "kuis" ? "border-sora bg-sora-tint-soft/40" : "border-line")
                }
              >
                <FileCheck size={24} className="text-sora" />
                <div>
                  <p className="font-bold text-ink">Kuis</p>
                  <p className="text-xs text-ink-soft">Pilihan ganda / susun kalimat</p>
                </div>
                {type === "kuis" && <Check size={18} className="ml-auto text-sora" />}
              </button>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-semibold text-ink">Kelas Tujuan</label>
              <div className="flex flex-wrap gap-2">
                {classMap.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClass(c.name)}
                    className={
                      "flex items-center gap-1.5 rounded-btn border px-3 py-2 text-sm font-semibold transition-colors " +
                      (selectedClass === c.name
                        ? "border-sora bg-sora-tint-soft/40 text-sora"
                        : "border-line text-ink-soft")
                    }
                  >
                    <Users size={15} /> {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold tracking-tight text-ink">Pilih Materi Tugas</h2>
            <p className="text-sm text-ink-soft">
              Jenis: <span className="font-semibold text-sora">{type === "kuis" ? "Kuis" : "Flashcard Deck"}</span> · Pilih materi yang akan dikerjakan murid.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Level</label>
                <Select value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option>N5</option>
                  <option>N4</option>
                  <option>N3</option>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Kategori</label>
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Kata Benda</option>
                  <option>Kata Kerja</option>
                  <option>Kata Sifat</option>
                  <option>Partikel</option>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-bold tracking-tight text-ink">Target & Durasi</h2>
            <p className="text-sm text-ink-soft">Tentukan jumlah soal dan estimasi pengerjaan.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Jumlah Soal</label>
                <input
                  type="number"
                  min={1}
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="h-11 w-full rounded-btn border border-line bg-paper px-3 text-sm font-semibold focus:border-sora focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Estimasi (menit)</label>
                <input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="h-11 w-full rounded-btn border border-line bg-paper px-3 text-sm font-semibold focus:border-sora focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-lg font-bold tracking-tight text-ink">Tenggat Waktu</h2>
            <p className="text-sm text-ink-soft">Murid tidak bisa mengumpulkan setelah tenggat.</p>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-semibold text-ink">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="h-11 w-full rounded-btn border border-line bg-paper px-3 text-sm font-semibold focus:border-sora focus:outline-none sm:w-64"
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-lg font-bold tracking-tight text-ink">Preview & Konfirmasi</h2>
            <div className="mt-4 space-y-2 rounded-card bg-sora-tint-soft/40 p-4">
              <Row k="Kelas" v={selectedClass ?? "—"} />
              <Row k="Jenis" v={type === "kuis" ? "Kuis" : "Flashcard Deck"} />
              <Row k="Materi" v={`${category} ${level}`} />
              <Row k="Target" v={`${target} soal · ${duration} menit`} />
              <Row k="Deadline" v={new Date(deadline).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} />
            </div>
          </div>
        )}
      </Card>

      <div className="sticky bottom-0 z-10 mt-6 flex gap-3 border-t border-line bg-warm-white pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 md:pb-4">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          Kembali
        </Button>
        {step < 5 ? (
          <Button className="flex-1" onClick={() => setStep((s) => Math.min(5, s + 1))}>
            Lanjut
          </Button>
        ) : (
          <Button className="flex-1" onClick={handleSubmit}>
            Kirim Tugas
          </Button>
        )}
      </div>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-ink-soft">{k}</span>
      <span className="font-semibold text-ink">{v}</span>
    </div>
  );
}
