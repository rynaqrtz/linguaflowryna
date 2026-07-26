// src/app/page.tsx
//
// Server Component murni. Isi halaman (animasi, scroll, state "opened")
// dipindah ke LandingClient.tsx karena Next.js tidak mengizinkan Client
// Component mengekspor `metadata`.
//
// Dulu halaman ini tidak punya metadata sendiri (cuma warisan dari
// src/app/layout.tsx), dan sama sekali tidak ada tag Open Graph — jadi
// kalau link ke situs ini dibagikan di WhatsApp/medsos, preview-nya polos
// tanpa judul/deskripsi/gambar yang jelas. Sekarang ditambahkan supaya
// halaman marketing utama ini tampil lebih meyakinkan saat dibagikan.

import type { Metadata } from "next";
import LandingClient from "./LandingClient";

export const metadata: Metadata = {
  title: "LinguaFlow School — Belajar Bahasa Jepang untuk Murid SMK",
  description:
    "Platform belajar Bahasa Jepang interaktif untuk murid SMK Indonesia. AI Sensei, flashcard, kuis, dan tracking progres real-time.",
  openGraph: {
    title: "LinguaFlow School — Belajar Bahasa Jepang untuk Murid SMK",
    description:
      "Platform belajar Bahasa Jepang interaktif untuk murid SMK Indonesia. AI Sensei, flashcard, kuis, dan tracking progres real-time.",
    siteName: "LinguaFlow School",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinguaFlow School — Belajar Bahasa Jepang untuk Murid SMK",
    description: "Platform belajar Bahasa Jepang interaktif untuk murid SMK Indonesia.",
  },
};

// Tidak ada logic di sini — cuma merender komponen client-nya.
export default function Page() {
  return <LandingClient />;
}
