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

export async function fetchProgress(): Promise<ProgressState> {
  await simulateNetworkDelay();
  return readStore<ProgressState>(PROGRESS_KEY, EMPTY_STATE);
}

async function saveProgress(state: ProgressState): Promise<void> {
  await simulateNetworkDelay();
  writeStore(PROGRESS_KEY, state);
}

export async function recordStudySession(
  learned: { kanji: string; xp?: number }[],
): Promise<ProgressState> {
  const prev = await fetchProgress();
  const next = recordStudy(prev, learned);
  await saveProgress(next);
  return next;
}

export async function markWordMastered(kanji: string): Promise<ProgressState> {
  const prev = await fetchProgress();
  const next = markMastered(prev, kanji);
  await saveProgress(next);
  return next;
}

export async function queueWordForReview(item: SrsItem): Promise<ProgressState> {
  const prev = await fetchProgress();
  const next = queueReview(prev, item);
  await saveProgress(next);
  return next;
}

export async function fetchDueReviews(): Promise<SrsItem[]> {
  const state = await fetchProgress();
  return dueReviews(state);
}
