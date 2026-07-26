// src/lib/api/progress.ts
//
// LAPISAN "DATA ACCESS" UNTUK XP, STREAK, DAN ANTRIAN SRS (SPACED
// REPETITION) MURID.
//
// Sama seperti tasks.ts di folder ini: file ini TIDAK menggantikan
// `useProgress()` di lib/progress.ts (halaman yang sudah jalan tetap pakai
// hook itu karena butuh reaktivitas). File ini adalah versi async dari
// fungsi-fungsi murni yang sudah ada di lib/progress.ts, dengan bentuk
// pemanggilan yang sudah menyerupai query Supabase nanti — cukup ganti isi
// `readStore`/`writeStore` di dalamnya menjadi `supabase.from("progress")...`.

import {
  type ProgressState,
  type SrsItem,
  recordStudy,
  markMastered,
  queueReview,
  dueReviews,
} from "@/lib/progress";
import { readStore, writeStore, simulateNetworkDelay } from "./storage-adapter";

const PROGRESS_KEY = "lf-progress";

const EMPTY_STATE: ProgressState = {
  xp: 0,
  streak: 0,
  mastered: [],
  reviewed: [],
  srsQueue: [],
  lastSessionDay: "",
  totalSessions: 0,
};

/** Ambil progress belajar murid apa adanya. */
export async function fetchProgress(): Promise<ProgressState> {
  await simulateNetworkDelay();
  return readStore<ProgressState>(PROGRESS_KEY, EMPTY_STATE);
}

async function saveProgress(state: ProgressState): Promise<void> {
  await simulateNetworkDelay();
  writeStore(PROGRESS_KEY, state);
}

/** Catat satu sesi belajar: tambah XP, tandai kata sudah direview, dan
 *  perpanjang streak kalau ini sesi pertama hari ini. Mengembalikan state
 *  terbaru supaya UI (mis. progress bar XP) langsung bisa dipakai. */
export async function recordStudySession(
  learned: { kanji: string; xp?: number }[],
): Promise<ProgressState> {
  const prev = await fetchProgress();
  const next = recordStudy(prev, learned);
  await saveProgress(next);
  return next;
}

/** Tandai satu kata sebagai "sudah hafal" — otomatis keluar dari antrian SRS. */
export async function markWordMastered(kanji: string): Promise<ProgressState> {
  const prev = await fetchProgress();
  const next = markMastered(prev, kanji);
  await saveProgress(next);
  return next;
}

/** Masukkan satu kata ke antrian SRS untuk diulang lagi nanti (dipakai saat
 *  murid menandai kartu sebagai "belum hafal"). */
export async function queueWordForReview(item: SrsItem): Promise<ProgressState> {
  const prev = await fetchProgress();
  const next = queueReview(prev, item);
  await saveProgress(next);
  return next;
}

/** Kata-kata yang jadwal ulangnya sudah jatuh tempo hari ini. */
export async function fetchDueReviews(): Promise<SrsItem[]> {
  const state = await fetchProgress();
  return dueReviews(state);
}
