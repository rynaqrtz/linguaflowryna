"use client";

import { Avatar } from "@/components/ui/Avatar";
import { StudentBottomNav } from "@/components/layout/StudentBottomNav";
import { StudentSidebar } from "@/components/layout/StudentSidebar";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { useUser } from "@/lib/user-context";

/** Default greeting header — only used on dashboard.
 *  `name` used to default to a hardcoded "Ahmad Fauzi" no matter who was
 *  actually logged in. Now it falls back to the real logged-in user's name
 *  from useUser() — callers can still pass `name` explicitly if they ever
 *  need to override it (e.g. previewing another student). */
export function StudentTopBar({ name }: { name?: string }) {
  const { user } = useUser();
  const resolvedName = name ?? user?.name ?? "Murid";
  const first = resolvedName.split(" ")[0];
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-warm-white px-4 py-3 md:hidden">
      <div className="flex items-center gap-2">
        <Avatar name={resolvedName} size={36} />
        <div>
          <p className="text-xs text-ink-soft">Halo,</p>
          <p className="text-sm font-bold text-ink leading-none">{first}</p>
        </div>
      </div>
      <NotificationBell size={22} />
    </header>
  );
}

/** Simple title-only header — for pages with functional need */
export function SimpleHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-warm-white px-4 py-3 md:hidden">
      <span className="text-base font-bold text-ink">{title}</span>
      <NotificationBell size={20} />
    </header>
  );
}

export function StudentShell({
  children,
  name,
  header,
  title,
  noHeader,
}: {
  children: React.ReactNode;
  name?: string;
  header?: React.ReactNode;
  title?: string;
  noHeader?: boolean;
}) {
  let topBar: React.ReactNode | null;
  if (noHeader) {
    topBar = null;
  } else if (header) {
    topBar = header;
  } else if (title) {
    topBar = <SimpleHeader title={title} />;
  } else {
    topBar = <StudentTopBar name={name} />;
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:z-[999] focus:top-4 focus:left-4 focus:rounded-btn focus:bg-sora focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:outline-none"
      >
        Langsung ke konten
      </a>
      <StudentSidebar />
      {/* Dulu md:ml-60 (margin-left) dipasang di elemen <main> yang SAMA
          dengan mx-auto (yang juga men-set margin-left:auto) — dua utility
          Tailwind berebut properti margin-left yang sama di elemen yang
          sama, jadi hasilnya tidak konsisten tergantung urutan class di
          stylesheet (kadang kontennya kepotong/miring ke kiri kalau dibuka
          di layar lebar/desktop). Sekarang offset sidebar dipindah jadi
          padding-left di div pembungkus, dan mx-auto+max-w tetap di
          <main> tapi tidak lagi bentrok karena properti yang dipakai beda
          (padding vs margin). Pola ini sama seperti yang dipakai di
          src/app/a/layout.tsx dan src/app/g/layout.tsx. */}
      <div className="md:pl-60">
        {topBar}
        <main id="main-content" className="mx-auto max-w-lg px-4 pb-20 pt-4 md:max-w-4xl md:px-6 md:pt-6">
          {children}
        </main>
      </div>
      <StudentBottomNav />
    </div>
  );
}
