"use client";

import { useRoleGuard } from "@/lib/user-context";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  useRoleGuard("murid");
  return <>{children}</>;
}
