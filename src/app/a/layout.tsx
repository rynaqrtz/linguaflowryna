"use client";

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
