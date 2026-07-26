// src/lib/utils.ts
//
// Dulu file ini punya implementasi cn()/twMerge() buatan sendiri (lihat
// riwayat git kalau butuh baca versi lamanya). Masalahnya:
// 1. Daftar prefix yang dikenali cuma ~35 entri — className di luar itu
//    (mis. "rotate-", "translate-", "z-", "ring-", "duration-", "ease-")
//    tidak pernah di-dedupe, jadi bisa numpuk dan saling tabrakan diam-diam.
// 2. Prefix varian/breakpoint (mis. "lg:", "hover:", "dark:") dibuang dulu
//    sebelum dibandingkan, jadi "text-red-500" dan "lg:text-blue-500" bisa
//    dianggap satu keluarga yang sama padahal keduanya harus tetap ada
//    (satu untuk mobile, satu untuk breakpoint lg) — versi lama malah
//    saling menghapus salah satunya.
//
// `clsx` dan `tailwind-merge` adalah library yang sudah dipakai jutaan
// project React/Tailwind dan menangani kedua kasus di atas dengan benar,
// jadi lebih aman daripada terus merawat versi buatan sendiri.

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Gabungkan className secara kondisional (lewat clsx), lalu bersihkan
 *  konflik utility Tailwind yang tumpang tindih (lewat tailwind-merge).
 *  Ini fungsi yang dipakai HAMPIR SEMUA komponen UI di folder
 *  components/ui/ untuk menerima className tambahan dari luar. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
