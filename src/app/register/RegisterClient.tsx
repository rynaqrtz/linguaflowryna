"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ChevronLeft, School, Check, User, Mail, Lock } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const CODE_LENGTH = 6;

const VALID_CLASS_CODE = "SMK2026";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
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

export default function RegisterClient() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [checkingCode, setCheckingCode] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountTouched, setAccountTouched] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);

  const code = digits.join("");
  const codeComplete = code.length === CODE_LENGTH;

  function setDigit(index: number, value: string) {
    const next = [...digits];
    next[index] = value.slice(-1).toUpperCase();
    setDigits(next);
    setCodeError(false);
    if (value && index < CODE_LENGTH - 1) digitRefs.current[index + 1]?.focus();
  }

  function onDigitKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
  }

  function submitCode() {
    if (!codeComplete) return;
    setCheckingCode(true);
    setTimeout(() => {
      setCheckingCode(false);
      if (code === VALID_CLASS_CODE) {
        setStep(2);
      } else {
        setCodeError(true);
      }
    }, 500);
  }

  const nameValid = fullName.trim().length >= 2;
  const emailValid = isValidEmail(email);
  const passwordValid = password.length >= 8;
  const accountValid = nameValid && emailValid && passwordValid;

  function submitAccount() {
    setAccountTouched(true);
    if (!accountValid) return;
    setCreatingAccount(true);
    setTimeout(() => {
      setCreatingAccount(false);
      setStep(3);
    }, 700);
  }

  return (
    <div className="relative min-h-screen px-5 py-8">
      <div className="seigaiha pointer-events-none absolute inset-x-0 top-0 h-40 opacity-40" />
      <div className="relative mx-auto max-w-md">
        <Link href="/login" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-sora">
          <ChevronLeft size={18} /> Kembali
        </Link>

        <div className="mb-6 text-center">
          <Logo size={30} />
          <h1 className="mt-4 text-2xl font-bold text-ink">Gabung ke Kelas</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {step === 1 && "Masukkan kode kelas dari wali kelas kamu"}
            {step === 2 && "Buat akun untuk menyimpan progres belajarmu"}
            {step === 3 && "Kamu sudah tergabung!"}
          </p>
        </div>

        <StepIndicator step={step} />

        {step === 1 && (
          <div>
            <div className="flex justify-between gap-2">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    digitRefs.current[i] = el;
                  }}
                  value={digit}
                  maxLength={1}
                  inputMode="text"
                  aria-label={`Karakter kode kelas ke-${i + 1}`}
                  aria-invalid={codeError}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => onDigitKeyDown(i, e)}
                  className="h-14 w-full rounded-btn border-2 border-line bg-paper text-center text-xl font-bold text-sora focus:border-sora focus:outline-none focus:ring-2 focus:ring-sora/20"
                />
              ))}
            </div>
            {codeError && (
              <p className="mt-2 text-center text-xs font-medium text-sakura">
                Kode kelas tidak ditemukan. Cek lagi ke wali kelas kamu.
              </p>
            )}

            <div className="mt-6 flex items-center gap-3 rounded-card border border-line bg-sora-tint-soft p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-btn bg-sora text-white">
                <School size={20} />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">XII RPL 1 — SMK Texar</p>
                <p className="text-xs text-ink-soft">Wali Kelas: Bu Siti Rahma</p>
              </div>
            </div>

            <Button fullWidth className="mt-6" disabled={!codeComplete || checkingCode} onClick={submitCode}>
              {checkingCode ? "Memeriksa kode…" : "Lanjut"}
            </Button>
            <p className="mt-4 text-center text-xs text-ink-soft">Ga punya kode? Minta ke wali kelas kamu.</p>
          </div>
        )}

        {step === 2 && (
          <div>
            <label htmlFor="reg-name" className="mb-1.5 block text-sm font-semibold text-ink">
              Nama Lengkap
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
              <Input
                id="reg-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ahmad Fauzi"
                className="pl-10"
                aria-invalid={accountTouched && !nameValid}
              />
            </div>

            <label htmlFor="reg-email" className="mb-1.5 mt-4 block text-sm font-semibold text-ink">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
              <Input
                id="reg-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmad.fauzi@siswa.smk.id"
                className="pl-10"
                aria-invalid={accountTouched && !emailValid}
              />
            </div>

            <label htmlFor="reg-password" className="mb-1.5 mt-4 block text-sm font-semibold text-ink">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
              <Input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="pl-10"
                aria-invalid={accountTouched && !passwordValid}
              />
            </div>
            {accountTouched && !accountValid && (
              <p className="mt-2 text-xs font-medium text-sakura">
                Isi nama (min. 2 huruf), email yang valid, dan password minimal 8 karakter.
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <Button variant="outline" fullWidth onClick={() => setStep(1)}>
                Kembali
              </Button>
              <Button fullWidth disabled={creatingAccount} onClick={submitAccount}>
                {creatingAccount ? "Membuat akun…" : "Lanjut"}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
              <Check size={28} className="text-success" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-ink">Berhasil Gabung!</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Akun <span className="font-semibold text-ink">{email}</span> sudah tergabung ke kelas{" "}
              <span className="font-semibold text-ink">XII RPL 1</span>. Masuk dengan akun barumu untuk mulai belajar.
            </p>
            <Link href="/login" className="mt-6 block">
              <Button fullWidth>Ke Halaman Masuk</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
