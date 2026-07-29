# Supabase SQL

Urutan menjalankan file ini di SQL Editor Supabase (atau lewat `supabase db push`):

1. `schema.sql` — tabel, enum, index, trigger auto-create profile, dan RLS policy
2. `seed.sql` — data kosakata yang sama persis dengan `src/lib/vocabulary.ts`, plus 1 sekolah dan 3 kelas contoh

Belum dites terhadap instance Supabase asli (dibuat tanpa akses jaringan ke
Supabase dari lingkungan kerja ini) — jalankan `schema.sql` di project
Supabase staging dulu dan cek error sebelum dipakai di production.

## Status koneksi frontend

Frontend SEKARANG sudah terhubung ke Supabase Auth sungguhan (bukan lagi
localStorage) — `src/lib/user-context.tsx`, `src/lib/supabase/*`,
`middleware.ts`, halaman login/register. Supaya jalan, isi environment
variable berikut (di `.env.local` untuk lokal, atau di pengaturan project
Vercel untuk produksi — lihat `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` — dari
  Project Settings → API di dashboard Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` — dipakai HANYA di
  `src/app/api/register-school/route.ts` (server-side) untuk membuat baris
  sekolah baru sebelum akun admin-nya ada. Jangan pernah expose key ini ke
  client.
- `GEMINI_API_KEY` — untuk AI Sensei (`src/app/api/sensei/route.ts`).

**Tanpa env variable ini, `npm run build` akan gagal** — ini sengaja
(bukan bug), karena sistem auth sekarang benar-benar butuh koneksi
Supabase asli, bukan simulasi lagi.

Yang masih perlu ditinjau ulang sebelum production:

- Policy `profiles_select_same_school` mengizinkan semua orang di sekolah
  yang sama saling melihat profil satu sama lain (termasuk murid melihat
  murid lain). Kalau mau lebih ketat, ganti jadi "hanya sekelas" untuk role
  murid.
- Kolom `raw_user_meta_data ->> 'role'` di trigger `handle_new_user`
  mengasumsikan role dikirim saat signup (lewat `options.data.role` di
  Supabase Auth signUp) — sesuaikan dengan alur registrasi asli yang
  dipakai (`register` untuk join kelas vs `register-sekolah` untuk buat
  akun admin sekolah baru).
