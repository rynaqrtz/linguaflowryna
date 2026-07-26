// src/app/m/loading.tsx
//
// Sama seperti src/app/a/loading.tsx, tapi pakai HeroSkeleton supaya
// bentuknya mendekati kartu sapaan besar yang dipakai halaman-halaman
// murid (mis. dashboard), bukan grid kartu ala admin/guru.

import { HeroSkeleton, RowSkeleton } from "@/components/ui/Skeleton";

export default function StudentLoading() {
  return (
    <div className="space-y-4 pt-2">
      <HeroSkeleton />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <RowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
