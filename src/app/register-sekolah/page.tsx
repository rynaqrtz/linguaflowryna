import type { Metadata } from "next";
import RegisterSekolahClient from "./RegisterSekolahClient";

export const metadata: Metadata = {
  title: "Daftarkan Sekolah — LinguaFlow School",
  description: "Daftarkan sekolahmu ke LinguaFlow School — gratis untuk 30 murid pertama.",
};

export default function RegisterSekolahPage() {
  return <RegisterSekolahClient />;
}
