"use client";

import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, BookOpen, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, type UserRole } from "@/lib/user-context";

type Role = UserRole;

// Email demo dipakai supaya "pindah role" lewat tombol ini tetap konsisten
// dengan alur login sungguhan (lihat src/app/login/LoginClient.tsx) —
// tanpa ini, useRoleGuard di layout admin/guru/murid akan langsung
// melempar balik ke /login karena localStorage masih menyimpan role lama.
const roles: {
  role: Role;
  label: string;
  href: string;
  demoEmail: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { role: "murid", label: "Murid", href: "/m/dashboard", demoEmail: "ahmad.fauzi@siswa.smk.id", icon: BookOpen },
  { role: "guru", label: "Guru", href: "/g/dashboard", demoEmail: "siti.rahma@guru.smk.id", icon: GraduationCap },
  { role: "admin", label: "Admin", href: "/a/dashboard", demoEmail: "admin@smktexar.sch.id", icon: ShieldCheck },
];

export function RoleSwitcher({ current }: { current: Role }) {
  const path = usePathname();
  const router = useRouter();
  const { login } = useUser();

  // "Pindah role" di sini diperlakukan sama seperti login ulang sebagai
  // akun demo role tersebut, supaya konsisten dengan proteksi useRoleGuard
  // di src/app/{a,g,m}/layout.tsx. Ini tetap alat bantu demo/QA saja — di
  // aplikasi produksi nanti, widget ini sebaiknya dilepas/disembunyikan
  // karena membiarkan siapapun "menjadi" role lain tanpa password.
  function switchTo(target: (typeof roles)[number]) {
    login(target.demoEmail, target.role);
    router.push(target.href);
  }

  return (
    <div className="flex items-center gap-1 rounded-btn bg-sora-tint-soft/60 p-1">
      {roles.map((r) => {
        const Icon = r.icon;
        const active = r.role === current || path.startsWith(`/${r.role === "murid" ? "m" : r.role === "guru" ? "g" : "a"}`);
        return (
          <button
            key={r.role}
            type="button"
            onClick={() => switchTo(r)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-[0.5rem] px-2.5 py-1.5 text-sm font-semibold transition-colors",
              active ? "bg-paper text-sora shadow-soft" : "text-ink-soft hover:text-ink",
            )}
          >
            <Icon size={16} />
            {r.label}
          </button>
        );
      })}
    </div>
  );
}
