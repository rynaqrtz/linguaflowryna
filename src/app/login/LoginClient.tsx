"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUser, type UserRole } from "@/lib/user-context";

const ROLE_HOME: Record<UserRole, string> = {
  murid: "/m/dashboard",
  guru: "/g/dashboard",
  admin: "/a/dashboard",
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function LoginClient() {
  const router = useRouter();
  const { login } = useUser();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [serverError, setServerError] = useState("");

  const inputValid = isValidEmail(email);
  const showError = touched && !inputValid;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    setServerError("");
    if (!inputValid || !password) return;
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.error) {
      setServerError(
        result.error.toLowerCase().includes("invalid")
          ? "Email atau password salah."
          : result.error,
      );
      return;
    }

    router.push(result.role ? ROLE_HOME[result.role] : "/m/dashboard");
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
            Email
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <Input
              id="login-email"
              type="email"
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
              Masukkan email yang valid (mis. nama@sekolah.id).
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

          {serverError && (
            <p className="mt-3 rounded-btn bg-error/10 px-3 py-2 text-xs font-medium text-error">{serverError}</p>
          )}

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

        <p className="mt-6 text-center text-xs text-ink-soft">© 2026 LinguaFlow School</p>
      </div>
    </div>
  );
}
