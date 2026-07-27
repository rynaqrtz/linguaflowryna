# BACKEND.md — Panduan Arsitektur Backend (LinguaFlow School)

Dokumen ini disiapkan dari sisi frontend untuk tim yang mengerjakan backend
(Supabase). Isinya rekomendasi arsitektur, bukan implementasi — supaya
keputusan besar (skema data, caching, integrasi AI/speech) dibahas dulu
sebelum dikerjakan, mengingat target skala sampai 50.000 murid.

Prinsip utama: **jangan over-engineer dari hari pertama**. Bagian "Kapan
butuh Redis/read-replica/queue" di bawah jelasin threshold kasarnya — banyak
dari ini baru relevan setelah traffic nyata, bukan sebelum ada satu pun
sekolah pakai produknya.

---

## 1. Yang Frontend Sudah Siapkan

Supaya tidak dikerjakan dua kali, ini bagian yang sudah dirancang di
frontend dan tinggal disambungkan:

- `src/lib/vocabulary.ts`, `src/lib/school.ts`, `src/lib/progress.ts` —
  interface TypeScript (`Word`, `SchoolTask`, `SchoolQuiz`, `Submission`,
  `ProgressState`, `SrsItem`) sudah mendekati bentuk skema tabel yang
  dibutuhkan. Bagian 2 di bawah menerjemahkan ini jadi tabel SQL.
- `src/lib/user-context.tsx` — expose `useUser()` dan `useRoleGuard()`.
  Saat ini baca role dari localStorage; tinggal diganti isinya baca dari
  Supabase session, signature fungsinya tetap sama jadi halaman yang
  memanggil tidak perlu diubah.
- `src/lib/api/tasks.ts`, `src/lib/api/progress.ts` — fungsi async
  (`Promise`-based) yang bentuknya sudah menyerupai pemanggilan Supabase.
  Isinya sekarang baca localStorage; tinggal diganti isi fungsinya jadi
  query Supabase.

---

## 2. Skema Database yang Disarankan

Tabel inti (nama kolom mengikuti konvensi Supabase/Postgres, snake_case):

**profiles** — 1 baris per user, terhubung ke `auth.users`
`id (uuid, FK ke auth.users)`, `role (enum: admin|guru|murid)`,
`full_name`, `school_id (FK)`, `class_id (FK, nullable untuk admin/guru)`

**schools** — `id`, `name`, `npsn`

**classes** — `id`, `school_id (FK)`, `name`, `level`, `major`,
`homeroom_teacher_id (FK ke profiles)`

**class_students** — tabel relasi many-to-many kalau nanti 1 murid bisa
pindah/ikut lebih dari 1 kelas. Kalau skema sekarang 1 murid = 1 kelas
tetap, cukup `class_id` langsung di `profiles`.

**words** — `id`, `kanji`, `furigana`, `romaji`, `arti`, `level (enum
JLPT)`, `contoh`, `contoh_id`, `group`. Ini persis field di
`lib/vocabulary.ts` `Word` interface.

**tasks** — `id`, `class_id (FK)`, `teacher_id (FK)`, `title`,
`description`, `due_date`, `created_at`

**submissions** — `id`, `task_id (FK)`, `student_id (FK)`, `status
(enum: pending|submitted|graded)`, `score`, `feedback`, `submitted_at`

**quizzes** / **quiz_questions** — `id`, `class_id`, `teacher_id`, lalu
tabel terpisah untuk pertanyaan per kuis (kanji, pilihan jawaban, jawaban
benar) — mengikuti bentuk `SchoolQuiz` yang sudah ada di `lib/school.ts`.

**progress** — `student_id (FK, primary key)`, `xp`, `streak`,
`last_study_date`

**srs_items** — `id`, `student_id (FK)`, `word_id (FK)`, `due_date`,
`review_count` — ini tabel yang tumbuh paling cepat (satu baris per
kata per murid), pertimbangkan index di `(student_id, due_date)` sejak
awal karena query "kata apa saja yang due hari ini" bakal sering dipanggil.

**ai_sensei_messages** — `id`, `student_id (FK)`, `role (user|assistant)`,
`content`, `created_at` — riwayat chat, sekaligus berguna untuk audit/
moderasi konten kalau ada laporan dari sekolah.

**speech_attempts** — `id`, `student_id (FK)`, `sentence`,
`accuracy_score`, `fluency_score`, `prosody_score`, `created_at`

Row Level Security wajib aktif di semua tabel ini sejak awal, bukan
ditambahkan belakangan — polanya: murid cuma bisa `SELECT`/`INSERT` baris
miliknya sendiri (`student_id = auth.uid()`), guru cuma bisa akses baris
yang `class_id`-nya ada di daftar kelas yang dia ampu, admin akses semua
baris dalam `school_id`-nya.

---

## 3. Auth & Middleware

- Supabase Auth (email/password cukup untuk mulai — form login yang ada
  sudah menerima email, tinggal disambungkan).
- Next.js middleware untuk proteksi route `/a`, `/g`, `/m` di level server
  (bukan cuma `useRoleGuard` di client yang sudah ada sekarang — itu bisa
  dilewati lewat devtools, cuma cukup untuk demo).
- Simpan session lewat Supabase's cookie-based auth helper untuk Next.js
  App Router, supaya middleware bisa baca session tanpa round-trip
  tambahan.

---

## 4. Skala ke 50.000 Murid — Kapan Butuh Apa

Jangan pasang semua ini di hari pertama. Urutan realistis:

**Fase 1 (0 – ~2.000 user aktif): Supabase default sudah cukup.**
Cukup pastikan index sudah benar di kolom yang sering di-`WHERE`/`JOIN`
(`class_id`, `student_id`, `due_date`). Tidak butuh Redis, tidak butuh
read-replica.

**Fase 2 (~2.000 – 20.000 user aktif): mulai butuh caching & pooling.**
- **Connection pooling** — Supabase sudah menyediakan pooler bawaan
  (Supavisor) di connection string mode "transaction" — pastikan
  aplikasi (termasuk Edge Functions) connect lewat pooler, bukan
  connection string langsung ke Postgres, supaya tidak kehabisan slot
  koneksi saat traffic naik.
- **Redis (rekomendasi: Upstash Redis)** — dipakai untuk 3 hal
  spesifik, bukan cache serampangan:
  1. **Leaderboard** — pakai Redis Sorted Set (`ZADD`/`ZREVRANGE`).
     Ranking real-time dari sorted set jauh lebih murah daripada
     `ORDER BY xp DESC LIMIT N` ke Postgres tiap kali leaderboard dibuka,
     apalagi kalau dibuka bolak-balik oleh ribuan murid.
  2. **Rate limiting** per user (AI Sensei, speech practice) — simpel
     pakai key `ratelimit:{user_id}:{fitur}:{tanggal}` dengan `INCR` +
     `EXPIRE`.
  3. **Cache jawaban AI Sensei yang sering ditanya** — normalisasi
     pertanyaan (lowercase, trim), simpan sebagai key di Redis dengan TTL
     beberapa hari. Kalau banyak murid nanya pertanyaan grammar yang
     sama (sangat mungkin — jumlah topik JLPT N5-N3 terbatas), ini
     memotong biaya panggilan AI API secara signifikan.
- **CDN** — kalau deploy di Vercel, asset statis Next.js sudah otomatis
  lewat CDN Vercel. Yang perlu diperhatikan cuma Supabase Storage kalau
  nanti ada upload (foto profil dll.) — aktifkan CDN caching di level
  bucket.

**Fase 3 (20.000+ user aktif): read-replica & queue.**
- **Read replica** Supabase — pindahkan query berat yang read-only
  (dashboard admin, laporan, leaderboard fallback) ke replica, sisakan
  primary untuk write (submit tugas, update progress).
- **Queue untuk proses async** (AI Sensei, speech scoring) — jangan
  panggil API AI/speech secara synchronous dari request murid kalau
  antrian mulai terasa. Opsi: Supabase Edge Function + Upstash QStash
  (queue serverless, cocok dipasangkan dengan Upstash Redis yang sudah
  dipakai), atau `pg-boss` kalau mau queue berbasis Postgres tanpa
  layanan tambahan.

---

## 5. Integrasi AI Sensei

- **Jangan panggil API AI langsung dari browser** — API key akan
  kelihatan di network tab. Proxy lewat Supabase Edge Function.
- **Model**: mulai dari tier "murah-cepat" (Claude Haiku / GPT-4o-mini /
  Gemini Flash — bandingkan berdasar kualitas penjelasan Bahasa Jepang,
  bukan cuma harga), karena mayoritas pertanyaan murid berulang seputar
  grammar/kosakata dasar, bukan reasoning kompleks.
- **System prompt scoping** — batasi AI Sensei supaya cuma menjawab
  seputar Bahasa Jepang/materi pelajaran. Selain hemat biaya, ini juga
  perlindungan dasar supaya tidak disalahgunakan jadi chatbot umum oleh
  murid.
- **Cache + rate limit** — lihat Fase 2 di atas.
- Simpan riwayat percakapan ke `ai_sensei_messages` untuk audit, bukan
  cuma tampil di UI lalu hilang.

---

## 6. Integrasi Speech Recognition

Fitur "Latihan Ucapan" di UI menampilkan skor Kejelasan/Intonasi/
Kelancaran terpisah — ini bukan transkripsi biasa, tapi **pronunciation
assessment**, kategori layanan tersendiri:

- **Rekomendasi: Azure AI Speech — Pronunciation Assessment API.**
  Mengembalikan skor Accuracy/Fluency/Prosody/Completeness yang persis
  sesuai yang sudah didesain di UI, dan mendukung Bahasa Jepang.
- Web Speech API browser (gratis) cuma transkripsi teks tanpa skor
  pelafalan, dan cuma jalan di Chrome — tidak cukup untuk fitur yang
  sudah dijanjikan di landing page.
- **Kontrol biaya**: speech API biasanya charge per detik audio. Batasi
  jumlah latihan gratis per murid per hari (mis. 10x), baru buka lebih
  banyak untuk paket sekolah berbayar.

---

## 7. Realtime

Supabase Realtime dipakai untuk alur "guru assign tugas → murid langsung
lihat tanpa refresh" dan "leaderboard update live". Prioritaskan Realtime
di tabel `tasks` dan `submissions` dulu — leaderboard bisa cukup polling
tiap beberapa detik atau refresh saat halaman dibuka, tidak wajib
realtime sejak awal.

---

## 8. Monitoring

- Supabase Dashboard sudah menyediakan query performance & log bawaan —
  cek `pg_stat_statements` secara berkala untuk temukan query lambat
  sebelum jadi masalah di skala besar.
- Vercel Analytics untuk performa frontend (Core Web Vitals di traffic
  asli, bukan cuma Lighthouse lokal).
- Pertimbangkan Sentry (atau sejenis) untuk error tracking begitu ada
  user asli, supaya bug seperti yang ditemukan lewat testing manual
  sebelumnya (dark mode, logout) bisa ketahuan otomatis, bukan menunggu
  laporan manual.

---

## 9. Checklist Keamanan Sebelum Rilis

- RLS aktif di semua tabel, teruji dengan akun murid/guru/admin asli,
  bukan cuma service role key saat development.
- Service role key Supabase **tidak pernah** dikirim ke client — cuma
  dipakai di Edge Function/server.
- Rate limiting aktif di endpoint AI Sensei & speech sebelum rilis
  publik — tanpa ini, biaya API bisa membengkak dari satu akun yang
  spam.
- Middleware proteksi route berjalan di server, bukan cuma client-side
  guard yang sudah ada sekarang.
