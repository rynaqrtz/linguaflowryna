"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { X, Check, Bookmark, Hand, RotateCcw, ArrowLeft, ArrowRight } from "lucide-react";
import { StudentShell } from "@/components/layout/StudentShell";
import { Button } from "@/components/ui/Button";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useProgress, recordStudy, queueReview, markMastered, type SrsItem } from "@/lib/progress";
import { getWordsByKanji } from "@/lib/vocabulary";

const cards = getWordsByKanji(["食べる", "飲む", "行く"]);

type ExitDir = "left" | "right" | null;

export default function FlashcardSession() {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useLocalStorage<string[]>("lf-flashcard-bookmarks", []);
  const [progress, setProgress] = useProgress();

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [exitDir, setExitDir] = useState<ExitDir>(null);
  const [exiting, setExiting] = useState(false);
  const [decisions, setDecisions] = useState<Record<string, boolean>>({});
  const total = cards.length;
  const card = cards[idx];

  const nextCard = useCallback(
    (knew: boolean) => {
      setExitDir(knew ? "right" : "left");
      setExiting(true);
      setDecisions((d) => ({ ...d, [card.kanji]: knew }));
      setTimeout(() => {
        if (idx + 1 >= total) {

          const learned = cards
            .filter((c) => decisions[c.kanji] !== false)
            .map((c) => ({ kanji: c.kanji, xp: 20 }));
          let next = recordStudy(progress, learned);
          cards.forEach((c) => {
            if (decisions[c.kanji] === false) {
              const item: SrsItem = {
                kanji: c.kanji,
                furigana: c.furigana,
                romaji: c.romaji,
                arti: c.arti,
                level: c.level,
                dueDay: new Date(Date.now() + 86_400_000).toISOString().slice(0, 10),
              };
              next = queueReview(next, item);
            } else if (decisions[c.kanji] === true) {
              next = markMastered(next, c.kanji);
            }
          });
          setProgress(next);
          router.push("/m/belajar/ringkasan");
          return;
        }
        setIdx((i) => i + 1);
        setFlipped(false);
        setExiting(false);
        setExitDir(null);
      }, 250);
    },
    [card, idx, total, decisions, progress, router, setProgress],
  );

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (exiting) return;
    if (info.offset.x > 80) nextCard(true);
    else if (info.offset.x < -80) nextCard(false);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (exiting) return;
      if (e.key === "ArrowRight") nextCard(true);
      else if (e.key === "ArrowLeft") nextCard(false);
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextCard, exiting]);

  return (
    <StudentShell title="Sesi Belajar">
      <AnimatedPage>
        <div className="flex items-center gap-3">
          <Link href="/m/belajar" className="text-sora transition-opacity hover:opacity-70">
            <X size={22} />
          </Link>
          <div className="h-1.5 flex-1 rounded-full bg-sora-tint-soft overflow-hidden">
            <motion.div
              className="h-1.5 rounded-full bg-sakura"
              layout
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: `${((idx + 1) / total) * 100}%` }}
            />
          </div>
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold text-ink-soft"
          >
            {idx + 1} dari {total}
          </motion.span>
          <button
            onClick={() =>
              setBookmarked((prev) =>
                prev.includes(card.kanji) ? prev.filter((k) => k !== card.kanji) : [...prev, card.kanji],
              )
            }
            className={
              bookmarked.includes(card.kanji)
                ? "text-gold transition-colors"
                : "text-ink-soft transition-colors hover:text-gold"
            }
            aria-label="Bookmark"
          >
            <Bookmark size={20} className={bookmarked.includes(card.kanji) ? "fill-gold" : ""} />
          </button>
        </div>

        <div className="mt-4 perspective-[1200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              onClick={() => !exiting && setFlipped((f) => !f)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !exiting && setFlipped((f) => !f)}
              role="button"
              tabIndex={0}
              aria-label={flipped ? "Kartu arti, tap untuk balik ke kanji" : "Kartu kanji, tap untuk balik ke arti"}
              className="relative mx-auto h-[380px] w-full cursor-grab active:cursor-grabbing select-none"
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={
                exitDir === "right"
                  ? { opacity: 0, x: 200, scale: 0.9, transition: { duration: 0.2 } }
                  : exitDir === "left"
                    ? { opacity: 0, x: -200, scale: 0.9, transition: { duration: 0.2 } }
                    : { opacity: 0, scale: 0.9, transition: { duration: 0.15 } }
              }
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="relative h-full w-full"
                style={{
                  transformStyle: "preserve-3d",
                  transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-card border border-line bg-paper p-6 text-center shadow-soft-lg"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-error/40"><X size={16} /></span>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-success/40"><Check size={16} /></span>

                  <span className="jp-bold text-7xl text-sora">{card.kanji}</span>
                  <span className="jp mt-3 text-base text-ink-soft">{card.furigana}</span>
                  <span className="mt-1 text-sm text-ink-soft">{card.romaji}</span>
                  <div className="mt-6 h-px w-16 bg-line" />
                  <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-soft">
                    <Hand size={14} /> Tap untuk balik
                  </p>
                </div>

                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-card border border-line bg-paper p-6 text-center shadow-soft-lg"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <span className="text-2xl font-bold text-sora">{card.arti}</span>
                  <div className="mt-4 w-full rounded-btn bg-sora-tint-soft px-4 py-3">
                    <p className="jp text-lg text-ink">{card.contoh}</p>
                    <p className="mt-1 text-xs text-ink-soft">{card.contohId}</p>
                  </div>
                  <span className="mt-4 inline-block rounded-full bg-gold/15 px-3 py-1 text-[11px] font-semibold text-gold">
                    {card.group}
                  </span>
                  <p className="mt-5 flex items-center gap-1.5 text-xs text-ink-soft">
                    <RotateCcw size={14} /> Tap untuk balik
                  </p>
                </div>
              </div>

              <motion.div
                className="pointer-events-none absolute inset-0 rounded-card"
                style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), transparent 50%, rgba(239,68,68,0.08))" }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-ink-soft">
          <span className="flex items-center gap-1">
            <ArrowLeft size={14} className="text-error" /> Belum Hafal
          </span>
          <span className="flex items-center gap-1">
            Hafal <ArrowRight size={14} className="text-success" />
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => nextCard(false)}
            disabled={exiting}
            className="transition-all active:scale-95"
          >
            <X size={20} /> Belum Hafal
          </Button>
          <Button
            size="lg"
            onClick={() => nextCard(true)}
            disabled={exiting}
            className="transition-all active:scale-95"
          >
            <Check size={20} /> Sudah Hafal
          </Button>
        </div>
      </AnimatedPage>
    </StudentShell>
  );
}
