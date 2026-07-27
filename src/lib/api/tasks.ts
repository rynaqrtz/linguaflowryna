import {
  type SchoolState,
  type SchoolTask,
  type SchoolQuiz,
  type Submission,
  openTasksForClass,
  pendingSubmissions,
  submissionsForClass,
} from "@/lib/school";
import { readStore, writeStore, simulateNetworkDelay } from "./storage-adapter";

const SCHOOL_KEY = "lf-school";

const EMPTY_STATE: SchoolState = { tasks: [], quizzes: [], submissions: [] };

async function fetchSchoolState(): Promise<SchoolState> {
  await simulateNetworkDelay();
  return readStore<SchoolState>(SCHOOL_KEY, EMPTY_STATE);
}

async function saveSchoolState(state: SchoolState): Promise<void> {
  await simulateNetworkDelay();
  writeStore(SCHOOL_KEY, state);
}

export async function fetchOpenTasks(classId: string): Promise<SchoolTask[]> {
  const state = await fetchSchoolState();
  return openTasksForClass(state, classId);
}

export async function fetchPendingSubmissions(classId: string): Promise<Submission[]> {
  const state = await fetchSchoolState();
  return pendingSubmissions(state, classId);
}

export async function fetchSubmissionsForClass(classId: string): Promise<Submission[]> {
  const state = await fetchSchoolState();
  return submissionsForClass(state, classId);
}

export async function fetchQuizzesForClass(classId: string): Promise<SchoolQuiz[]> {
  const state = await fetchSchoolState();
  return state.quizzes.filter((q) => q.classId === classId);
}

export async function createTask(
  input: Omit<SchoolTask, "id" | "createdAt">,
): Promise<SchoolTask> {
  const state = await fetchSchoolState();
  const task: SchoolTask = {
    ...input,
    id: `t-${Date.now()}`,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  await saveSchoolState({ ...state, tasks: [...state.tasks, task] });
  return task;
}

export async function publishQuiz(
  input: Omit<SchoolQuiz, "id" | "publishedAt">,
): Promise<SchoolQuiz> {
  const state = await fetchSchoolState();
  const quiz: SchoolQuiz = {
    ...input,
    id: `q-${Date.now()}`,
    publishedAt: new Date().toISOString().slice(0, 10),
  };
  await saveSchoolState({ ...state, quizzes: [...state.quizzes, quiz] });
  return quiz;
}

export async function gradeSubmission(
  submissionId: string,
  score: number,
  note?: string,
): Promise<Submission> {
  const state = await fetchSchoolState();
  const index = state.submissions.findIndex((s) => s.id === submissionId);
  if (index === -1) {
    throw new Error(`Submission dengan id "${submissionId}" tidak ditemukan.`);
  }
  const updated: Submission = { ...state.submissions[index], score, note };
  const submissions = [...state.submissions];
  submissions[index] = updated;
  await saveSchoolState({ ...state, submissions });
  return updated;
}
