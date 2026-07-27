"use client";

import { AppSidebar, teacherItems } from "@/components/layout/AppSidebar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUser, useRoleGuard } from "@/lib/user-context";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  useRoleGuard("guru");
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-warm-white">
      <AppSidebar
        role="teacher"
        items={teacherItems}
        userName={user?.name ?? "Guru"}
        userSub={user?.sub ?? "Guru Bahasa Jepang"}
      />
      <div className="md:pl-60">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 md:px-8 md:py-8 md:pb-8">{children}</div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
