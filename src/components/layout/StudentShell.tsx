"use client";

import { Avatar } from "@/components/ui/Avatar";
import { StudentBottomNav } from "@/components/layout/StudentBottomNav";
import { StudentSidebar } from "@/components/layout/StudentSidebar";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { useUser } from "@/lib/user-context";

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
