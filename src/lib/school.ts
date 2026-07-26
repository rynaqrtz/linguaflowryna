// Client-side school data store (no backend).
// Single source of truth that links the teacher app and the student app so the
// demo feels real: when a teacher assigns a task / publishes a quiz here, the
// student sees it, and submissions the student "turns in" show up for the teacher.
//
// Persists to localStorage with realistic seed values so reloads stay consistent.

import { useLocalStorage } from "@/lib/use-local-storage";
import { dayKey } from "@/lib/progress";

export type TaskType = "flashcard" | "kuis";

export interface SchoolTask {
  id: string;
  title: string;
  type: TaskType;
  classId: string; // matches g/kelas/[id] slug
  className: string;
  level: string; // N5 / N4 / N3
  category: string;
  target: number; // jumlah soal
  duration: number; // menit
  deadline: string; // YYYY-MM-DD
  createdAt: string; // YYYY-MM-DD
  teacher: string;
}

export interface SchoolQuiz {
  id: string;
  title: string;
  level: string;
  passingGrade: number;
  words: { kanji: string; furigana: string; arti: string; level: string }[];
  classId: string;
  className: string;
  teacher: string;
  publishedAt: string;
}

export interface Submission {
  id: string;
  taskId: string;
  taskTitle: string;
  studentName: string;
  studentNis: string;
  classId: string;
  type: TaskType;
  score: number | null; // null = belum dinilai
  turnedInAt: string;
  note?: string; // feedback dari guru
}

export interface SchoolState {
  tasks: SchoolTask[];
  quizzes: SchoolQuiz[];
  submissions: Submission[];
}

const SEED: SchoolState = {
  tasks: [
    {
      id: "t-1",
      title: "Hafalan 20 Kata N5",
      type: "flashcard",
      classId: "xii-rpl-1",
      className: "XII RPL 1",
      level: "N5",
      category: "Kata Kerja",
      target: 20,
      duration: 15,
      deadline: addDays(1),
      createdAt: addDays(-2),
      teacher: "Bu Siti Rahma",
    },
    {
      id: "t-2",
      title: "Kuis Kata Kerja",
      type: "kuis",
      classId: "xii-rpl-1",
      className: "XII RPL 1",
      level: "N5",
      category: "Kata Kerja",
      target: 10,
      duration: 20,
      deadline: addDays(3),
      createdAt: addDays(-1),
      teacher: "Bu Siti Rahma",
    },
  ],
  quizzes: [
    {
      id: "q-1",
      title: "Kuis Partikel N5",
      level: "N5",
      passingGrade: 75,
      words: [
        { kanji: "食べる", furigana: "たべる", arti: "Makan", level: "N5" },
        { kanji: "飲む", furigana: "のむ", arti: "Minum", level: "N5" },
        { kanji: "行く", furigana: "いく", arti: "Pergi", level: "N5" },
      ],
      classId: "xii-rpl-1",
      className: "XII RPL 1",
      teacher: "Bu Siti Rahma",
      publishedAt: addDays(-1),
    },
  ],
  submissions: [
    {
      id: "s-1",
      taskId: "t-1",
      taskTitle: "Hafalan 20 Kata N5",
      studentName: "Siti Nurhaliza",
      studentNis: "12346",
      classId: "xii-rpl-1",
      type: "flashcard",
      score: null,
      turnedInAt: addDays(0),
    },
    {
      id: "s-2",
      taskId: "t-2",
      taskTitle: "Kuis Kata Kerja",
      studentName: "Ahmad Fauzi",
      studentNis: "12345",
      classId: "xii-rpl-1",
      type: "kuis",
      score: 85,
      turnedInAt: addDays(0),
      note: "Bagus! Perhatikan partikel を vs に.",
    },
  ],
};

function addDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function useSchool() {
  return useLocalStorage<SchoolState>("lf-school", SEED);
}

/** Tasks still open (deadline >= today) assigned to a class. */
export function openTasksForClass(state: SchoolState, classId: string): SchoolTask[] {
  const today = dayKey();
  return state.tasks
    .filter((t) => t.classId === classId && t.deadline >= today)
    .sort((a, b) => a.deadline.localeCompare(b.deadline));
}

/** Submissions not yet graded for a class. */
export function pendingSubmissions(state: SchoolState, classId: string): Submission[] {
  return state.submissions.filter((s) => s.classId === classId && s.score === null);
}

/** All submissions for a class. */
export function submissionsForClass(state: SchoolState, classId: string): Submission[] {
  return state.submissions.filter((s) => s.classId === classId);
}
