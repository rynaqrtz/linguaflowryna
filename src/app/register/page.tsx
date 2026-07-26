// src/app/register/page.tsx
//
// Server Component murni — lihat penjelasan lengkap di komentar atas
// src/app/login/page.tsx untuk alasan kenapa halaman ini dipecah dari
// logikanya (RegisterClient.tsx).

import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Gabung ke Kelas — LinguaFlow School",
  description: "Masukkan kode kelas dari wali kelasmu untuk bergabung dan mulai belajar Bahasa Jepang.",
};

// Tidak ada logic di sini — cuma merender komponen client-nya.
export default function RegisterPage() {
  return <RegisterClient />;
}
