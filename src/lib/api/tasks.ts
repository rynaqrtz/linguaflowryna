// src/lib/api/tasks.ts
//
// LAPISAN "DATA ACCESS" UNTUK TUGAS, KUIS, DAN PENGUMPULAN (SUBMISSION).
//
// Ini BUKAN pengganti `useSchool()` di lib/school.ts — halaman yang sudah
// jalan sekarang (dashboard guru/murid) tetap pakai `useSchool()` karena
// butuh state React yang reaktif (auto re-render saat data berubah).
//
// File ini untuk kebutuhan yang berbeda: kode BARU yang mau mengambil/
// mengubah data tugas TANPA harus jadi React hook (mis. dipanggil dari
// event handler, atau nanti dari server action). Bentuk setiap fungsi di
// sini (async, menerima/mengembalikan Promise) sengaja dibuat SAMA seperti
// bentuk pemanggilan Supabase nantinya, contoh:
//
//   // Sekarang (localStorage):
//   const tasks = await fetchOpenTasks("xii-rpl-1");
//
//   // Nanti (Supabase), tinggal ganti ISI fungsinya:
//   const { data } = await supabase.from("tasks").select("*").eq("class_id", classId);
//
// Kode yang MEMANGGIL fetchOpenTasks() tidak perlu berubah sama sekali.

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

// Seed kosong sebagai fallback kalau localStorage belum pernah diisi sama
// sekali (harusnya jarang terjadi karena useSchool() di halaman lain sudah
// mengisi SEED-nya duluan, tapi tetap dijaga supaya fungsi di bawah tidak
// pernah error kalau dipanggil lebih dulu).
const EMPTY_STATE: SchoolState = { tasks: [], quizzes: [], submissions: [] };

/** Ambil seluruh state sekolah (tugas + kuis + submission) apa adanya. */
async function fetchSchoolState(): Promise<SchoolState> {
  await simulateNetworkDelay();
  return readStore<SchoolState>(SCHOOL_KEY, EMPTY_STATE);
}

/** Simpan perubahan pada state sekolah. */
async function saveSchoolState(state: SchoolState): Promise<void> {
  await simulateNetworkDelay();
  writeStore(SCHOOL_KEY, state);
}

/** Tugas yang masih terbuka (belum lewat deadline) untuk satu kelas.
 *  Dipakai dashboard murid untuk menampilkan "Tugas Pending". */
export async function fetchOpenTasks(classId: string): Promise<SchoolTask[]> {
  const state = await fetchSchoolState();
  return openTasksForClass(state, classId);
}

/** Submission yang belum dinilai guru untuk satu kelas. */
export async function fetchPendingSubmissions(classId: string): Promise<Submission[]> {
  const state = await fetchSchoolState();
  return pendingSubmissions(state, classId);
}

/** Semua submission (sudah maupun belum dinilai) untuk satu kelas. */
export async function fetchSubmissionsForClass(classId: string): Promise<Submission[]> {
  const state = await fetchSchoolState();
  return submissionsForClass(state, classId);
}

/** Semua kuis yang pernah dipublish untuk satu kelas. */
export async function fetchQuizzesForClass(classId: string): Promise<SchoolQuiz[]> {
  const state = await fetchSchoolState();
  return state.quizzes.filter((q) => q.classId === classId);
}

/** Guru membuat tugas baru. `id` dan `createdAt` dibuat otomatis di sini,
 *  jadi pemanggil tidak perlu memikirkannya (sama seperti Supabase yang
 *  otomatis mengisi kolom `id`/`created_at`). */
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

/** Guru menerbitkan kuis baru untuk satu kelas. */
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

/** Guru memberi nilai + catatan pada satu submission murid.
 *  Melempar error kalau submission-nya tidak ketemu, supaya pemanggil
 *  tahu ada yang salah (mis. id sudah dihapus) — sama seperti Supabase
 *  yang akan mengembalikan error kalau baris yang di-update tidak ada. */
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
