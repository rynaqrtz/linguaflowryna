"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Building2, Mail, User, Check } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidNpsn(value: string): boolean {
  return value.trim() === "" || /^\d+$/.test(value.trim());
}

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2 text-xs font-semibold">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <span
            className={
              "flex h-7 w-7 items-center justify-center rounded-full " +
              (s <= step ? "bg-sora text-white" : "bg-line text-ink-soft")
            }
          >
            {s < step ? <Check size={15} /> : s}
          </span>
          {s < 3 && <span className={"h-0.5 w-8 " + (s < step ? "bg-sora" : "bg-line")} />}
        </div>
      ))}
    </div>
  );
}

export default function RegisterSekolahClient() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [school, setSchool] = useState("");
  const [npsn, setNpsn] = useState("");
  const [step1Touched, setStep1Touched] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [step2Touched, setStep2Touched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const schoolValid = school.trim().length >= 2;
  const npsnValid = isValidNpsn(npsn);
  const step1Valid = schoolValid && npsnValid;

  const nameValid = name.trim().length >= 2;
  const emailValid = isValidEmail(email);
  const step2Valid = nameValid && emailValid;

  function goToStep2() {
    setStep1Touched(true);
    if (!step1Valid) return;
    setStep(2);
  }

  function submitRegistration() {
    setStep2Touched(true);
    if (!step2Valid) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep(3);
    }, 700);
  }

  return (
    <div className="relative min-h-screen px-5 py-8">
      <div className="seigaiha pointer-events-none absolute inset-x-0 top-0 h-40 opacity-40" />
      <div className="relative mx-auto max-w-lg">
        <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-sora">
          <ChevronLeft size={18} /> Beranda
        </Link>

        <div className="mb-6 text-center">
          <Logo size={30} />
          <h1 className="mt-4 text-2xl font-bold text-ink">Daftarkan Sekolah</h1>
          <p className="mt-1 text-sm text-ink-soft">Gratis untuk 30 murid pertama</p>
        </div>

        <StepIndicator step={step} />

        <Card>
          {step === 1 && (
            <div>
              <label htmlFor="school-name" className="mb-1.5 block text-sm font-semibold text-ink">
                Nama Sekolah
              </label>
              <div className="relative">
                <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                <Input
                  id="school-name"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="SMK Texar"
                  className="pl-10"
                  aria-invalid={step1Touched && !schoolValid}
                />
              </div>

              <label htmlFor="school-npsn" className="mb-1.5 mt-4 block text-sm font-semibold text-ink">
                NPSN (opsional)
              </label>
              <Input
                id="school-npsn"
                value={npsn}
                onChange={(e) => setNpsn(e.target.value)}
                placeholder="12345678"
                inputMode="numeric"
                aria-invalid={step1Touched && !npsnValid}
              />
              {step1Touched && !npsnValid && (
                <p className="mt-1.5 text-xs font-medium text-sakura">NPSN harus berupa angka.</p>
              )}

              <Button fullWidth className="mt-6" onClick={goToStep2}>
                Lanjut
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <label htmlFor="admin-name" className="mb-1.5 block text-sm font-semibold text-ink">
                Nama Admin
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                <Input
                  id="admin-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Budi Santoso"
                  className="pl-10"
                  aria-invalid={step2Touched && !nameValid}
                />
              </div>
              <label htmlFor="admin-email" className="mb-1.5 mt-4 block text-sm font-semibold text-ink">
                Email Admin
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                <Input
                  id="admin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sekolah.sch.id"
                  className="pl-10"
                  aria-invalid={step2Touched && !emailValid}
                />
              </div>
              {step2Touched && !step2Valid && (
                <p className="mt-1.5 text-xs font-medium text-sakura">
                  Isi nama (min. 2 huruf) dan email admin yang valid.
                </p>
              )}

              <div className="mt-6 flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setStep(1)}>
                  Kembali
                </Button>
                <Button fullWidth disabled={submitting} onClick={submitRegistration}>
                  {submitting ? "Mendaftarkan…" : "Daftar"}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
                <Check size={28} className="text-success" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-ink">Sekolah Terdaftar!</h2>
              <p className="mt-1 text-sm text-ink-soft">
                Kami kirim email ke <span className="font-semibold text-ink">{email}</span> untuk set password.
              </p>
              <Link href="/login" className="mt-6 block">
                <Button fullWidth>Ke Halaman Masuk</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
