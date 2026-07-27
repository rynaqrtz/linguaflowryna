"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { BottomSheet } from "@/components/ui/BottomSheet";

const notifications = [
  {
    id: 1,
    title: "Kuis Kata Kerja Bab 3",
    desc: "Bu Siti Rahma memberi tugas baru · 10 soal pilihan ganda",
    time: "2 jam lalu",
    tone: "sakura" as const,
  },
  {
    id: 2,
    title: "Streak 12 hari!",
    desc: "Pertahankan belajarmu hari ini",
    time: "Kemarin",
    tone: "gold" as const,
  },
];

export function NotificationBell({
  size = 20,
  color = "text-sora",
}: {
  size?: number;
  color?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`relative ${color}`}
        aria-label="Notifikasi"
      >
        <Bell size={size} />
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-sakura text-[10px] font-bold text-white">
          2
        </span>
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Notifikasi">
        <div className="space-y-3 pb-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex gap-3 rounded-card border border-line bg-paper p-3"
            >
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-btn ${
                  n.tone === "sakura"
                    ? "bg-sakura/10 text-sakura"
                    : "bg-gold/10 text-gold"
                }`}
              >
                <Bell size={16} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold text-ink">{n.title}</p>
                <p className="text-xs text-ink-soft">{n.desc}</p>
                <p className="mt-0.5 text-[10px] text-ink-soft/60">{n.time}</p>
              </div>
            </div>
          ))}
          <p className="pt-1 text-center text-[11px] text-ink-soft/60">
            Kamu sudah melihat semua notifikasi
          </p>
        </div>
      </BottomSheet>
    </>
  );
}
