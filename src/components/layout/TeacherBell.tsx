"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import { useSchool, pendingSubmissions } from "@/lib/school";
import { BottomSheet } from "@/components/ui/BottomSheet";

export function TeacherBell() {
  const [school] = useSchool();
  const [open, setOpen] = useState(false);
  const pending = pendingSubmissions(school, "xii-rpl-1");

  const items = pending.length
    ? pending.map((s) => ({
        id: s.id,
        title: s.taskTitle,
        desc: `${s.studentName} mengumpulkan ${s.type === "kuis" ? "kuis" : "flashcard"}`,
        time: s.turnedInAt,
        tone: "sakura" as const,
      }))
    : [
        {
          id: "empty",
          title: "Belum ada submission baru",
          desc: "Submission murid akan muncul di sini untuk direview.",
          time: "",
          tone: "gold" as const,
        },
      ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-btn text-sora hover:bg-sora-tint-soft/50"
        aria-label="Notifikasi guru"
      >
        <Bell size={20} />
        {pending.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-sakura text-[10px] font-bold text-white">
            {pending.length}
          </span>
        )}
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Notifikasi">
        <div className="space-y-3 pb-4">
          {items.map((n) => (
            <div key={n.id} className="flex gap-3 rounded-card border border-line bg-paper p-3">
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-btn ${
                  n.tone === "sakura" ? "bg-sakura/10 text-sakura" : "bg-gold/10 text-gold"
                }`}
              >
                <Bell size={16} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold text-ink">{n.title}</p>
                <p className="text-xs text-ink-soft">{n.desc}</p>
                {n.time && <p className="mt-0.5 text-[10px] text-ink-soft/60">{n.time}</p>}
              </div>
            </div>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}
