"use client";

// src/lib/user-context.tsx
//
// SATU SUMBER "SIAPA YANG SEDANG LOGIN" UNTUK SELURUH APLIKASI.
//
// Sebelumnya, halaman login menyimpan "lf_role" dan "lf_email" ke
// localStorage, tapi TIDAK ADA satupun halaman lain yang membacanya lagi.
// Akibatnya dashboard admin selalu menampilkan "Budi Santoso", dashboard
// guru selalu "Bu Siti Rahma", dan dashboard murid selalu "Ahmad!" — siapa
// pun yang login, namanya selalu sama.
//
// File ini memperbaiki itu dengan menyediakan satu Context yang dibaca oleh
// semua layout (admin/guru/murid). Begitu backend (Supabase Auth) sudah
// siap, cukup ganti isi `refreshFromStorage()` di bawah supaya mengambil
// session asli dari Supabase, bukan localStorage — komponen yang memakai
// `useUser()` tidak perlu diubah sama sekali.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

/** Tiga peran yang ada di aplikasi ini. */
export type UserRole = "murid" | "guru" | "admin";

/** Data user yang sedang login. `null` kalau belum login / belum login. */
export interface UserInfo {
  role: UserRole;
  email: string;
  /** Nama tampilan, diturunkan dari email (lihat `deriveNameFromEmail`) */
  name: string;
  /** Keterangan singkat di bawah nama, mis. "Admin SMK Texar" */
  sub: string;
}

const STORAGE_ROLE_KEY = "lf_role";
const STORAGE_EMAIL_KEY = "lf_email";

/** Keterangan default per role, dipakai kalau belum ada info lain (mis. kelas). */
const ROLE_SUB: Record<UserRole, string> = {
  admin: "Admin SMK Texar",
  guru: "Guru Bahasa Jepang",
  murid: "Kelas XII RPL 1",
};

/**
 * Ubah bagian sebelum "@" pada email jadi nama yang enak dibaca.
 * Contoh: "ahmad.fauzi@siswa.smk.id" -> "Ahmad Fauzi"
 *         "siti_rahma@guru.smk.id"   -> "Siti Rahma"
 * Ini bukan nama asli dari database (belum ada backend), tapi setidaknya
 * setiap email yang login akan menampilkan nama yang berbeda-beda, bukan
 * satu nama hardcode untuk semua orang.
 */
export function deriveNameFromEmail(email: string): string {
  const localPart = email.split("@")[0] || "";
  const words = localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  return words.length > 0 ? words.join(" ") : "Pengguna";
}

/** Bentuk objek UserInfo lengkap dari role + email mentah. */
function buildUserInfo(role: UserRole, email: string): UserInfo {
  return {
    role,
    email,
    name: deriveNameFromEmail(email),
    sub: ROLE_SUB[role],
  };
}

interface UserContextValue {
  /** `null` selama masih memuat ATAU kalau memang belum ada yang login. */
  user: UserInfo | null;
  /** `true` sebelum localStorage sempat dibaca (hindari kedipan saat render pertama). */
  isLoading: boolean;
  /** Simpan sesi login (dipanggil dari halaman login / RoleSwitcher demo). */
  login: (email: string, role: UserRole) => void;
  /** Hapus sesi login. */
  logout: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Baca sesi yang tersimpan di localStorage. Dijalankan sekali saat mount,
  // lewat useEffect (bukan langsung di state awal) supaya render pertama di
  // server dan di client sama persis — pola yang sama dipakai di
  // `use-local-storage.ts` untuk menghindari hydration mismatch Next.js.
  useEffect(() => {
    const role = localStorage.getItem(STORAGE_ROLE_KEY) as UserRole | null;
    const email = localStorage.getItem(STORAGE_EMAIL_KEY);
    if (role && email) {
      setUser(buildUserInfo(role, email));
    }
    setIsLoading(false);
  }, []);

  // Simpan sesi baru (dipanggil saat submit form login atau klik akun demo).
  const login = useCallback((email: string, role: UserRole) => {
    localStorage.setItem(STORAGE_ROLE_KEY, role);
    localStorage.setItem(STORAGE_EMAIL_KEY, email);
    setUser(buildUserInfo(role, email));
  }, []);

  // Hapus sesi (dipanggil dari tombol logout, kalau nanti dibuat).
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_ROLE_KEY);
    localStorage.removeItem(STORAGE_EMAIL_KEY);
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

/** Hook utama: ambil siapa yang sedang login di komponen manapun. */
export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser() harus dipakai di dalam <UserProvider>");
  }
  return ctx;
}

/**
 * Penjaga akses ringan sisi client: kalau role yang login tidak cocok
 * dengan `requiredRole`, arahkan ke halaman login.
 *
 * PENTING — ini BUKAN keamanan sungguhan. Ini cuma mencegah kasus tidak
 * sengaja (mis. lupa logout lalu buka dashboard lain) selama belum ada
 * backend. Karena datanya cuma dibaca dari localStorage di browser, orang
 * yang tahu caranya tetap bisa mengubah localStorage sendiri dan lolos.
 * Proteksi yang sebenarnya harus datang dari Supabase Auth + Row Level
 * Security + middleware.ts di sisi server setelah backend terhubung.
 */
export function useRoleGuard(requiredRole: UserRole): void {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Tunggu sampai localStorage selesai dibaca dulu, supaya user yang
    // sebenarnya sudah login tidak sempat "terlempar" balik ke /login
    // hanya karena state awal masih null.
    if (isLoading) return;
    if (!user || user.role !== requiredRole) {
      router.replace("/login");
    }
  }, [isLoading, user, requiredRole, router]);
}
