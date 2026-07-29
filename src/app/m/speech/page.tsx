"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, StopCircle, AlertTriangle } from "lucide-react";
import { StudentShell } from "@/components/layout/StudentShell";
import { Button } from "@/components/ui/Button";
import { KanjiText } from "@/components/ui/KanjiText";
import { Card } from "@/components/ui/Card";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import {
  isSpeechSupported,
  isRecognitionSupported,
  speakJapanese,
  recognizeJapaneseSpeech,
  stopJapaneseRecognition,
  scorePronunciation,
} from "@/lib/speech";

const TARGET_KANJI = "私は学生です";
const TARGET_ROMAJI = "Watashi wa gakusei desu";

type Phase = "idle" | "listening" | "processing" | "error";

export default function SpeechPractice() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const supported = isRecognitionSupported();

  const startListening = useCallback(async () => {
    setPhase("listening");
    setErrorMsg("");
    try {
      const result = await recognizeJapaneseSpeech();
      setPhase("processing");
      const score = scorePronunciation(TARGET_KANJI, result.transcript, result.confidence);
      sessionStorage.setItem("lf-speech-result", JSON.stringify(score));
      router.push("/m/speech/hasil");
    } catch (err) {
      setPhase("error");
      const message = err instanceof Error ? err.message : "unknown";
      setErrorMsg(
        message === "no-speech"
          ? "Tidak ada suara terdengar. Coba lagi lebih dekat ke mikrofon."
          : message === "not-allowed" || message === "permission-denied"
            ? "Izin mikrofon ditolak. Aktifkan izin mikrofon di browser kamu."
            : "Gagal mengenali suara. Coba lagi.",
      );
    }
  }, [router]);

  const stopListening = useCallback(() => {
    stopJapaneseRecognition();
    setPhase("idle");
  }, []);

  return (
    <StudentShell noHeader>
      <AnimatedPage>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-ink">Latihan Ucapan</h1>
          <p className="text-sm text-ink-soft">Kalimat 3 dari 10</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="mt-4 text-center transition-all hover:shadow-soft-lg" padded>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-sora transition-colors hover:text-sora-tint disabled:opacity-40"
              aria-label="Dengar contoh"
              disabled={!isSpeechSupported()}
              onClick={() => speakJapanese(TARGET_KANJI)}
            >
              <Volume2 size={14} /> Dengar Contoh Native
            </motion.button>
            <KanjiText
              kanji={TARGET_KANJI}
              furigana="わたしはがくせいです"
              romaji={TARGET_ROMAJI}
              size="lg"
            />
            <p className="mt-3 text-sm text-ink-soft">Saya adalah murid</p>
          </Card>
        </motion.div>

        {!supported && (
          <Card className="mt-6 border-error/30 bg-error/5" padded>
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-error" />
              <p className="text-sm text-ink-soft">
                Browser kamu belum mendukung speech recognition. Coba buka di Chrome versi desktop atau Android
                terbaru.
              </p>
            </div>
          </Card>
        )}

        {phase === "error" && (
          <Card className="mt-6 border-error/30 bg-error/5" padded>
            <p className="text-sm text-error">{errorMsg}</p>
          </Card>
        )}

        <div className="mt-8 flex h-20 items-center justify-center gap-[3px]">
          {Array.from({ length: 32 }).map((_, i) => {
            const amplitude = phase === "listening" ? 20 + Math.abs(Math.sin(i * 0.7)) * 55 : 8;
            return (
              <motion.span
                key={i}
                className="w-[3px] rounded-full"
                style={{
                  backgroundColor:
                    phase === "listening"
                      ? i % 3 === 0
                        ? "var(--color-sakura)"
                        : i % 3 === 1
                          ? "var(--color-sora)"
                          : "var(--color-gold)"
                      : "var(--color-sora-tint-soft)",
                }}
                animate={{
                  height: `${amplitude}%`,
                  opacity: phase === "listening" ? 1 : 0.3,
                }}
                transition={{
                  height: {
                    duration: 0.4,
                    ease: "easeInOut",
                    repeat: phase === "listening" ? Infinity : 0,
                    repeatType: "reverse",
                  },
                  opacity: { duration: 0.2 },
                }}
              />
            );
          })}
        </div>

        <AnimatePresence>
          {phase === "listening" && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-2 text-center text-sm font-bold text-sakura"
            >
              Mendengarkan…
            </motion.p>
          )}
          {phase === "processing" && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-2 text-center text-sm font-bold text-sora"
            >
              Menganalisis ucapanmu…
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-8 flex justify-center">
          <motion.button
            onClick={phase === "listening" ? stopListening : startListening}
            disabled={!supported || phase === "processing"}
            className="relative flex h-24 w-24 items-center justify-center rounded-full text-white shadow-soft-lg disabled:opacity-40"
            style={{
              backgroundColor: phase === "listening" ? "var(--color-error)" : "var(--color-sakura)",
            }}
            whileHover={{ scale: supported ? 1.05 : 1 }}
            whileTap={{ scale: supported ? 0.92 : 1 }}
            animate={
              phase === "listening"
                ? {
                    scale: [1, 1.06, 1],
                    boxShadow: [
                      "0 8px 30px rgba(194,77,119,0.3)",
                      "0 8px 50px rgba(194,77,119,0.5)",
                      "0 8px 30px rgba(194,77,119,0.3)",
                    ],
                  }
                : { boxShadow: "0 8px 30px rgba(194,77,119,0.25)" }
            }
            transition={
              phase === "listening"
                ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.3 }
            }
            aria-label={phase === "listening" ? "Stop rekaman" : "Mulai rekaman"}
          >
            {phase === "listening" && (
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: "var(--color-error)" }}
                initial={{ opacity: 0.4, scale: 1 }}
                animate={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            {phase === "listening" ? (
              <StopCircle size={36} className="relative z-10" />
            ) : (
              <Mic size={36} className="relative z-10" />
            )}
          </motion.button>
        </div>

        <motion.p
          className="mt-4 text-center text-xs text-ink-soft"
          animate={phase === "listening" ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
          transition={phase === "listening" ? { duration: 1.5, repeat: Infinity } : { duration: 0.3 }}
        >
          {phase === "listening" ? "Merekam — tap untuk stop" : "Tap mikrofon untuk mulai, lalu ucapkan kalimatnya"}
        </motion.p>
      </AnimatedPage>
    </StudentShell>
  );
}
