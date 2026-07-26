"use client";

// src/app/a/layout.tsx
//
// Dulu userName/userSub di sini hardcode "Budi Santoso" — jadi selalu
// muncul walaupun yang login admin lain. Sekarang diambil dari useUser()
// (src/lib/user-context.tsx) yang membaca sesi login yang sebenarnya.
//
// useRoleGuard("admin") melempar ke /login kalau yang login BUKAN admin
// (mis. buka /a/dashboard langsung tanpa login, atau lupa logout). Ini
// proteksi ringan di sisi client saja — proteksi sungguhan tetap harus
// lewat middleware.ts + Supabase Auth setelah backend siap.

import { AppSidebar, adminItems } from "@/components/layout/AppSidebar";
import { AdminMobileBottomNav } from "@/components/layout/AdminMobileBottomNav";
import { useUser, useRoleGuard } from "@/lib/user-context";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useRoleGuard("admin");
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-warm-white">
      <AppSidebar
        role="admin"
        items={adminItems}
        // Fallback "Admin" / "SMK Texar" hanya tampil sebentar saat
        // localStorage belum selesai dibaca (lihat isLoading di
        // user-context.tsx), sebelum useRoleGuard mengarahkan ke /login
        // kalau ternyata memang belum ada yang login.
        userName={user?.name ?? "Admin"}
        userSub={user?.sub ?? "SMK Texar"}
      />
      <div className="md:pl-60">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 md:px-8 md:py-8 md:pb-8">
          {children}
        </div>
      </div>
      <AdminMobileBottomNav />
    </div>
  );
}
