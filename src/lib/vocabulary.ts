export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export interface Word {

  kanji: string;

  furigana: string;

  romaji: string;

  arti: string;

  level: JlptLevel;

  contoh?: string;

  contohId?: string;

  group?: string;
}

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

export function getAllWords(): Word[] {
  return vocabulary;
}

export function getWordByKanji(kanji: string): Word | undefined {
  return vocabulary.find((w) => w.kanji === kanji);
}

export function getWordsByKanji(kanjiList: string[]): Word[] {
  return kanjiList
    .map((k) => getWordByKanji(k))
    .filter((w): w is Word => w !== undefined);
}

export function getWordsByLevel(level: JlptLevel): Word[] {
  return vocabulary.filter((w) => w.level === level);
}

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

export function getRandomWords(count: number): Word[] {
  const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
