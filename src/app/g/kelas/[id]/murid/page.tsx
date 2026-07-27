"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Send, Flame, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useSchool } from "@/lib/school";

const activity = [20, 35, 28, 45, 60, 40, 75, 55, 80, 65, 90, 70, 85, 100];
const breakdown = [
  { cat: "Kata Benda", done: 32, total: 50 },
  { cat: "Kata Kerja", done: 20, total: 40 },
  { cat: "Kata Sifat", done: 15, total: 30 },
  { cat: "Partikel", done: 8, total: 20 },
];

function StudentProgressModal() {
  const router = useRouter();
  const params = useSearchParams();
  const classId = params.get("class") ?? "xii-rpl-1";
  const nis = params.get("nis") ?? "12345";
  const name = params.get("name") ?? "Ahmad Fauzi";
  const [school, setSchool] = useSchool();
  const [tab, setTab] = useState<"ringkasan" | "kuis" | "ucapan" | "feedback">("ringkasan");
  const [feedback, setFeedback] = useState("");
  const [sent, setSent] = useState(false);

  const existing = school.submissions.find((s) => s.studentNis === nis && s.classId === classId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
      <Card className="relative z-10 max-h-[90vh] w-full max-w-[640px] overflow-y-auto p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] md:p-6" padded={false}>
        <button
          onClick={() => router.back()}
          className="absolute right-4 top-4 text-ink-soft"
          aria-label="Tutup"
        >
          <X size={22} />
        </button>

        <div className="flex items-center gap-4">
          <Avatar name={name} size={56} />
          <div>
            <h2 className="text-xl font-bold text-ink">{name}</h2>
            <p className="text-sm text-ink-soft">NIS {nis} · XII RPL 1</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-btn bg-sora-tint-soft p-2">
            <p className="flex items-center justify-center gap-1 text-sm font-bold text-sora">
              <Flame size={14} className="text-gold-app" /> 12
            </p>
            <p className="text-[10px] text-ink-soft">Streak</p>
          </div>
          <div className="rounded-btn bg-sora-tint-soft p-2">
            <p className="text-sm font-bold text-sora">2.450</p>
            <p className="text-[10px] text-ink-soft">XP</p>
          </div>
          <div className="rounded-btn bg-sora-tint-soft p-2">
            <p className="text-sm font-bold text-sora">N5 (78%)</p>
            <p className="text-[10px] text-ink-soft">Level</p>
          </div>
        </div>

        <div className="mt-3">
          <ProgressBar value={78} color="sora" height={10} />
        </div>

        <div className="mt-5 flex gap-1 overflow-x-auto rounded-btn bg-sora-tint-soft/50 p-1">
          {([
            { id: "ringkasan", label: "Ringkasan" },
            { id: "kuis", label: "Riwayat Kuis" },
            { id: "ucapan", label: "Riwayat Ucapan" },
            { id: "feedback", label: "Feedback" },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                "whitespace-nowrap flex-1 rounded-[0.5rem] px-3 py-2 text-sm font-semibold transition-colors " +
                (tab === t.id
                  ? "bg-paper text-sora shadow-soft"
                  : "text-ink-soft hover:text-ink")
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tab === "ringkasan" && (
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-bold text-ink">Aktivitas 14 Hari</p>
                <div className="flex items-end gap-1.5">
                  {activity.map((v, i) => (
                    <div key={i} className="flex-1 rounded-t-sm bg-sora/70" style={{ height: `${v * 0.5}px` }} />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-bold text-ink">Kata per Kategori</p>
                <div className="space-y-2">
                  {breakdown.map((b) => (
                    <div key={b.cat}>
                      <div className="mb-0.5 flex justify-between text-xs">
                        <span className="text-ink-soft">{b.cat}</span>
                        <span className="text-ink">{b.done}/{b.total}</span>
                      </div>
                      <ProgressBar value={Math.round((b.done / b.total) * 100)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tab === "kuis" && (
            <div className="space-y-2">
              {["Kuis Kata Kerja Bab 3 — 85", "Hafalan Partikel — 92", "Kuis Harian N5 — 78"].map((q) => (
                <div key={q} className="rounded-btn bg-sora-tint-soft/40 px-3 py-2 text-sm text-ink">
                  {q}
                </div>
              ))}
            </div>
          )}
          {tab === "ucapan" && (
            <div className="space-y-2">
              {["私は学生です — 85", "これは本です — 78", "私の名前は— 90"].map((q) => (
                <div key={q} className="rounded-btn bg-sora-tint-soft/40 px-3 py-2 text-sm text-ink">
                  {q}
                </div>
              ))}
            </div>
          )}
          {tab === "feedback" && (
            <div>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={`Tulis feedback untuk ${name}...`}
                className="w-full rounded-btn border border-line bg-warm-white p-3 text-sm focus:border-sora focus:outline-none"
              />
              {sent && (
                <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-success">
                  <Check size={14} /> Feedback terkirim
                </p>
              )}
              <Button
                className="mt-2"
                size="sm"
                disabled={!feedback.trim()}
                onClick={() => {
                  if (existing) {
                    setSchool((prev) => ({
                      ...prev,
                      submissions: prev.submissions.map((s) =>
                        s.id === existing.id ? { ...s, note: feedback } : s,
                      ),
                    }));
                  }
                  setSent(true);
                }}
              >
                <Send size={15} /> Kirim Feedback
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <StudentProgressModal />
    </Suspense>
  );
}
