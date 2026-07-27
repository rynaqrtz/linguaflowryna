"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ListChecks,
  BookText,
  MessageCircle,
  User,
  Mic,
  Trophy,
  UserCircle,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

const studentItems: SidebarItem[] = [
  { label: "Belajar", href: "/m/belajar", icon: BookOpen },
  { label: "Kuis", href: "/m/kuis", icon: ListChecks },
  { label: "Deck Latihan", href: "/m/deck", icon: Layers },
  { label: "Kamus", href: "/m/kamus", icon: BookText },
  { label: "AI Sensei", href: "/m/sensei", icon: MessageCircle },
  { label: "Ucapan", href: "/m/speech", icon: Mic },
  { label: "Peringkat", href: "/m/leaderboard", icon: Trophy },
  { label: "Profil", href: "/m/profil", icon: User },
];

export function StudentSidebar() {
  const path = usePathname();

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {studentItems.map((it) => {
          const active =
            path === it.href ||
            (it.href !== "/m/dashboard" && path.startsWith(it.href));
          const Icon = it.icon;
          return (
            <Link
              key={it.label}
              href={it.href}
              className={cn(
                "flex items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-sora-tint-soft text-sora"
                  : "text-ink-soft hover:bg-sora-tint-soft/50 hover:text-sora",
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="hidden px-3 md:block">
        <RoleSwitcher current="murid" />
      </div>
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-btn px-2 py-2">
          <UserCircle size={36} className="text-sora" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">Ahmad Fauzi</p>
            <p className="truncate text-xs text-ink-soft">N5 · XII RPL 1</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-line bg-paper md:block">
        {sidebar}
      </aside>
    </>
  );
}
