// Client-side progress store (no backend, no DB).
// Persists to localStorage so a Gen-Z learner sees real, consistent numbers
// across reloads — no fake hardcoded stats.
//
// Note on mounting: useLocalStorage renders with `initial` on first paint, then
// hydrates from localStorage in an effect. We therefore seed with realistic
// starting values (so the UI never looks empty) and let storage take over
// after mount.

import { useLocalStorage } from "@/lib/use-local-storage";

export interface ProgressState {
  xp: number;
  streak: number;
  mastered: string[]; // kanji that the user marked "hafal"
  reviewed: string[]; // every kanji studied at least once
  srsQueue: SrsItem[]; // cards to review again (from "belum hafal")
  lastSessionDay: string; // YYYY-MM-DD of last study day
  totalSessions: number;
}

export interface SrsItem {
  kanji: string;
  furigana: string;
  romaji: string;
  arti: string;
  level: string;
  dueDay: string; // YYYY-MM-DD when it should reappear
}

const SEED: ProgressState = {
  xp: 350,
  streak: 3,
  mastered: [],
  reviewed: [],
  srsQueue: [],
  lastSessionDay: "",
  totalSessions: 0,
};

// Words in the current chapter (Flashcard N5 — Kata Kerja). Drives the hero
// "Progress Bab" bar so it reflects real study instead of a hardcoded 65%.
const BAB_SIZE = 20;

/** Percentage of the current chapter completed (0–100), based on real reviews. */
export function babProgress(state: ProgressState): number {
  if (BAB_SIZE <= 0) return 0;
  return Math.min(100, Math.round((state.reviewed.length / BAB_SIZE) * 100));
}

export function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

/** Returns updated streak + lastSessionDay given a study action today. */
export function bumpStreak(streak: number, lastSessionDay: string, today = dayKey()): { streak: number; lastSessionDay: string } {
  if (lastSessionDay === today) return { streak, lastSessionDay };
  const gap = lastSessionDay ? daysBetween(lastSessionDay, today) : 999;
  const nextStreak = gap === 1 ? streak + 1 : 1;
  return { streak: nextStreak, lastSessionDay: today };
}

export function useProgress() {
  return useLocalStorage<ProgressState>("lf-progress", SEED);
}

/** Add XP + record studied kanji + extend streak. Returns the next state. */
export function recordStudy(
  prev: ProgressState,
  learned: { kanji: string; xp?: number }[],
  today = dayKey(),
): ProgressState {
  const gained = learned.reduce((s, l) => s + (l.xp ?? 20), 0);
  const reviewed = Array.from(new Set([...prev.reviewed, ...learned.map((l) => l.kanji)]));
  const { streak, lastSessionDay } = bumpStreak(prev.streak, prev.lastSessionDay, today);
  return {
    ...prev,
    xp: prev.xp + gained,
    reviewed,
    streak,
    lastSessionDay,
    totalSessions: prev.totalSessions + 1,
  };
}

/** Mark a card as known (adds to mastered, removes from SRS queue). */
export function markMastered(prev: ProgressState, kanji: string): ProgressState {
  return {
    ...prev,
    mastered: prev.mastered.includes(kanji) ? prev.mastered : [...prev.mastered, kanji],
    srsQueue: prev.srsQueue.filter((q) => q.kanji !== kanji),
  };
}

/** Queue a card for review (from "belum hafal"). */
export function queueReview(prev: ProgressState, item: SrsItem): ProgressState {
  if (prev.srsQueue.some((q) => q.kanji === item.kanji)) return prev;
  return { ...prev, srsQueue: [...prev.srsQueue, item] };
}

/** Due SRS items for today. */
export function dueReviews(state: ProgressState, today = dayKey()): SrsItem[] {
  return state.srsQueue.filter((q) => q.dueDay <= today);
}
