"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Volume2, X, Check, Trash2, BookOpen, Sparkles } from "lucide-react";
import { StudentShell } from "@/components/layout/StudentShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AnimatedPage, staggerContainer, staggerItem } from "@/components/ui/AnimatedPage";
import { useLocalStorage } from "@/lib/use-local-storage";
import { speakJapanese, isSpeechSupported } from "@/lib/speech";

import { type Word } from "@/lib/vocabulary";

export default function DeckPage() {
  const router = useRouter();
  const [deck, setDeck] = useLocalStorage<Word[]>("lf-deck", []);
  const [studyIdx, setStudyIdx] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const speechOn = isSpeechSupported();

  function remove(k: string) {
    setDeck((prev) => prev.filter((w) => w.kanji !== k));
  }

  const studying = studyIdx !== null ? deck[studyIdx] : null;

  function nextStudy() {
    if (studyIdx === null) return;
    if (studyIdx + 1 >= deck.length) {
      setStudyIdx(null);
      setFlipped(false);
    } else {
      setStudyIdx(studyIdx + 1);
      setFlipped(false);
    }
  }

  return (
    <StudentShell noHeader>
      <AnimatedPage>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sora-tint-soft text-sora">
              <Layers size={22} />
            </span>
            <div>
              <h1 className="text-xl font-bold text-ink">Deck Latihan</h1>
              <p className="text-xs text-ink-soft"><span className="lf-stat lf-stat-sora">{deck.length}</span> kata tersimpan</p>
            </div>
          </motion.div>

          {deck.length === 0 ? (
            <motion.div variants={staggerItem} className="relative mt-10 flex flex-col items-center overflow-hidden rounded-card border border-line bg-paper py-14 text-center">
              <span className="lf-kanji-watermark pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 text-[140px]">練</span>
              <div className="seigaiha absolute inset-0 opacity-[0.05]" />
              <div className="relative">
                <p className="text-base font-bold text-ink">Deck kamu masih kosong</p>
                <p className="mx-auto mt-1 max-w-[15rem] text-xs text-ink-soft">
                  Tandai kata di Kamus dengan &ldquo;Tambah ke Deck Latihan&rdquo; untuk mulai drill sendiri.
                </p>
                <Link href="/m/kamus" className="mt-5 inline-block">
                  <Button size="sm">Buka Kamus</Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div variants={staggerItem} className="mt-4">
                <Button fullWidth size="lg" onClick={() => { setStudyIdx(0); setFlipped(false); }}>
                  <Sparkles size={18} /> Mulai Latihan ({deck.length})
                </Button>
              </motion.div>

              <motion.div variants={staggerItem} className="mt-5 space-y-2">
                {deck.map((w, i) => (
                  <motion.div
                    key={w.kanji}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Card className="flex items-center gap-3 transition-all hover:shadow-soft-lg" padded>
                      <div className="min-w-0 flex-1">
                        <p className="jp-bold text-lg text-sora">{w.kanji}</p>
                        <p className="text-xs text-ink-soft">{w.furigana} · {w.arti}</p>
                      </div>
                      {speechOn && (
                        <button
                          onClick={() => speakJapanese(w.kanji)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-sora-tint-soft text-sora transition-colors hover:bg-sora hover:text-white"
                          aria-label="Dengar"
                        >
                          <Volume2 size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => remove(w.kanji)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-error/10 hover:text-error"
                        aria-label="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </motion.div>
      </AnimatedPage>

      <AnimatePresence>
        {studying && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/50" onClick={() => setStudyIdx(null)} />
            <motion.div
              className="relative z-10 mx-auto mt-auto flex min-h-[70vh] w-full max-w-md flex-col rounded-t-card bg-paper p-5 pb-8 shadow-soft-lg"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300, mass: 0.8 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink-soft">
                  {studyIdx! + 1} / {deck.length}
                </span>
                <button onClick={() => setStudyIdx(null)} aria-label="Tutup">
                  <X size={20} className="text-ink-soft" />
                </button>
              </div>

              <div
                onClick={() => setFlipped((f) => !f)}
                className="mt-6 flex flex-1 cursor-pointer flex-col items-center justify-center rounded-card border border-line bg-warm-white p-6 text-center"
              >
                {!flipped ? (
                  <>
                    <span className="jp-bold text-7xl text-sora">{studying.kanji}</span>
                    <span className="jp mt-3 text-base text-ink-soft">{studying.furigana}</span>
                    <p className="mt-4 flex items-center gap-1 text-xs text-ink-soft">
                      <Sparkles size={14} /> Tap untuk lihat arti
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-sora">{studying.arti}</span>
                    <p className="mt-3 text-sm text-ink-soft">{studying.romaji}</p>
                  </>
                )}
              </div>

              {speechOn && (
                <button
                  onClick={() => speakJapanese(studying.kanji)}
                  className="mx-auto mt-4 flex items-center gap-1.5 text-xs font-semibold text-sora"
                >
                  <Volume2 size={16} /> Dengar
                </button>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button variant="outline" size="lg" onClick={nextStudy}>
                  <X size={18} /> Belum
                </Button>
                <Button size="lg" onClick={nextStudy}>
                  <Check size={18} /> Hafal
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </StudentShell>
  );
}
