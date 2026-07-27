import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Gabung ke Kelas — LinguaFlow School",
  description: "Masukkan kode kelas dari wali kelasmu untuk bergabung dan mulai belajar Bahasa Jepang.",
};

export default function RegisterPage() {
  return <RegisterClient />;
}
