"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminItems, type SidebarItem } from "@/components/layout/AppSidebar";
import { cn } from "@/lib/utils";

export function AdminMobileBottomNav() {
  const path = usePathname();

  const tabs: SidebarItem[] = adminItems.slice(0, 4);

  return (
    <nav
      aria-label="Navigasi bawah"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/85 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch">
        {tabs.map((it) => {
          const active = path === it.href || (it.href !== "/" && path.startsWith(it.href));
          const Icon = it.icon;
          return (
            <li key={it.label} className="flex-1">
              <Link
                href={it.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold transition-colors",
                  active ? "text-sora" : "text-ink-soft",
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
