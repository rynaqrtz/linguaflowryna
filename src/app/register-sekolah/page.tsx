// src/app/register-sekolah/page.tsx
//
// Server Component murni — lihat penjelasan lengkap di komentar atas
// src/app/login/page.tsx untuk alasan kenapa halaman ini dipecah dari
// logikanya (RegisterSekolahClient.tsx).

import type { Metadata } from "next";
import RegisterSekolahClient from "./RegisterSekolahClient";

export const metadata: Metadata = {
  title: "Daftarkan Sekolah — LinguaFlow School",
  description: "Daftarkan sekolahmu ke LinguaFlow School — gratis untuk 30 murid pertama.",
};

// Tidak ada logic di sini — cuma merender komponen client-nya.
export default function RegisterSekolahPage() {
  return <RegisterSekolahClient />;
}
