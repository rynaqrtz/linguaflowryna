"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, StopCircle } from "lucide-react";
import { StudentShell } from "@/components/layout/StudentShell";
import { Button } from "@/components/ui/Button";
import { KanjiText } from "@/components/ui/KanjiText";
import { Card } from "@/components/ui/Card";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { isSpeechSupported, speakJapanese } from "@/lib/speech";

export default function SpeechPractice() {
  const router = useRouter();
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const autoRedirectRef = useRef<number | null>(null);

  // Timer for recording duration
  useEffect(() => {
    if (recording) {
      intervalRef.current = window.setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (autoRedirectRef.current) clearTimeout(autoRedirectRef.current);
    };
  }, [recording]);

  const toggleRecording = useCallback(() => {
    if (recording) {
      // Stop recording + clear auto-redirect
      if (autoRedirectRef.current) {
        clearTimeout(autoRedirectRef.current);
        autoRedirectRef.current = null;
      }
      setRecording(false);
    } else {
      setRecording(true);
      setTimer(0);
      // Auto-redirect after 5 seconds
      autoRedirectRef.current = window.setTimeout(() => {
        setRecording(false);
        router.push("/m/speech/hasil");
      }, 5000);
    }
  }, [recording, router]);

  const timerStr = `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`;

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

        {/* Sentence card */}
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
              onClick={() => speakJapanese("私は学生です")}
            >
              <Volume2 size={14} /> Dengar Contoh Native
            </motion.button>
            <KanjiText
              kanji="私は学生です"
              furigana="わたしはがくせいです"
              romaji="Watashi wa gakusei desu"
              size="lg"
            />
            <p className="mt-3 text-sm text-ink-soft">Saya adalah murid</p>
          </Card>
        </motion.div>

        {/* Waveform — animates when recording */}
        <div className="mt-8 flex h-20 items-center justify-center gap-[3px]">
          {Array.from({ length: 32 }).map((_, i) => {
            const amplitude = recording
              ? 20 + Math.abs(Math.sin(i * 0.7 + timer * 0.3)) * 55
              : 8;
            return (
              <motion.span
                key={i}
                className="w-[3px] rounded-full"
                style={{
                  backgroundColor: recording
                    ? i % 3 === 0
                      ? "var(--color-sakura)"
                      : i % 3 === 1
                        ? "var(--color-sora)"
                        : "var(--color-gold)"
                    : "var(--color-sora-tint-soft)",
                }}
                animate={{
                  height: `${amplitude}%`,
                  opacity: recording ? 1 : 0.3,
                }}
                transition={{
                  height: {
                    duration: 0.4,
                    ease: "easeInOut",
                    repeat: recording ? Infinity : 0,
                    repeatType: "reverse",
                  },
                  opacity: { duration: 0.2 },
                }}
              />
            );
          })}
        </div>

        {/* Timer display */}
        <AnimatePresence>
          {recording && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-2 text-center text-sm font-bold text-sakura"
            >
              {timerStr}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Record button */}
        <div className="mt-8 flex justify-center">
          <motion.button
            onClick={toggleRecording}
            className="relative flex h-24 w-24 items-center justify-center rounded-full text-white shadow-soft-lg"
            style={{
              backgroundColor: recording
                ? "var(--color-error)"
                : "var(--color-sakura)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            animate={recording ? {
              scale: [1, 1.06, 1],
              boxShadow: [
                "0 8px 30px rgba(200,55,58,0.3)",
                "0 8px 50px rgba(200,55,58,0.5)",
                "0 8px 30px rgba(200,55,58,0.3)",
              ],
            } : {
              boxShadow: "0 8px 30px rgba(200,55,58,0.25)",
            }}
            transition={
              recording
                ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.3 }
            }
            aria-label={recording ? "Stop rekaman" : "Mulai rekaman"}
          >
            {recording && (
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: "var(--color-error)" }}
                initial={{ opacity: 0.4, scale: 1 }}
                animate={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            {recording ? (
              <motion.span
                className="relative z-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <StopCircle size={36} />
              </motion.span>
            ) : (
              <Mic size={36} className="relative z-10" />
            )}
          </motion.button>
        </div>

        {/* Status text */}
        <motion.p
          className="mt-4 text-center text-xs text-ink-soft"
          animate={recording ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
          transition={
            recording
              ? { duration: 1.5, repeat: Infinity }
              : { duration: 0.3 }
          }
        >
          {recording ? "Merekam — tap untuk stop" : "Tap mikrofon untuk mulai"}
        </motion.p>

        {/* Result button */}
        <AnimatePresence>
          {!recording && timer > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
            >
              <Button
                fullWidth
                size="lg"
                className="mt-6"
                onClick={() => router.push("/m/speech/hasil")}
              >
                Lihat Hasil Evaluasi
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatedPage>
    </StudentShell>
  );
}
