| Area | Status |
|---|---|
| Konsolidasi data kosakata | ✅ Selesai |
| Session/login sungguhan (bug "nama selalu hardcode") | ✅ Selesai |
| Layer data-access siap-Supabase (`lib/api/`) | ✅ Selesai |
| Alur registrasi (join kelas & daftar sekolah) | ✅ Selesai |
| Metadata per-halaman (SEO/judul tab) | ✅ Selesai (4 halaman publik) |
| Loading state (`loading.tsx`) | ✅ Selesai (3 route group) |
| Bersih-bersih kode (`cn()`, dependency) | ✅ Selesai |
| Desain ulang palet warna ("Hanami") | ✅ Selesai (seluruh app) |
| Upgrade UI/UX dashboard admin | ✅ Selesai (halaman dashboard + sidebar) |
| Upgrade UI/UX 5 halaman admin lain + dashboard guru | ✅ Selesai |
| Bug kritis dari testing langsung (dark mode, logout, layout desktop) | ✅ Selesai |
| Polish animasi landing page (Framer Motion tambahan) | ⏳ **Belum** |
| Integrasi Supabase | ⏳ Belum (di luar scope kerjaan ini — sedang dikerjakan terpisah) |

---

## Bagian 1 — Menyiapkan Frontend Supaya Siap Disambung ke Backend

### 1.1 Konsolidasi data kosakata → `src/lib/vocabulary.ts` (BARU)
**Masalah lama:** 5 file (`m/kamus`, `m/deck`, `m/kuis/soal`, `m/belajar/sesi`,
`g/kuis`) masing-masing punya array kata (kanji/furigana/arti) sendiri-sendiri,
sebagian malah nulis ulang kata yang sama persis.

**Perubahan:**
- File baru `src/lib/vocabulary.ts` — satu sumber data (14 kata unik) + tipe
  `Word`, `JlptLevel`, dan helper (`getWordByKanji`, `getWordsByKanji`,
  `searchWords`, `getWordsByLevel`).
- Ke-5 file di atas diubah supaya **impor** dari sini, bukan mendefinisikan
  array sendiri. Beberapa detail teknis per file:
  - `g/kuis/page.tsx` — dulu tiap kata punya `id` angka (dipakai dnd-kit untuk
    urutan drag). Field `id` dihapus dari `Word`, diganti pakai `kanji` sebagai
    id unik (semua fungsi `add/remove/handleDragEnd` ikut disesuaikan).
  - `m/kuis/soal/page.tsx` — furigana sekarang diambil otomatis lewat
    `getWordByKanji()`, cuma kanji + pilihan jawaban yang ditulis manual di
    situ.
  - `m/kamus/page.tsx` & `m/dashboard/page.tsx` — teks **"3.200+ kata"** yang
    hardcode (padahal isinya cuma 8 kata) diganti jadi `{vocabulary.length}
    kata` yang dihitung otomatis dari data asli, supaya tidak lagi
    menampilkan klaim yang salah.

**Kenapa ini penting untuk Supabase:** begitu ada tabel `words` di database,
cukup ganti isi `vocabulary.ts` jadi hasil `fetch`/query — 5 halaman
konsumennya tidak perlu diubah lagi karena sudah satu pintu masuk.

### 1.2 Session login sungguhan → `src/lib/user-context.tsx` (BARU)
**Masalah lama (paling kritis dari review sebelumnya):** dashboard admin
SELALU menampilkan "Budi Santoso", guru SELALU "Bu Siti Rahma", murid SELALU
"Ahmad!" — hardcode di JSX, tidak peduli siapa yang login. `localStorage`
(`lf_role`/`lf_email`) yang ditulis saat login tidak pernah dibaca lagi di
manapun.

**Perubahan:**
- `UserProvider` + `useUser()` — context yang membaca `lf_role`/`lf_email` dari
  localStorage saat mount, dan expose `{ name, role, email, classId, login(),
  logout() }`. Nama ditebak dari bagian sebelum `@` di email (mis.
  `ahmad.fauzi@siswa.smk.id` → "Ahmad Fauzi") — pendekatan sementara sampai ada
  tabel `profiles` sungguhan.
- `useRoleGuard(requiredRole)` — hook kecil yang redirect ke `/login` kalau
  belum ada sesi/role tidak cocok. **Catatan jujur:** ini proteksi di sisi
  client saja (bisa dilewati lewat devtools), BUKAN pengganti middleware +
  RLS yang harus dipasang saat Supabase Auth masuk. Fungsinya sekarang cuma
  supaya alur demo tidak nyasar ke dashboard yang salah.
- Disambungkan ke:
  - `src/app/layout.tsx` — `<UserProvider>` dipasang di root.
  - `src/app/a/layout.tsx`, `src/app/g/layout.tsx` — pakai `useUser()` +
    `useRoleGuard()`, hapus nama hardcode.
  - `src/app/m/layout.tsx` (**BARU**) — cuma menjalankan `useRoleGuard("murid")`,
    SENGAJA tidak membungkus `<StudentShell>` di sini karena tiap halaman
    murid butuh props header yang beda-beda (ada yang pakai judul custom, ada
    yang tanpa header) — kalau dipaksa satu shell di layout, jadi kaku.
  - `src/components/layout/StudentShell.tsx`, `src/app/m/dashboard/page.tsx` —
    nama "Ahmad!" hardcode diganti `useUser().name`.
  - `src/app/login/LoginClient.tsx` — sekarang manggil `useUser().login()`,
    bukan `localStorage.setItem` manual.
  - `src/components/layout/RoleSwitcher.tsx` — tombol ganti-role dev/demo
    disesuaikan supaya tetap konsisten dengan sistem sesi baru (kalau tidak,
    `useRoleGuard` akan langsung melempar balik ke `/login`).

### 1.3 Layer data-access → `src/lib/api/` (BARU)
File `tasks.ts`, `progress.ts`, `storage-adapter.ts` — fungsi **async**
(`Promise`-based) yang bentuknya sudah menyerupai pemanggilan Supabase nanti
(`await getOpenTasks(classId)`, dst), tapi isinya untuk sekarang masih
membaca/menulis localStorage lewat `storage-adapter.ts`. Belum dipakai
menggantikan hook `useSchool()`/`useProgress()` yang sudah ada (itu tetap
dipakai untuk state reaktif di komponen) — ini disiapkan sebagai **pola
target** yang tinggal diisi ulang begitu ada backend asli, supaya tanda tangan
fungsinya tidak berubah drastis nanti.

### 1.4 Alur registrasi
- **`src/app/register/`** (gabung kelas dengan kode) — dulu cuma Step 1 (kode
  kelas) yang berfungsi, tombol "Lanjut" di Step 2/3 tidak py onClick sama
  sekali. Sekarang 3 step penuh: kode kelas (dengan pesan error kalau salah)
  → buat akun (validasi nama/email/password) → selesai.
- **`src/app/register-sekolah/`** — ditemukan bug: field NPSN sama sekali
  tidak tersambung ke state (`<Input>` tanpa `value`/`onChange`), jadi apa pun
  yang diketik user hilang begitu saja. Sekarang NPSN tersimpan & divalidasi
  (harus angka). Email admin juga sekarang divalidasi formatnya, bukan cuma
  dicek "tidak kosong".

### 1.5 Metadata per halaman (SEO & judul tab)
Next.js tidak mengizinkan Client Component (`"use client"`) mengekspor
`metadata`. Dulu SEMUA halaman publik (`/`, `/login`, `/register`,
`/register-sekolah`) adalah Client Component penuh, jadi judul tab browser
tidak pernah berubah dari default di `layout.tsx`.

**Pola yang dipakai di keempat halaman:** `page.tsx` diubah jadi Server
Component murni yang cuma mengekspor `metadata` dan merender komponen client-
nya (`LoginClient.tsx`, `RegisterClient.tsx`, `RegisterSekolahClient.tsx`,
`LandingClient.tsx`). Landing page juga dapat tag Open Graph + Twitter card
supaya preview link di WhatsApp/medsos tidak polos.

### 1.6 Loading state — `loading.tsx` (BARU: `a/`, `g/`, `m/`)
Next.js App Router otomatis menampilkan `loading.tsx` saat halaman di route
tersebut sedang dimuat. Dulu tidak ada satu pun, dan komponen `Skeleton`
(`components/ui/Skeleton.tsx`) sudah lama dibuat tapi tidak pernah dipakai.
Sekarang dipakai di ketiga loading state ini — baru terasa gunanya betulan
begitu Supabase bikin ada latensi jaringan asli (localStorage sekarang
instan, jadi loading state jarang sempat kelihatan).

### 1.7 Bersih-bersih kode
- **`src/lib/utils.ts`** — implementasi `cn()`/`twMerge()` buatan sendiri
  (cuma kenal ~35 prefix class, bisa salah gabung class antar breakpoint)
  diganti pakai library asli `clsx` + `tailwind-merge` (ditambahkan ke
  `package.json`). `src/lib/types.ts` (cuma berisi tipe `ClassValue` yang
  dipakai versi lama) dihapus karena sudah tidak dipakai.
- **`gsap`** dihapus dari `package.json` — dependency yang ada di daftar tapi
  tidak pernah di-`import` di kode manapun (kemungkinan sisa dari iterasi
  sebelum pindah ke Framer Motion + Lenis).

---

## Bagian 2 — Desain Ulang UI/UX: Palet "Hanami"

### 2.1 Kenapa ganti palet
Diminta nuansa yang lebih "Jepang" tapi bukan yang berat/formal (indigo tua +
merah torii) — maunya ke arah **musim semi**: putih, pink sakura, biru langit.
Konsep yang dipakai: **hanami** (piknik lihat bunga sakura) untuk suasana
siang, dan **yozakura** (夜桜, melihat sakura di malam hari) untuk adegan
sinematik gelap di landing page — supaya bagian gelapnya tetap terasa "sakura"
(langit senja ungu-tua + lampu), bukan cuma navy polos diganti biru.

### 2.2 Rename & re-value token warna (`src/app/globals.css`)
Karena warna didefinisikan sebagai CSS variable Tailwind v4 (`@theme { --color-x }`)
dan dipakai lewat class seperti `bg-indigo`/`text-vermillion` di ~85 file, ganti
nilai HEX saja tidak cukup — nama classnya juga diganti supaya tidak
membingungkan (`bg-indigo` yang sebenarnya berwarna pink itu aneh untuk yang
baca kode nanti). Mapping lengkap:

| Token lama | Token baru | Nilai lama | Nilai baru |
|---|---|---|---|
| `indigo` (+ `-tint`, `-tint-2`, `-tint-soft`) | `sora` (biru langit) | `#2b3a67` | `#3d7dae` |
| `vermillion` (+ `-soft`) | `sakura` (pink) | `#c8373a` | `#c24d77` |
| `jp-red` | `sakura` *(digabung — nilainya sudah sama persis dengan `vermillion` lama)* | `#c8373a` | `#c24d77` |
| `navy` (+ `-soft`) | `yozora` (langit malam) | `#12203a` | `#241f42` |
| `gold`, `gold-app`, `success`, `error`, `paper`, `ink`, `ink-soft`, `line`, `warm-white`, `cream` | *(nama sama, nilai disesuaikan tipis)* | — | — |

Rename di 80+ file dilakukan lewat `sed` (bukan manual satu-satu) supaya tidak
ada yang kelewat, lalu diverifikasi dengan `grep` (nol sisa nama token lama) +
`npm run build` penuh dua kali.

**Yang juga ikut diperbaiki saat proses ini** (warna yang di-hardcode sebagai
hex mentah, tidak lewat token, jadi tidak ikut ter-rename otomatis):
`components/ui/Avatar.tsx` (warna fallback SSR), `m/profil/page.tsx` (swatch
pemilih warna avatar), `m/dashboard/page.tsx` (satu gradient), dan
`m/leaderboard/page.tsx` (warna badge peringkat 1-8). Semua disamakan manual
ke nilai token baru.

**Motif dekoratif baru:** `.sakura-petals` (kelopak sakura melayang, opacity
rendah) ditambahkan sebagai elemen ciri khas baru, melengkapi `.seigaiha`
(motif ombak, sekarang di-restroke warna sora) yang sudah ada. `.seigaiha-navy`
diganti nama jadi `.seigaiha-yozora` biar konsisten.

### 2.3 Upgrade dashboard admin — `src/app/a/dashboard/page.tsx`
- Dulu 4 kartu statistik semua identik bentuknya (pola generik yang sama
  persis di hampir semua dashboard admin bikinan AI). Sekarang kartu pertama
  (Total Murid, metrik terpenting) dibedakan dengan aksen sakura, sisanya
  tetap tenang di sora — ada hierarki visual, bukan 4 kotak berat sama.
- Grafik aktivitas 30 hari dulu cuma `<div>` dengan `height` dinamis, dipaksa
  `min-width: 640px` (selalu scroll horizontal di HP), tanpa garis bantu.
  Diganti jadi **grafik area SVG custom** (bukan library — tidak menambah
  dependency baru) yang responsif penuh, ada garis bantu 0/50/100%, dan titik
  puncak ditandai dengan angka.
- Kartu "Kelas Paling Aktif" & "Guru Paling Aktif" dulu murni tampilan,
  sekarang bisa diklik (link ke halaman terkait), dan 3 guru teratas dapat
  badge emas/perak/perunggu, bukan angka polos.
- Ditambah motif `.sakura-petals` sangat halus (opacity 0.4, `pointer-events-none`)
  di belakang judul — restrained, tidak mengganggu keterbacaan data.

### 2.4 Upgrade sidebar — `src/components/layout/AppSidebar.tsx`
- Item navigasi aktif dulu cuma beda warna teks/background (tipis
  bedanya) — ditambah garis aksen sakura di kiri supaya jelas terlihat
  sekilas.
- Badge user di bagian bawah sidebar dulu ikon `UserCircle` generik yang sama
  untuk semua orang — diganti komponen `Avatar` (inisial + warna konsisten per
  nama) yang sudah dipakai di seluruh app, jadi terasa personal.

### 2.5 Bug yang ditemukan & diperbaiki selama proses ini
Saat menambahkan versi "interactive" untuk kartu statistik admin, build
sempat gagal: `Card` dengan prop `interactive` menempelkan handler
`onKeyDown` ke elemen — dan karena `a/dashboard/page.tsx` adalah **Server
Component** (tanpa `"use client"`), Next.js menolak mengirim function sebagai
prop ke situ saat build ("Event handlers cannot be passed to Client Component
props"). Diperbaiki dengan tidak memakai prop `interactive` di kartu yang
sudah dibungkus `<Link>` (Link sendiri sudah aksesibel via keyboard secara
native), styling hover-nya disamakan manual lewat className. Dicek juga tidak
ada halaman lain yang punya kombinasi serupa (aman).

---

## Rencana Lanjutan (belum dikerjakan)

1. **5 halaman admin lain** (`a/guru`, `a/murid`, `a/kelas`, `a/laporan`,
   `a/pengaturan`) baru ikut kebagian rename warna otomatis, belum di-upgrade
   layout/UX-nya seperti `a/dashboard`.
2. Halaman dashboard **guru** (`g/dashboard` dst.) juga belum disentuh UX-nya,
   cuma ikut rename warna.
3. Kontras warna token baru (terutama `sakura` di atas `warm-white`) sebaiknya
   dicek sekali lagi pakai devtools/Lighthouse untuk memastikan tetap di atas
   4.5:1 di semua kombinasi teks, bukan cuma dihitung manual.
4. Integrasi Supabase itu sendiri (auth, tabel, RLS, Realtime) — di luar
   scope kerjaan frontend ini, menunggu bagian backend selesai.
5. "AI Sensei" dan "Latihan Ucapan" masih demo penuh (balasan/skor hardcode)
   — butuh integrasi LLM API & speech recognition terpisah dari Supabase
   (sudah dibahas di review awal).
6. Beberapa halaman app (`m/sensei`, `m/kuis/*`, `a/dashboard` medali, dll.)
   masih pakai token `gold` (versi landing) bukan `gold-app` (versi app) untuk
   ikon reward — tidak menimbulkan bug kelihatan sekarang (nilainya mirip),
   tapi idealnya disamakan supaya konsisten dengan sistem token yang benar.
7. Audit responsif menyeluruh di lebar layar desktop (>1024px) untuk semua
   halaman — baru sempat memperbaiki 1 bug konkret yang ditemukan (lihat
   Bagian 3 di bawah), belum sempat cek satu-satu semua halaman di breakpoint
   desktop besar.

---

## Bagian 3 — Bug Kritis dari Testing Langsung (deployed di Vercel)

Setelah di-deploy, ditemukan 3 bug nyata dari screenshot testing di HP:

### 3.1 Dark mode bikin landing page nyaris tidak kelihatan (KRITIS)
**Gejala:** teks di landing page (hero, leaderboard scene, nav, footer, dll.)
render nyaris invisible — bukan cuma warna jelek, tapi teks gelap di atas
latar gelap (kontras ~0).

**Akar masalah:** landing page pakai pasangan token `bg-cream` (latar
terang) + `text-yozora` (teks gelap) di HAMPIR SEMUA elemen — bukan cuma di
adegan sinematik malam seperti dugaan awal, tapi juga nav bar, footer, tiap
"scene" di landing. Waktu saya desain ulang palet minggu lalu, `.dark`
class (dipicu toggle mode gelap di app) ikut meng-override `--color-cream`
jadi warna GELAP juga — jadi begitu mode gelap aktif, `text-yozora` (gelap)
duduk di atas `bg-cream` yang SEKARANG JUGA gelap. Dua warna yang tadinya
kontras tinggi jadi sama-sama gelap.

**Perbaikan:** `--color-cream`, `--color-cream-deep`, `--color-yozora`,
`--color-yozora-soft` dihapus dari override `.dark { }` — token-token ini
sekarang KONSTAN di semua mode. Landing page memang dirancang sebagai
identitas visual tetap (skema cream+yozora+sakura), bukan bagian dari
toggle mode gelap dashboard produk, jadi tidak masalah token-nya tidak ikut
berubah. Sudah dicek: token ini 100% eksklusif dipakai landing/nav/footer,
tidak dipakai satu pun halaman `/a`, `/g`, `/m` (yang memang harus tetap
ikut mode gelap lewat token `warm-white`/`paper`/`ink`/`sora`/`sakura`).

### 3.2 Tombol "Keluar" (logout) tidak benar-benar logout
**Gejala:** tekan "Ya, Keluar" di halaman profil murid, sheet konfirmasi
cuma tertutup, sesi tidak terhapus.

**Akar masalah:** ternyata di 3 tempat sekaligus tombol logout tidak benar-
benar memanggil `logout()` dari `user-context.tsx`:
- `m/profil/page.tsx` — tombol confirm cuma `onClick={() => setSheet(null)}`,
  labelnya bahkan masih tertulis "(Segera Hadir)" — betul-betul belum
  pernah disambungkan sejak awal.
- `g/profil/page.tsx` — tombolnya `router.push("/login")` langsung tanpa
  memanggil `logout()` dulu, jadi pindah halaman tapi sesi lama masih
  nyangkut di localStorage. Halaman ini juga ternyata masih hardcode nama
  "Bu Siti Rahma" (bug yang sama dengan yang saya kira sudah beres semua
  sebelumnya, ternyata halaman profil guru terlewat).
- `a/pengaturan/page.tsx` — admin bahkan tidak punya tombol logout sama
  sekali di halaman ini.

**Perbaikan:** ketiganya sekarang memanggil `useUser().logout()` (hapus
`lf_role`/`lf_email` dari localStorage) baru `router.push("/login")`. Nama
guru di `g/profil` diganti pakai `useUser().name` yang sebenarnya. Admin
sekarang punya tombol "Keluar dari Akun" di `a/pengaturan`.

### 3.3 Layout "aneh" di layar lebar/desktop
**Gejala:** dilaporkan tampilan tidak menyesuaikan dengan baik di lebar
layar yang lebih besar (mis. lewat "Request Desktop Site" di HP).

**Akar masalah konkret yang ditemukan:** di `StudentShell.tsx`, elemen
`<main>` memakai `mx-auto` (yang men-set `margin-left: auto`) BERSAMAAN
dengan `md:ml-60` (yang men-set `margin-left: 240px`) — dua utility
Tailwind berebut properti CSS yang sama (`margin-left`) di elemen yang
sama. Hasilnya tidak konsisten tergantung urutan class di stylesheet yang
di-build, dan bisa membuat konten terlihat miring/tidak center dengan benar
di layar lebar. Ini persis jenis bug yang sudah diperingatkan sebagai risiko
umum: dua class Tailwind dengan spesifisitas sama tapi target properti CSS
yang sama, saling membatalkan.

**Perbaikan:** offset sidebar dipindah jadi `md:pl-60` (padding, bukan
margin) di div pembungkus terpisah, jadi tidak lagi bentrok dengan
`mx-auto` di `<main>`. Pola ini disamakan dengan yang sudah benar dipakai
di `a/layout.tsx` dan `g/layout.tsx`. Sudah dicek tidak ada tempat lain di
codebase yang punya kombinasi serupa.

**Catatan jujur:** ini SATU bug konkret yang ditemukan dan diperbaiki, bukan
audit menyeluruh semua halaman di semua ukuran layar — kalau masih ada
bagian lain yang terasa aneh di desktop, kabari halaman mana persisnya biar
bisa ditelusuri lebih spesifik.

---

## Bagian 4 — Upgrade 5 Halaman Admin Lain + Dashboard Guru

Pola yang dipakai konsisten di `a/guru`, `a/murid`, `a/kelas` (halaman
list/tabel):
- **Search yang tadinya dekoratif** (tidak ada `value`/`onChange`) sekarang
  benar-benar menyaring data.
- **Tombol aksi yang tadinya tidak punya `onClick`** (Nonaktifkan/Aktifkan di
  guru & murid) sekarang benar-benar toggle status di state lokal — belum ke
  backend, tapi minimal terasa berfungsi, bukan tombol mati.
- **Modal "Buat Kelas Baru"** di `a/kelas` dulu form-nya tidak tersambung ke
  state sama sekali (isi apa pun hilang, tombol "Buat Kelas" cuma menutup
  modal) — sekarang beneran menambah kelas baru ke grid.
- **Empty state** ditambahkan untuk kondisi hasil pencarian kosong.
- **Strip ringkasan** (total & aktif) ditambahkan di atas tabel/grid yang
  tadinya langsung ke data mentah tanpa angka ringkasan.

`a/laporan` — tombol Export PDF/CSV dulu tidak punya `onClick` sama sekali;
sekarang minimal kasih tahu jelas belum tersambung backend (bukan tombol
mati tanpa reaksi). Kartu "Perlu Perhatian" dibedakan dengan aksen sakura
(pola yang sama dengan `a/dashboard`) karena itu metrik paling butuh
tindakan admin.

`g/dashboard` (dashboard guru) — ditemukan bug yang sama dengan yang
sebelumnya dikira sudah beres semua: nama guru masih hardcode `"Bu Siti"`
lewat konstanta `TEACHER_NAME`, tidak peduli siapa yang login. Sekarang
pakai `useUser().name`. Ditambah juga motif `.sakura-petals` halus di
header, menyamakan level polish dengan `a/dashboard`.

---
