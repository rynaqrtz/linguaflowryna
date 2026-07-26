// src/lib/vocabulary.ts
//
// SATU SUMBER DATA KOSAKATA UNTUK SELURUH APLIKASI.
//
// Sebelum file ini ada, kata bahasa Jepang (kanji/furigana/arti) ditulis
// ulang secara terpisah di 5 file berbeda: kamus, deck, kuis/soal,
// belajar/sesi, dan g/kuis. Kalau ada typo atau perubahan arti kata,
// developer harus mengubahnya di 5 tempat sekaligus.
//
// Sekarang semua halaman itu mengambil data dari sini. Ke depannya, kalau
// backend (Supabase) sudah siap, cukup ganti isi `vocabulary` di bawah
// dengan hasil query ke tabel `words` — bentuk data (interface Word) bisa
// tetap sama, jadi halaman yang memakainya tidak perlu diubah lagi.

/** Level kemampuan JLPT, dari yang paling dasar (N5) ke paling mahir (N1). */
export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

/** Satu entri kosakata. `contoh`, `contohId`, dan `group` opsional karena
 *  belum semua kata di bawah ini punya kalimat contoh / kelompok kata kerja. */
export interface Word {
  /** Kata dalam huruf kanji/hiragana/katakana, mis. "食べる" */
  kanji: string;
  /** Cara baca dalam hiragana, mis. "たべる" */
  furigana: string;
  /** Cara baca dalam huruf latin, mis. "taberu" */
  romaji: string;
  /** Arti dalam Bahasa Indonesia, mis. "Makan" */
  arti: string;
  /** Level JLPT kata ini */
  level: JlptLevel;
  /** Contoh kalimat berbahasa Jepang (opsional) */
  contoh?: string;
  /** Terjemahan/romaji dari contoh kalimat (opsional) */
  contohId?: string;
  /** Kelompok kata kerja, mis. "Group 1 (godan)" — hanya relevan untuk verba */
  group?: string;
}

// Data gabungan dari kamus, belajar/sesi, g/kuis, dan kuis/soal.
// Kata yang tadinya ditulis ulang di beberapa file (mis. 食べる, 飲む, 行く,
// 買う) sekarang cuma ada satu kali di sini.
export const vocabulary: Word[] = [
  {
    kanji: "食べる",
    furigana: "たべる",
    romaji: "taberu",
    arti: "Makan",
    level: "N5",
    contoh: "ご飯を食べる",
    contohId: "Gohan wo taberu — Makan nasi",
    group: "Group 2 (ichidan)",
  },
  {
    kanji: "飲む",
    furigana: "のむ",
    romaji: "nomu",
    arti: "Minum",
    level: "N5",
    contoh: "水を飲む",
    contohId: "Mizu wo nomu — Minum air",
    group: "Group 1 (godan)",
  },
  {
    kanji: "行く",
    furigana: "いく",
    romaji: "iku",
    arti: "Pergi",
    level: "N5",
    contoh: "学校へ行く",
    contohId: "Gakkou e iku — Pergi ke sekolah",
    group: "Group 1 (godan)",
  },
  {
    kanji: "会う",
    furigana: "あう",
    romaji: "au",
    arti: "Bertemu",
    level: "N5",
    group: "Group 1 (godan)",
  },
  {
    kanji: "開く",
    furigana: "あく",
    romaji: "aku",
    arti: "Terbuka",
    level: "N5",
    group: "Group 1 (godan)",
  },
  {
    kanji: "歩く",
    furigana: "あるく",
    romaji: "aruku",
    arti: "Berjalan",
    level: "N5",
    group: "Group 1 (godan)",
  },
  {
    kanji: "言う",
    furigana: "いう",
    romaji: "iu",
    arti: "Mengatakan",
    level: "N5",
    group: "Group 1 (godan)",
  },
  {
    kanji: "買う",
    furigana: "かう",
    romaji: "kau",
    arti: "Membeli",
    level: "N5",
    contoh: "本を買う",
    contohId: "Hon wo kau — Membeli buku",
    group: "Group 1 (godan)",
  },
  {
    kanji: "聞く",
    furigana: "きく",
    romaji: "kiku",
    arti: "Mendengar",
    level: "N5",
    group: "Group 1 (godan)",
  },
  {
    kanji: "待つ",
    furigana: "まつ",
    romaji: "matsu",
    arti: "Menunggu",
    level: "N5",
    contoh: "バスを待つ",
    contohId: "Basu wo matsu — Menunggu bus",
    group: "Group 1 (godan)",
  },
  {
    kanji: "友達",
    furigana: "ともだち",
    romaji: "tomodachi",
    arti: "Teman",
    level: "N5",
  },
  {
    kanji: "学校",
    furigana: "がっこう",
    romaji: "gakkou",
    arti: "Sekolah",
    level: "N5",
  },
  {
    kanji: "高い",
    furigana: "たかい",
    romaji: "takai",
    arti: "Tinggi/Mahal",
    level: "N5",
  },
  {
    kanji: "猫",
    furigana: "ねこ",
    romaji: "neko",
    arti: "Kucing",
    level: "N5",
  },
];

/** Ambil semua kosakata apa adanya. Dipakai halaman Kamus. */
export function getAllWords(): Word[] {
  return vocabulary;
}

/** Cari satu kata berdasarkan tulisan kanji-nya. Balikin `undefined` kalau tidak ada. */
export function getWordByKanji(kanji: string): Word | undefined {
  return vocabulary.find((w) => w.kanji === kanji);
}

/** Ambil beberapa kata sekaligus berdasarkan daftar kanji, dengan urutan yang sama
 *  seperti daftar yang diminta. Kata yang tidak ketemu otomatis dilewati. */
export function getWordsByKanji(kanjiList: string[]): Word[] {
  return kanjiList
    .map((k) => getWordByKanji(k))
    .filter((w): w is Word => w !== undefined);
}

/** Filter kosakata berdasarkan level JLPT tertentu. */
export function getWordsByLevel(level: JlptLevel): Word[] {
  return vocabulary.filter((w) => w.level === level);
}

/** Cari kosakata berdasarkan teks bebas (kanji, furigana, romaji, atau arti).
 *  Dipakai kolom pencarian di halaman Kamus. */
export function searchWords(query: string): Word[] {
  const q = query.toLowerCase();
  if (!q) return vocabulary;
  return vocabulary.filter(
    (w) =>
      w.kanji.includes(query) ||
      w.furigana.includes(query) ||
      w.romaji.toLowerCase().includes(q) ||
      w.arti.toLowerCase().includes(q),
  );
}

/** Ambil `count` kata secara acak — berguna untuk kuis/latihan yang butuh
 *  soal berbeda-beda setiap sesi. */
export function getRandomWords(count: number): Word[] {
  const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
