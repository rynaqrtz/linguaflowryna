"use client";

// src/app/m/layout.tsx
//
// /a dan /g punya layout.tsx bersama karena tiap halaman di sana selalu
// pakai satu header yang sama. Halaman /m/* justru sengaja beda-beda
// (dashboard pakai sapaan lengkap, kamus pakai judul simpel, kuis kadang
// tanpa header sama sekali) — itu diatur lewat prop `header`/`title`/
// `noHeader` pada <StudentShell> yang dipanggil masing-masing halaman.
// Karena Next.js layout.tsx cuma menerima satu slot `children` yang sama
// untuk semua halaman di bawahnya, layout ini SENGAJA tidak mencoba
// membungkus ulang <StudentShell> supaya header per-halaman itu tidak
// rusak. Lihat komentar di src/components/layout/StudentShell.tsx.
//
// Yang layout ini urus: menyamakan proteksi akses dengan /a dan /g lewat
// useRoleGuard, supaya ketiga role diperlakukan konsisten.

import { useRoleGuard } from "@/lib/user-context";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  useRoleGuard("murid");
  return <>{children}</>;
}
