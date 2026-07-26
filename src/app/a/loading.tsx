// src/app/a/loading.tsx
//
// Next.js otomatis menampilkan ini saat halaman di dalam /a/* sedang
// dimuat (mis. saat baru pindah halaman lewat App Router). Dulu tidak ada
// loading.tsx sama sekali di route manapun — pindah halaman langsung
// "meloncat" begitu data siap, tanpa keadaan transisi. Komponen Skeleton
// yang dipakai di sini sudah lama ada di lib/components/ui/Skeleton.tsx
// tapi belum pernah benar-benar dipakai di manapun.
//
// Begitu data mulai datang dari Supabase (yang punya latensi jaringan
// asli, bukan seketika seperti localStorage sekarang), loading state ini
// akan langsung terlihat gunanya.

import { CardSkeleton, RowSkeleton } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <RowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
