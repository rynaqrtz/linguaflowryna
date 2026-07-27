import { useLocalStorage } from "@/lib/use-local-storage";

export interface ProgressState {
  xp: number;
  streak: number;
  mastered: string[];
  reviewed: string[];
  srsQueue: SrsItem[];
  lastSessionDay: string;
  totalSessions: number;
}

export interface SrsItem {
  kanji: string;
  furigana: string;
  romaji: string;
  arti: string;
  level: string;
  dueDay: string;
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

const BAB_SIZE = 20;

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

export function bumpStreak(streak: number, lastSessionDay: string, today = dayKey()): { streak: number; lastSessionDay: string } {
  if (lastSessionDay === today) return { streak, lastSessionDay };
  const gap = lastSessionDay ? daysBetween(lastSessionDay, today) : 999;
  const nextStreak = gap === 1 ? streak + 1 : 1;
  return { streak: nextStreak, lastSessionDay: today };
}

export function useProgress() {
  return useLocalStorage<ProgressState>("lf-progress", SEED);
}

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

export function markMastered(prev: ProgressState, kanji: string): ProgressState {
  return {
    ...prev,
    mastered: prev.mastered.includes(kanji) ? prev.mastered : [...prev.mastered, kanji],
    srsQueue: prev.srsQueue.filter((q) => q.kanji !== kanji),
  };
}

export function queueReview(prev: ProgressState, item: SrsItem): ProgressState {
  if (prev.srsQueue.some((q) => q.kanji === item.kanji)) return prev;
  return { ...prev, srsQueue: [...prev.srsQueue, item] };
}

export function dueReviews(state: ProgressState, today = dayKey()): SrsItem[] {
  return state.srsQueue.filter((q) => q.dueDay <= today);
}
