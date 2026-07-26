// src/lib/api/storage-adapter.ts
//
// Helper internal untuk folder src/lib/api/. TIDAK dipakai langsung oleh
// halaman manapun — cuma dipakai oleh file lain di folder ini (tasks.ts,
// progress.ts) untuk membaca/menulis localStorage secara sinkron, lalu
// dibungkus jadi Promise supaya bentuknya sama seperti nanti manggil
// Supabase (`await supabase.from(...).select()`).
//
// Begitu backend siap, file inilah yang paling gampang "dibuang" — cukup
// ganti isi fungsi di tasks.ts/progress.ts dari `readStore`/`writeStore`
// jadi query Supabase, signature (nama fungsi + parameter + return type)
// di file lain tidak perlu ikut berubah.

/** Baca satu key dari localStorage. Balikin `fallback` kalau belum ada
 *  isinya, kalau dipanggil di server (SSR), atau kalau isinya rusak/tidak
 *  bisa di-parse sebagai JSON. */
export function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Tulis satu key ke localStorage. Aman dipanggil di server (langsung
 *  di-skip) supaya file yang memakainya tidak perlu cek `typeof window`
 *  berulang-ulang. */
export function writeStore<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

/** Simulasikan jeda jaringan singkat, supaya kode yang memanggil fungsi di
 *  tasks.ts/progress.ts terbiasa menampilkan loading state — bukan cuma
 *  `await` yang selesai seketika. Nilainya kecil (150ms) dan gampang
 *  dihapus begitu panggilan Supabase yang asli (yang memang punya latency)
 *  menggantikan ini. */
export function simulateNetworkDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 150));
}
