"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertTriangle, ChevronRight, Check, X, Zap, Sparkles } from "lucide-react";
import { StudentShell } from "@/components/layout/StudentShell";
import { Button } from "@/components/ui/Button";
import { KanjiText } from "@/components/ui/KanjiText";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { getWordByKanji } from "@/lib/vocabulary";

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: number;
  kanji: string;
  furigana: string;
  question: string;
  options: QuizOption[];
  correct: string;
}

/** Konfigurasi soal: cuma kanji + pilihan jawaban + jawaban benar yang
 *  ditulis di sini. `furigana` diambil dari lib/vocabulary.ts lewat
 *  `getWordByKanji`, supaya tidak menulis ulang data kata yang sudah ada
 *  di sana (dulu furigana masing-masing kata di-hardcode ulang di sini). */
const quizConfig: Omit<QuizQuestion, "id" | "furigana">[] = [
  {
    kanji: "食べる",
    question: "Apa arti kata di atas?",
    options: [
      { id: "A", text: "Makan" },
      { id: "B", text: "Minum" },
      { id: "C", text: "Tidur" },
      { id: "D", text: "Berjalan" },
    ],
    correct: "A",
  },
  {
    kanji: "飲む",
    question: "Apa arti kata di atas?",
    options: [
      { id: "A", text: "Makan" },
      { id: "B", text: "Minum" },
      { id: "C", text: "Tidur" },
      { id: "D", text: "Berjalan" },
    ],
    correct: "B",
  },
  {
    kanji: "学校",
    question: "Apa arti kata di atas?",
    options: [
      { id: "A", text: "Rumah" },
      { id: "B", text: "Toko" },
      { id: "C", text: "Sekolah" },
      { id: "D", text: "Kantor" },
    ],
    correct: "C",
  },
  {
    kanji: "高い",
    question: "Apa arti kata di atas?",
    options: [
      { id: "A", text: "Murah" },
      { id: "B", text: "Tinggi/Mahal" },
      { id: "C", text: "Cepat" },
      { id: "D", text: "Pendek" },
    ],
    correct: "B",
  },
  {
    kanji: "猫",
    question: "Apa arti kata di atas?",
    options: [
      { id: "A", text: "Anjing" },
      { id: "B", text: "Burung" },
      { id: "C", text: "Ikan" },
      { id: "D", text: "Kucing" },
    ],
    correct: "D",
  },
];

/** Gabungkan konfigurasi soal di atas dengan furigana dari kamus bersama. */
const soalList: QuizQuestion[] = quizConfig.map((item, i) => ({
  id: i + 1,
  furigana: getWordByKanji(item.kanji)?.furigana ?? "",
  ...item,
}));

const TIMER_DURATION = 45;

export default function KuisSoal() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [time, setTime] = useState(TIMER_DURATION);
  const [timeoutTriggered, setTimeoutTriggered] = useState(false);

  const currentSoal = soalList[currentIndex];
  const answered = picked !== null || timeoutTriggered;
  const total = soalList.length;
  const progress = ((currentIndex + 1) / total) * 100;
  const isLast = currentIndex === total - 1;

  // Countdown timer
  useEffect(() => {
    if (answered) return;
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeoutTriggered(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [answered, currentIndex]);

  // Keyboard shortcuts: 1-4 for options
  useEffect(() => {
    if (answered) return;
    function handleKey(e: KeyboardEvent) {
      const keyMap: Record<string, string> = { "1": "A", "2": "B", "3": "C", "4": "D" };
      const optionId = keyMap[e.key];
      if (optionId && currentSoal.options.find((o) => o.id === optionId)) {
        setPicked(optionId);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [answered, currentSoal]);

  const handleNext = useCallback(() => {
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
      setPicked(null);
      setTime(TIMER_DURATION);
      setTimeoutTriggered(false);
    } else {
      router.push("/m/kuis/review");
    }
  }, [isLast, router]);

  const timerPct = (time / TIMER_DURATION) * 100;
  const urgent = time <= 10;

  return (
    <StudentShell title="Soal">
      <AnimatedPage>
        {/* ════════════════════════════════════════ */}
        {/* PREMIUM PROGRESS + TIMER */}
        {/* ════════════════════════════════════════ */}
        <div className="flex items-center gap-3">
          {/* Progress track with segment indicators */}
          <div className="relative flex-1">
            <div className="h-2 rounded-full bg-sora-tint-soft overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sakura to-sakura-soft"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            {/* Dots for each question */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-0.5">
              {Array.from({ length: total }).map((_, i) => (
                <span
                  key={i}
                  className={`block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                    i < currentIndex ? "bg-sakura" : i === currentIndex ? "bg-sakura/50" : "bg-sora-tint-soft"
                  }`}
                />
              ))}
            </div>
          </div>

          <motion.span
            key={currentIndex}
            className="text-xs font-bold text-ink-soft min-w-[36px] text-right"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {currentIndex + 1}/{total}
          </motion.span>

          {/* Premium timer badge */}
          <motion.div
            className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all duration-500 ${
              urgent
                ? "bg-error/10 ring-2 ring-error/20"
                : "bg-sora-tint-soft"
            }`}
            animate={urgent ? { scale: [1, 1.04, 1] } : {}}
            transition={urgent ? { duration: 0.8, repeat: Infinity } : {}}
          >
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" className="text-sora-tint-soft" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15"
                fill="none"
                stroke={urgent ? "var(--color-error)" : "var(--color-sakura)"}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={94.2}
                strokeDashoffset={94.2 - (timerPct / 100) * 94.2}
                style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease" }}
              />
            </svg>
            <span className={`relative z-10 flex items-center gap-1 text-xs font-bold ${
              urgent ? "text-error" : "text-sakura"
            }`}>
              {urgent ? <AlertTriangle size={12} className="animate-pulse" /> : <Clock size={12} />}
              {String(time).padStart(2, "0")}s
            </span>
          </motion.div>
        </div>

        {/* ════════════════════════════════════════ */}
        {/* QUESTION CARD */}
        {/* ════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSoal.id}
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Question display */}
            <div className="mt-6 rounded-card border border-line bg-paper p-6 text-center shadow-soft">
              {/* Question number badge */}
              <div className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full bg-sora-tint-soft px-3 py-1">
                <Zap size={12} className="text-sora" />
                <span className="text-[11px] font-semibold text-sora">Soal {currentIndex + 1}</span>
              </div>

              <KanjiText kanji={currentSoal.kanji} furigana={currentSoal.furigana} size="lg" />

              <div className="mx-auto mt-5 h-px w-12 bg-line" />

              <p className="mt-4 text-base font-bold text-ink">{currentSoal.question}</p>
            </div>

            {/* ════════════════════════════════════════ */}
            {/* PREMIUM OPTIONS */}
            {/* ════════════════════════════════════════ */}
            <div className="mt-4 space-y-2.5">
              {currentSoal.options.map((o, i) => {
                const isCorrect = o.id === currentSoal.correct;
                const isPicked = picked === o.id;
                const optionLabel = ["A", "B", "C", "D"][i];

                let containerCls = "border-line bg-paper";
                let labelCls = "border-line text-ink-soft";
                let textCls = "text-ink";

                if (answered) {
                  if (isCorrect) {
                    containerCls = "border-success bg-success/5 ring-2 ring-success/20";
                    labelCls = "border-success/30 bg-success text-white";
                    textCls = "text-success";
                  } else if (isPicked) {
                    containerCls = "border-error bg-error/5 ring-2 ring-error/20";
                    labelCls = "border-error/30 bg-error text-white";
                    textCls = "text-error";
                  } else {
                    containerCls = "border-line bg-paper opacity-40";
                    labelCls = "border-line text-ink-soft";
                    textCls = "text-ink-soft";
                  }
                }

                return (
                  <motion.button
                    key={o.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    disabled={answered}
                    onClick={() => setPicked(o.id)}
                    className={`group flex w-full items-center gap-3 rounded-card border-2 px-4 py-3.5 text-left text-[15px] font-semibold transition-all duration-200 ${containerCls} ${
                      !answered
                        ? "hover:border-sora hover:bg-sora-tint-soft cursor-pointer active:scale-[0.98]"
                        : "cursor-default"
                    }`}
                  >
                    {/* Letter badge */}
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold transition-all duration-200 ${labelCls} ${
                        !answered
                          ? "group-hover:border-sora group-hover:bg-sora group-hover:text-white"
                          : ""
                      }`}
                    >
                      {answered && isCorrect ? (
                        <Check size={16} />
                      ) : answered && isPicked ? (
                        <X size={16} />
                      ) : (
                        optionLabel
                      )}
                    </span>
                    <span className={`transition-colors duration-200 ${textCls}`}>{o.text}</span>

                    {/* Right indicator */}
                    {!answered && (
                      <ChevronRight size={16} className="ml-auto shrink-0 text-ink-soft/30 transition-all group-hover:text-sora group-hover:translate-x-0.5" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* ════════════════════════════════════════ */}
            {/* TIMEOUT MESSAGE */}
            {/* ════════════════════════════════════════ */}
            <AnimatePresence>
              {timeoutTriggered && !picked && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 rounded-btn bg-error/5 border border-error/20 px-4 py-3 text-center"
                >
                  <p className="text-sm font-bold text-error">Waktu habis!</p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    Jawaban benar:{" "}
                    <span className="font-semibold text-success">
                      {currentSoal.correct}.{" "}
                      {currentSoal.options.find((o) => o.id === currentSoal.correct)?.text}
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* ════════════════════════════════════════ */}
        {/* NEXT / FINISH BUTTON */}
        {/* ════════════════════════════════════════ */}
        <motion.div
          className="mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: answered ? 1 : 0.4 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            fullWidth
            size="lg"
            disabled={!answered}
            onClick={handleNext}
            className={answered ? "transition-all active:scale-[0.98] group" : ""}
          >
            {!answered ? (
              <span className="flex items-center gap-2">
                <Clock size={16} /> Jawab dulu soal di atas
              </span>
            ) : isLast ? (
              <span className="flex items-center justify-center gap-2">
                <Sparkles size={18} /> Lihat Hasil
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1">
                Soal Selanjutnya{" "}
                <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            )}
          </Button>
        </motion.div>

        {/* ════════════════════════════════════════ */}
        {/* KEYBOARD HINT */}
        {/* ════════════════════════════════════════ */}
        <motion.div
          className="mt-4 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-[11px] text-ink-soft">Tekan</span>
          {["1", "2", "3", "4"].map((k) => (
            <kbd
              key={k}
              className="flex h-6 w-6 items-center justify-center rounded-md border border-line bg-paper text-[11px] font-bold text-sora shadow-soft transition-all hover:border-sora/30"
            >
              {k}
            </kbd>
          ))}
          <span className="text-[11px] text-ink-soft">untuk jawab cepat</span>
        </motion.div>
      </AnimatedPage>
    </StudentShell>
  );
}
