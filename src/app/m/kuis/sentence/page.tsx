"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Check, GripVertical, Sparkles, ArrowRight, Shuffle, X, Lightbulb } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { StudentShell } from "@/components/layout/StudentShell";
import { Button } from "@/components/ui/Button";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

const POOL = ["ご飯", "を", "食べます", "が", "私は"];
const CORRECT_WORDS = ["私は", "ご飯", "を", "食べます"];
const CORRECT_SENTENCE = CORRECT_WORDS.join(" ");

// ─── Sortable chip for drag-to-reorder ───
function SortableChip({
  id,
  word,
  index,
  onRemove,
}: {
  id: string;
  word: string;
  index: number;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <span
        className="jp flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sora to-sora-tint pl-1.5 pr-3 py-2 text-sm font-semibold text-white shadow-soft-sm transition-all hover:from-sakura hover:to-sakura-soft active:scale-95 touch-none cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} className="text-sora-200 shrink-0" />
        <span className="text-[10px] font-bold text-white/50 mr-0.5">{index + 1}</span>
        {word}
      </span>
      {/* Remove button overlay */}
      <button
        onClick={onRemove}
        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-paper bg-sakura text-white shadow-soft transition-all hover:bg-rose-600 hover:scale-110"
        aria-label={`Hapus ${word}`}
      >
        <X size={10} />
      </button>
    </motion.div>
  );
}

// ─── Main component ───
export default function SentenceBuilder() {
  const router = useRouter();
  const [answer, setAnswer] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [hintShown, setHintShown] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const answerIds = useMemo(
    () => answer.map((w, i) => `ans-${w}-${i}`),
    [answer],
  );

  // ── Word pool ──
  function add(word: string) {
    if (answer.includes(word)) return;
    setAnswer((a) => [...a, word]);
    setShowResult(false);
  }

  function remove(i: number) {
    setAnswer((a) => a.filter((_, idx) => idx !== i));
    setShowResult(false);
  }

  function clearAll() {
    setAnswer([]);
    setShowResult(false);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = answerIds.indexOf(active.id as string);
    const newIndex = answerIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    setAnswer((a) => arrayMove(a, oldIndex, newIndex));
    setShowResult(false);
  }

  // ── Results ──
  const correct = answer.join(" ") === CORRECT_SENTENCE;
  const submitted = showResult && answer.length > 0;

  const wordResults = useMemo(
    () =>
      answer.map((w, i) => ({
        word: w,
        correctPosition: CORRECT_WORDS[i] === w,
        exists: CORRECT_WORDS.includes(w),
      })),
    [answer],
  );

  const correctCount = wordResults.filter((r) => r.correctPosition).length;

  return (
    <StudentShell noHeader>
      <AnimatedPage>
        {/* ════════════════════════════════════════ */}
        {/* PREMIUM PROGRESS */}
        {/* ════════════════════════════════════════ */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <div className="h-2 rounded-full bg-sora-tint-soft overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sakura to-sakura-soft"
                initial={{ width: "0%" }}
                animate={{ width: "60%" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-0.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className={`block h-1.5 w-1.5 rounded-full transition-colors ${
                    i < 6 ? "bg-white" : "bg-sora-tint-soft"
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="text-xs font-bold text-ink-soft">Soal 6 dari 10</span>
        </div>

        {/* ════════════════════════════════════════ */}
        {/* QUESTION */}
        {/* ════════════════════════════════════════ */}
        <motion.div
          className="mt-6 rounded-card border border-line bg-paper p-5 text-center shadow-soft"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mx-auto mb-3 inline-flex items-center gap-1.5 rounded-full bg-sora-tint-soft px-3 py-1">
            <Shuffle size={12} className="text-sora" />
            <span className="text-[11px] font-semibold text-sora">Susun Kalimat</span>
          </div>
          <p className="text-base font-bold text-ink">
            Buat kalimat dari:{" "}
            <span className="text-sora">&ldquo;Saya makan nasi&rdquo;</span>
          </p>
          <p className="mt-1 text-xs text-ink-soft">Seret kata untuk mengubah urutan</p>
        </motion.div>

        {/* ════════════════════════════════════════ */}
        {/* ANSWER AREA — premium */}
        {/* ════════════════════════════════════════ */}
        <motion.div
          className="mt-4 min-h-[120px] rounded-card border-2 border-dashed transition-all duration-300 bg-paper p-4"
          layout
          style={{
            borderColor: submitted
              ? correct
                ? "var(--color-success)"
                : "var(--color-error)"
              : answer.length > 0
                ? "var(--color-sora)"
                : "var(--color-sora-tint-soft)",
            backgroundColor: submitted
              ? correct
                ? "rgba(16,185,129,0.04)"
                : "rgba(239,68,68,0.04)"
              : answer.length > 0
                ? "rgba(43,58,103,0.02)"
                : undefined,
          }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium text-ink-soft">
              {answer.length === 0 ? (
                <>
                  <Sparkles size={12} className="text-gold" />
                  Susunan kamu
                </>
              ) : (
                <>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sora/10 text-[10px] font-bold text-sora">
                    {answer.length}
                  </span>
                  {answer.length} kata
                </>
              )}
            </span>
            <div className="flex items-center gap-2">
              {answer.length > 0 && !submitted && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={clearAll}
                  className="flex items-center gap-1 rounded-full bg-ink-soft/10 px-2.5 py-1 text-[11px] font-semibold text-ink-soft transition-colors hover:bg-error/10 hover:text-error"
                >
                  <Trash2 size={12} /> Hapus
                </motion.button>
              )}
              {!submitted && !hintShown && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setHintShown(true)}
                  className="text-[11px] font-semibold text-sora transition-colors hover:text-sora-tint"
                >
                  Petunjuk
                </motion.button>
              )}
            </div>
          </div>

          {/* Answer chips */}
          {answer.length === 0 ? (
            <motion.div
              className="flex h-16 items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-center text-sm text-ink-soft/60">
                Tap kata di bawah untuk menyusun kalimat
              </p>
            </motion.div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={answerIds}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex flex-wrap gap-3 pt-3">
                  <AnimatePresence mode="popLayout">
                    {answer.map((w, i) => (
                      <SortableChip
                        key={`ans-${w}-${i}`}
                        id={`ans-${w}-${i}`}
                        word={w}
                        index={i}
                        onRemove={() => remove(i)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* Hint */}
          <AnimatePresence>
            {hintShown && !submitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-3"
              >
                <div className="rounded-btn bg-sora-tint-soft/60 px-3 py-2 text-center">
                  <p className="text-xs text-ink-soft">
                    Petunjuk: Gunakan pola{" "}
                    <span className="font-semibold text-sora">[Subjek] + [Objek] + [Partikel] + [Kata Kerja]</span>
                  </p>
                  <button
                    onClick={() => setHintShown(false)}
                    className="mt-1 text-[10px] font-semibold text-ink-soft/60"
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ════════════════════════════════════════ */}
        {/* WORD POOL — polished */}
        {/* ════════════════════════════════════════ */}
        <motion.div
          className="mt-4 flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="popLayout">
            {POOL.map((w, i) => {
              const isUsed = answer.includes(w);
              return (
                <motion.button
                  key={w}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: isUsed ? 0.3 : 1,
                    scale: isUsed ? 0.9 : 1,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  disabled={isUsed}
                  onClick={() => !isUsed && add(w)}
                  className={`
                    jp relative overflow-hidden rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all
                    ${
                      isUsed
                        ? "border-ink-soft/10 bg-paper text-ink-soft/30 cursor-not-allowed"
                        : "border-sora/20 bg-paper text-sora hover:bg-sora hover:text-white hover:border-sora active:scale-95 shadow-soft-sm"
                    }
                  `}
                >
                  {/* Index number */}
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-sora/10 text-[8px] font-bold text-sora/30">
                    {i + 1}
                  </span>
                  {w}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* ════════════════════════════════════════ */}
        {/* SUBMIT + FEEDBACK */}
        {/* ════════════════════════════════════════ */}
        <div className="mt-5">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
            <Button
              fullWidth
              size="lg"
              disabled={answer.length === 0}
              onClick={() => setShowResult(true)}
            >
              <Check size={18} /> Periksa Jawaban
            </Button>
          </motion.div>

          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -12, height: 0 }}
                className="mt-4 overflow-hidden space-y-3"
              >
                {correct ? (
                  /* ── Correct feedback premium ── */
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="rounded-card bg-gradient-to-br from-success/10 to-emerald-50 border border-success/20 px-5 py-5 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-success"
                    >
                      <Check size={24} className="text-white" strokeWidth={3} />
                    </motion.div>
                    <p className="text-lg font-bold text-success">Benar!</p>
                    <p className="mt-1 text-sm font-bold text-sora jp">{CORRECT_SENTENCE}</p>
                    <p className="mt-1 text-xs text-ink-soft">Susunan kalimat sempurna!</p>
                  </motion.div>
                ) : (
                  /* ── Incorrect feedback premium ── */
                  <>
                    <div className="rounded-card bg-gradient-to-br from-error/5 to-rose-50 border border-error/20 px-5 py-4 text-center">
                      <p className="text-base font-bold text-error">Belum tepat</p>
                      <p className="mt-1 text-xs text-ink-soft">
                        {correctCount} dari {CORRECT_WORDS.length} kata sudah di posisi yang benar
                      </p>
                    </div>

                    {/* Correct positions grid */}
                    <div className="rounded-card border border-line bg-paper p-4">
                      <p className="mb-3 text-xs font-bold tracking-wider uppercase text-ink-soft">
                        Posisi yang benar:
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {CORRECT_WORDS.map((w, i) => {
                          const userWord = answer[i];
                          const isRight = userWord === w;
                          return (
                            <div
                              key={w}
                              className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all ${
                                isRight
                                  ? "border-success/30 bg-success/5"
                                  : "border-line bg-paper"
                              }`}
                            >
                              <span className="text-[10px] font-bold text-ink-soft">
                                #{i + 1}
                              </span>
                              <span
                                className={`jp text-sm font-bold ${
                                  isRight ? "text-success" : "text-ink-soft/50"
                                }`}
                              >
                                {isRight ? <Check size={16} className="inline mr-0.5 text-success" /> : null}
                                {w}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft italic">
                      <Lightbulb size={12} className="shrink-0" /> Seret kata di area jawaban untuk mengubah urutan
                    </p>
                  </>
                )}

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={() => router.push("/m/kuis/review")}
                  >
                    Lanjut ke Review <ArrowRight size={16} className="ml-1" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AnimatedPage>
    </StudentShell>
  );
}
