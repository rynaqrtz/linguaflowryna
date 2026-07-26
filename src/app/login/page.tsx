// src/app/login/page.tsx
//
// Ini SENGAJA dibuat jadi Server Component (tidak ada "use client" di atas).
// Semua logika interaktif (state, validasi, klik) sudah dipindah ke
// LoginClient.tsx, karena Next.js tidak mengizinkan Client Component
// mengekspor `metadata` — padahal sebelum ini, seluruh halaman publik
// (login, register, landing) cuma memakai judul tab default dari
// src/app/layout.tsx ("LinguaFlow School — Belajar Bahasa Jepang"),
// jadi tab browser tidak pernah berubah walau pindah halaman.

import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Masuk — LinguaFlow School",
  description:
    "Masuk ke akun LinguaFlow School untuk melanjutkan belajar Bahasa Jepang: flashcard, kuis, dan AI Sensei.",
};

// Halaman ini cuma merender komponen client-nya. Tidak ada logic di sini
// supaya tetap Server Component murni.
export default function LoginPage() {
  return <LoginClient />;
}
