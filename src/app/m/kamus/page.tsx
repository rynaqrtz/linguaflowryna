"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, SlidersHorizontal, Bookmark, X, Volume2, ArrowUpDown, Layers, ChevronRight } from "lucide-react";
import { StudentShell } from "@/components/layout/StudentShell";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AnimatedPage, staggerContainer, staggerItem } from "@/components/ui/AnimatedPage";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useLocalStorage } from "@/lib/use-local-storage";
import { speakJapanese, isSpeechSupported } from "@/lib/speech";
// Dulu file ini punya array kata sendiri (8 kata), padahal 4 file lain
// (deck, kuis/soal, belajar/sesi, g/kuis) masing-masing punya array
// terpisah juga — beberapa kata sama persis ditulis ulang di banyak
// tempat. Sekarang semua ambil dari satu sumber di lib/vocabulary.ts.
import { vocabulary as words, type Word } from "@/lib/vocabulary";

type SortKey = "furigana" | "arti";

export default function KamusList() {
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("furigana");
  const [selected, setSelected] = useState<Word | null>(null);
  const [bookmarked, setBookmarked] = useLocalStorage<string[]>("lf-bookmarks", []);
  const [deck, setDeck] = useLocalStorage<Word[]>("lf-deck", []);
  const [deckToast, setDeckToast] = useState(false);
  const [speechOn, setSpeechOn] = useState(() => isSpeechSupported());

  function toggleBookmark(k: string) {
    setBookmarked((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k],
    );
  }

  function addToDeck(k: string) {
    const w = words.find((x) => x.kanji === k);
    if (!w) return;
    setDeck((prev) => (prev.some((p) => p.kanji === k) ? prev : [...prev, w]));
    setDeckToast(true);
    setTimeout(() => setDeckToast(false), 1800);
  }

  const filtered = words
    .filter(
      (w) =>
        w.kanji.includes(q) ||
        w.furigana.includes(q) ||
        w.romaji.toLowerCase().includes(q.toLowerCase()) ||
        w.arti.toLowerCase().includes(q.toLowerCase()),
    )
    .sort((a, b) =>
      sortBy === "furigana"
        ? a.furigana.localeCompare(b.furigana, "ja")
        : a.arti.localeCompare(b.arti, "id"),
    );

  function kanaGroup(kana: string): string {
    const c = kana[0];
    if ('あいうえおぁぃぅぇぉ'.includes(c)) return 'あ';
    if ('かきくけこがぎぐげご'.includes(c)) return 'か';
    if ('さしすせそざじずぜぞ'.includes(c)) return 'さ';
    if ('たちつてとだぢづでど'.includes(c)) return 'た';
    if ('なにぬねの'.includes(c)) return 'な';
    if ('はひふへほばびぶべぼ'.includes(c)) return 'は';
    if ('まみむめも'.includes(c)) return 'ま';
    if ('やゆよゃゅょ'.includes(c)) return 'や';
    if ('らりるれろ'.includes(c)) return 'ら';
    if ('わをん'.includes(c)) return 'わ';
    return c;
  }

  const groups = filtered.reduce<Record<string, Word[]>>((acc, w) => {
    const key = sortBy === "furigana" ? kanaGroup(w.furigana) : w.arti[0]?.toUpperCase() ?? "#";
    (acc[key] ??= []).push(w);
    return acc;
  }, {});

  // Lock body scroll when bottom sheet is open, preventing layout shift
  useEffect(() => {
    if (selected) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [selected]);

  return (
    <StudentShell noHeader>
      <AnimatedPage>
        <h1 className="text-2xl font-bold text-ink">Kamus</h1>
        {/* Dulu teks ini hardcode "3.200+ kosakata" padahal isinya cuma 8
            kata — dibaca dari panjang array asli sekarang biar tidak
            pernah lagi beda dari kenyataan. */}
        <p className="text-xs text-ink-soft">{words.length} kosakata N5</p>

        {/* Search */}
        <div className="relative mt-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari kanji, hiragana, atau arti..."
            className="pl-10 pr-24"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {q && (
              <button
                onClick={() => setQ("")}
                className="flex h-7 w-7 items-center justify-center text-ink-soft transition-colors hover:text-sora"
                aria-label="Hapus pencarian"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={() => setSortBy((s) => (s === "furigana" ? "arti" : "furigana"))}
              className="flex items-center gap-1 rounded-full bg-sora-tint-soft px-2.5 py-1 text-[11px] font-semibold text-sora transition-colors hover:bg-sora-tint-soft/70"
              aria-label="Urutkan"
            >
              <ArrowUpDown size={14} />
              {sortBy === "furigana" ? "Aい" : "A-Z"}
            </button>
          </div>
        </div>

        {deck.length > 0 && (
          <Link
            href="/m/deck"
            className="mt-3 flex items-center justify-between rounded-btn bg-sora-tint-soft px-4 py-2.5 text-sm font-semibold text-sora transition-colors hover:bg-sora-tint-soft/70"
          >
            <span className="flex items-center gap-2">
              <Layers size={16} /> Lihat Deck Latihan
            </span>
            <span className="flex items-center gap-1">
              {deck.length} kata <ChevronRight size={16} />
            </span>
          </Link>
        )}

        {filtered.length === 0 ? (
          <motion.div
            className="relative mt-10 flex flex-col items-center overflow-hidden rounded-card border border-line bg-paper py-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="lf-kanji-watermark absolute -top-3 left-1/2 -translate-x-1/2 text-[120px]">探</span>
            <div className="seigaiha absolute inset-0 opacity-[0.05]" />
            <div className="relative">
              <p className="text-sm font-semibold text-ink">Kata tidak ditemukan</p>
              <p className="mt-1 text-xs text-ink-soft">Coba kata lain atau periksa ejaan</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="mt-4 space-y-5 pb-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {Object.entries(groups).map(([k, list]) => (
              <motion.section key={k} variants={staggerItem}>
                <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-sora">
                  <span className="jp">{k}</span>
                  <span className="text-[10px] text-ink-soft">
                    {sortBy === "furigana" ? "行" : "huruf"}
                  </span>
                  <span className="ml-auto text-[11px] font-normal text-ink-soft">
                    {list.length} kata
                  </span>
                </h2>
                <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-paper">
                  {list.map((w, i) => (
                    <motion.div
                      key={w.kanji}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelected(w)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelected(w);
                        }
                      }}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-all hover:bg-sora-tint-soft/60 active:bg-sora-tint-soft"
                    >
                      <span className="jp-bold w-20 text-xl text-sora">{w.kanji}</span>
                      <span className="jp text-xs text-ink-soft">{w.furigana}</span>
                      <span className="flex-1 text-sm font-semibold text-ink">{w.arti}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(w.kanji);
                        }}
                        className="transition-colors"
                        aria-label="Bookmark"
                      >
                        <Bookmark
                          size={18}
                          className={
                            (Array.isArray(bookmarked) && bookmarked.includes(w.kanji))
                              ? "fill-gold text-gold"
                              : "text-ink-soft hover:text-gold"
                          }
                        />
                      </button>
                      {speechOn && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakJapanese(w.kanji);
                          }}
                          className="transition-colors hover:text-sora"
                          aria-label="Dengar"
                        >
                          <Volume2 size={18} className="text-ink-soft" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))}
          </motion.div>
        )}
      </AnimatedPage>

      {/* Bottom sheet — spring animation */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />

            {/* Sheet */}
            <motion.div
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-card bg-paper pb-8 shadow-soft-lg"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                damping: 28,
                stiffness: 300,
                mass: 0.8,
              }}
            >
              <div className="sticky top-0 z-10 bg-paper px-5 pb-2 pt-3">
                <div className="mx-auto mb-1 h-1.5 w-12 rounded-full bg-line" />
              </div>

              <div className="px-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="jp-bold text-5xl text-sora">{selected.kanji}</span>
                    <div className="mt-1 flex items-center gap-3 text-sm text-ink-soft">
                      <span className="jp">{selected.furigana}</span>
                      <span className="h-3 w-px bg-line" />
                      <span>{selected.romaji}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      className="flex h-9 w-9 items-center justify-center text-sora/60 transition-colors hover:text-sora"
                      aria-label="Bookmark"
                      onClick={() => toggleBookmark(selected.kanji)}
                    >
                      <Bookmark
                        size={18}
                        className={Array.isArray(bookmarked) && bookmarked.includes(selected.kanji) ? "fill-gold text-gold" : ""}
                      />
                    </motion.button>
                    {speechOn && (
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        className="flex h-9 w-9 items-center justify-center text-sora/60 transition-colors hover:text-sora"
                        aria-label="Dengar"
                        onClick={() => speakJapanese(selected.kanji)}
                      >
                        <Volume2 size={18} />
                      </motion.button>
                    )}
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setSelected(null)}
                      className="flex h-9 w-9 items-center justify-center text-sora/60 transition-colors hover:text-sora"
                      aria-label="Tutup"
                    >
                      <X size={18} />
                    </motion.button>
                  </div>
                </div>

                <Badge tone="sora" className="mt-3">
                  {selected.level}
                </Badge>

                {/* Arti */}
                <h3 className="mt-5 text-sm font-bold text-ink">Arti</h3>
                <p className="text-sm text-ink-soft">{selected.arti} (kata kerja)</p>

                {/* Contoh Kalimat */}
                <h3 className="mt-4 text-sm font-bold text-ink">Contoh Kalimat</h3>
                <div className="mt-2 space-y-2">
                  <button
                    onClick={() => speakJapanese(`${selected.kanji}ことが好きです`)}
                    className="w-full rounded-btn bg-sora-tint-soft p-3 text-left transition-colors hover:bg-sora-tint-soft/70"
                  >
                    <p className="jp text-sm text-ink">{selected.kanji}ことが好きです</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-ink-soft">
                      {selected.romaji} koto ga suki desu — Saya suka {selected.arti.toLowerCase()}
                      {speechOn && <Volume2 size={12} className="text-sora" />}
                    </p>
                  </button>
                </div>

                {/* Kata Terkait */}
                <h3 className="mt-4 text-sm font-bold text-ink">Kata Terkait</h3>
                <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
                  {["食べ物", "飲む", "ご飯"].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setQ(r);
                        setSelected(null);
                      }}
                      className="jp shrink-0 cursor-pointer rounded-full border border-sora bg-paper px-3 py-1.5 text-sm text-sora transition-colors hover:bg-sora hover:text-white"
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <Button
                  fullWidth
                  variant="outline"
                  className="mt-6 transition-all active:scale-[0.98]"
                  onClick={() => addToDeck(selected.kanji)}
                >
                  {deck.some((d) => d.kanji === selected.kanji) ? "Sudah di Deck Latihan" : "Tambah ke Deck Latihan"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deck confirmation toast */}
      <AnimatePresence>
        {deckToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-full bg-sora px-4 py-2 text-xs font-semibold text-white shadow-soft-lg"
          >
            Ditambahkan ke Deck Latihan ({deck.length} kata)
          </motion.div>
        )}
      </AnimatePresence>
    </StudentShell>
  );
}
