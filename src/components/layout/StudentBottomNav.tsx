"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ListChecks, BookText, MessageCircle, User, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const items = [
  { label: "Belajar", href: "/m/dashboard", icon: BookOpen },
  { label: "Kuis", href: "/m/kuis", icon: ListChecks },
  { label: "Deck", href: "/m/deck", icon: Layers },
  { label: "Kamus", href: "/m/kamus", icon: BookText },
  { label: "Sensei", href: "/m/sensei", icon: MessageCircle },
  { label: "Profil", href: "/m/profil", icon: User },
];

export function StudentBottomNav() {
  const path = usePathname();
  return (
    <nav aria-label="Navigasi bawah" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {items.map((it) => {
          const active = path === it.href || (it.href !== "/m/dashboard" && path.startsWith(it.href));
          const Icon = it.icon;
          return (
            <Link
              key={it.label}
              href={it.href}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-semibold transition-colors",
                active ? "text-sora" : "text-ink-soft",
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-active-indicator"
                  className="absolute -top-px left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-sakura"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={22}
                strokeWidth={active ? 2.4 : 1.8}
                className={active ? "fill-sora-tint-soft" : ""}
              />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
