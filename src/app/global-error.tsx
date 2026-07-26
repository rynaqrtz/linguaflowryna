"use client";

import { TriangleAlert } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-warm-white p-5">
        <div className="max-w-md text-center">
          <TriangleAlert size={56} className="mx-auto text-sakura" strokeWidth={1.75} />
          <h1 className="mt-4 text-xl font-bold text-ink">Terjadi Kesalahan</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Ada yang tidak beres. Silakan muat ulang halaman.
          </p>
          <button
            onClick={reset}
            className="mt-5 rounded-btn bg-sora px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-sora-600 active:brightness-[0.92]"
          >
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  );
}
