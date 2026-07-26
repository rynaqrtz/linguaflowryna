import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Mail, School } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Kontak — LinguaFlow School",
  description: "Hubungi tim LinguaFlow School untuk pertanyaan seputar sekolah, kemitraan, atau dukungan teknis.",
};

export default function KontakPage() {
  return (
    <div className="relative min-h-screen bg-cream px-5 py-10">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-sora">
          <ChevronLeft size={18} /> Beranda
        </Link>
        <Logo size={30} />
        <h1 className="mt-6 text-2xl font-bold text-yozora">Hubungi Kami</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Ada pertanyaan soal LinguaFlow School, kemitraan sekolah, atau butuh bantuan teknis? Kirim email ke kami.
        </p>

        <Card padded className="mt-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-btn bg-sora-tint-soft text-sora">
              <Mail size={20} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">Email</p>
              <a href="mailto:halo@linguaflow.school" className="text-sm text-sora hover:underline">
                halo@linguaflow.school
              </a>
            </div>
          </div>
        </Card>

        <Card padded className="mt-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-btn bg-sakura-tint text-sakura">
              <School size={20} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">Sekolah asal</p>
              <p className="text-sm text-ink-soft">SMK Texar</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
