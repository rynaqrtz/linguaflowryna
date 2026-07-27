import { useLocalStorage } from "@/lib/use-local-storage";
import { dayKey } from "@/lib/progress";

export type TaskType = "flashcard" | "kuis";

export interface SchoolTask {
  id: string;
  title: string;
  type: TaskType;
  classId: string;
  className: string;
  level: string;
  category: string;
  target: number;
  duration: number;
  deadline: string;
  createdAt: string;
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
  score: number | null;
  turnedInAt: string;
  note?: string;
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

export function openTasksForClass(state: SchoolState, classId: string): SchoolTask[] {
  const today = dayKey();
  return state.tasks
    .filter((t) => t.classId === classId && t.deadline >= today)
    .sort((a, b) => a.deadline.localeCompare(b.deadline));
}

export function pendingSubmissions(state: SchoolState, classId: string): Submission[] {
  return state.submissions.filter((s) => s.classId === classId && s.score === null);
}

export function submissionsForClass(state: SchoolState, classId: string): Submission[] {
  return state.submissions.filter((s) => s.classId === classId);
}
