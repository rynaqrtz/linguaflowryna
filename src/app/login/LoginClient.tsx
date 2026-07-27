"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUser, type UserRole } from "@/lib/user-context";

function detectRole(email: string): UserRole {
  const e = email.toLowerCase();
  if (e.includes("admin") || e.includes("kepala") || e.includes("waka")) return "admin";
  if (e.includes("guru") || e.includes("bu") || e.includes("pak") || e.includes("sensei")) return "guru";
  return "murid";
}

function isValidLoginInput(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  const isNis = /^\d{4,}$/.test(trimmed);
  return isEmail || isNis;
}

const demos: { label: string; email: string; role: UserRole }[] = [
  { label: "Murid", email: "ahmad.fauzi@siswa.smk.id", role: "murid" },
  { label: "Guru", email: "siti.rahma@guru.smk.id", role: "guru" },
  { label: "Admin", email: "admin@smktexar.sch.id", role: "admin" },
];

export default function LoginClient() {
  const router = useRouter();
  const { login } = useUser();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [touched, setTouched] = useState(false);

  const inputValid = isValidLoginInput(email);
  const showError = touched && !inputValid;

  function goToDashboard(role: UserRole) {
    const map: Record<UserRole, string> = {
      murid: "/m/dashboard",
      guru: "/g/dashboard",
      admin: "/a/dashboard",
    };
    router.push(map[role]);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!inputValid) return;
    setLoading(true);

    const role = detectRole(email);
    login(email, role);
    setTimeout(() => goToDashboard(role), 700);
  }

  function quick(role: UserRole, mail: string) {
    setEmail(mail);
    setPassword("demo1234");
    login(mail, role);
    goToDashboard(role);
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-10">
      <div className="seigaiha pointer-events-none absolute inset-x-0 top-0 h-40 opacity-40" />

      <div className="relative w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <Link href="/">
            <Logo size={32} />
          </Link>
          <p className="mt-3 text-sm text-ink-soft">Belajar Bahasa Jepang, Setiap Hari</p>
        </div>

        <form onSubmit={submit} noValidate className="rounded-card border border-line bg-paper p-6 shadow-soft">
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-ink">
            Email atau NIS
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <Input
              id="login-email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="ahmad.fauzi@siswa.smk.id"
              className="pl-10"
              aria-invalid={showError}
              aria-describedby={showError ? "login-email-error" : undefined}
            />
          </div>
          {showError && (
            <p id="login-email-error" className="mt-1.5 text-xs font-medium text-sakura">
              Masukkan email yang valid (mis. nama@sekolah.id) atau NIS berupa angka.
            </p>
          )}

          <label htmlFor="login-password" className="mb-1.5 mt-4 block text-sm font-semibold text-ink">
            Password
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft"
              aria-label="Tampilkan password"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <Input
              id="login-password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" fullWidth className="mt-5" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Memeriksa…
              </>
            ) : (
              "Masuk"
            )}
          </Button>

          <div className="mt-4 text-right">
            <a href="#" className="text-sm font-semibold text-sora hover:underline">
              Lupa password?
            </a>
          </div>

          <div className="my-5 flex items-center gap-3 text-xs text-ink-soft">
            <span className="h-px flex-1 bg-line" /> atau <span className="h-px flex-1 bg-line" />
          </div>

          <Link href="/register">
            <Button fullWidth variant="outline">
              Daftar dengan Kode Kelas
            </Button>
          </Link>
        </form>

        <div className="mt-5 rounded-card border border-dashed border-sora/40 bg-sora-tint-soft/30 p-4">
          <p className="text-xs font-bold text-sora">Akun Demo (klik untuk masuk cepat)</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {demos.map((d) => (
              <button
                key={d.role}
                onClick={() => quick(d.role, d.email)}
                className="rounded-btn border border-sora bg-paper px-2 py-2 text-xs font-semibold text-sora transition-colors hover:bg-sora-tint-soft"
              >
                {d.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-ink-soft">
            Role otomatis dari email. Backend masih simulasi.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-ink-soft">© 2026 LinguaFlow School</p>
      </div>
    </div>
  );
}
