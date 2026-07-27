"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileQuestion,
  BarChart3,
  Settings,
  Menu,
  X,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";
import { Avatar } from "@/components/ui/Avatar";
import { useState } from "react";

export interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

export function AppSidebar({
  role,
  items,
  userName,
  userSub,
}: {
  role: "teacher" | "admin";
  items: SidebarItem[];
  userName: string;
  userSub: string;
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {items.map((it) => {
          const active = path === it.href || (it.href !== "/" && path.startsWith(it.href));
          const Icon = it.icon;
          return (
            <Link
              key={it.label}
              href={it.href}
              onClick={() => setOpen(false)}
              className={cn(
                "relative flex items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-sora-tint-soft text-sora"
                  : "text-ink-soft hover:bg-sora-tint-soft/50 hover:text-sora",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-sakura" aria-hidden="true" />
              )}
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-line p-3">
        <RoleSwitcher current={role === "admin" ? "admin" : "guru"} />
        <div className="mt-3 flex items-center gap-3 rounded-btn px-2 py-2">
          <Avatar name={userName} size={36} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{userName}</p>
            <p className="truncate text-xs text-ink-soft">{userSub}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-paper/80 px-4 backdrop-blur-md md:hidden">
        <Logo size={24} />
        <button onClick={() => setOpen(true)} aria-label="Buka menu">
          <Menu size={24} className="text-sora" />
        </button>
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-line bg-paper md:block">
        {sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-paper shadow-soft-lg">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 text-ink-soft"
              aria-label="Tutup menu"
            >
              <X size={22} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}
    </>
  );
}

export const teacherItems: SidebarItem[] = [
  { label: "Dashboard", href: "/g/dashboard", icon: LayoutDashboard },
  { label: "Kelas Saya", href: "/g/kelas", icon: Users },
  { label: "Tugas", href: "/g/tugas", icon: ClipboardList },
  { label: "Kuis", href: "/g/kuis", icon: FileQuestion },
  { label: "Laporan", href: "/g/laporan", icon: BarChart3 },
  { label: "Profil", href: "/g/profil", icon: Settings },
];

export const adminItems: SidebarItem[] = [
  { label: "Dashboard", href: "/a/dashboard", icon: LayoutDashboard },
  { label: "Guru", href: "/a/guru", icon: Users },
  { label: "Murid", href: "/a/murid", icon: UserCircle },
  { label: "Kelas", href: "/a/kelas", icon: ClipboardList },
  { label: "Laporan", href: "/a/laporan", icon: BarChart3 },
  { label: "Pengaturan", href: "/a/pengaturan", icon: Settings },
];
