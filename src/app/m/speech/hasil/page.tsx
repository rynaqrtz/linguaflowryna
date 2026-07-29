"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RotateCcw, ArrowRight, Sparkles } from "lucide-react";
import { StudentShell } from "@/components/layout/StudentShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RingProgress } from "@/components/ui/ProgressBar";
import { AnimatedPage, staggerContainer, staggerItem } from "@/components/ui/AnimatedPage";
import type { PronunciationScore } from "@/lib/speech";

function verdictFor(overall: number): string {
  if (overall >= 85) return "Bagus!";
  if (overall >= 65) return "Lumayan!";
  return "Coba Lagi";
}

export default function SpeechResult() {
  const router = useRouter();
  const [score, setScore] = useState<PronunciationScore | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("lf-speech-result");
    if (!raw) {
      setNotFound(true);
      return;
    }
    try {
      setScore(JSON.parse(raw) as PronunciationScore);
    } catch {
      setNotFound(true);
    }
  }, []);

  if (notFound) {
    return (
      <StudentShell noHeader>
        <AnimatedPage>
          <div className="flex flex-col items-center pt-16 text-center">
            <p className="text-sm text-ink-soft">Belum ada hasil latihan ucapan.</p>
            <Button className="mt-4" onClick={() => router.push("/m/speech")}>
              Mulai Latihan
            </Button>
          </div>
        </AnimatedPage>
      </StudentShell>
    );
  }

  if (!score) {
    return (
      <StudentShell noHeader>
        <AnimatedPage>
          <div className="pt-16 text-center text-sm text-ink-soft">Memuat hasil…</div>
        </AnimatedPage>
      </StudentShell>
    );
  }

  const subscores = [
    { label: "Akurasi Kata", value: score.accuracy, color: "sora" as const },
    { label: "Kepercayaan Pengenalan", value: score.confidence, color: "gold" as const },
  ];

  return (
    <StudentShell noHeader>
      <AnimatedPage>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex flex-col items-center pt-4 text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <RingProgress value={score.overall} size={130} color="success">
                <span className="text-4xl font-bold text-sora">{score.overall}</span>
              </RingProgress>
            </motion.div>
            <motion.h1
              className="mt-3 text-2xl font-bold text-ink"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {verdictFor(score.overall)} <Sparkles size={28} className="inline text-gold ml-1" />
            </motion.h1>
            <span className="mt-1 inline-block rounded-full bg-sora-tint-soft px-2.5 py-0.5 text-[10px] font-bold text-sora">
              Dari pengenalan suara browser
            </span>
          </motion.div>

          <div className="mt-5 space-y-4">
            {subscores.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              >
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-semibold text-ink">{s.label}</span>
                  <motion.span
                    className="font-bold text-sora"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    {s.value}%
                  </motion.span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-sora-tint-soft overflow-hidden">
                  <motion.div
                    className={"h-2.5 rounded-full " + (s.color === "sora" ? "bg-sora" : "bg-gold")}
                    initial={{ width: "0%" }}
                    animate={{ width: `${s.value}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 + i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={staggerItem} className="mt-5 grid gap-3">
            <Card className="text-center transition-all hover:shadow-soft-lg" padded>
              <p className="mb-1 text-xs text-ink-soft">Yang browser dengar dari kamu:</p>
              <p lang="ja" className="jp text-2xl text-sora">
                {score.transcript || "(tidak terdengar)"}
              </p>
            </Card>

            <Card className="border-l-4 border-l-sora transition-all hover:shadow-soft-lg" padded>
              <p className="text-sm text-ink">
                Skor ini dihitung dari kecocokan teks yang dikenali browser dengan kalimat target, ditambah
                tingkat kepercayaan pengenalan suara. Ini belum menilai intonasi/prosodi secara mendalam —
                untuk itu perlu layanan penilaian pelafalan khusus.
              </p>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem} className="mt-6 grid grid-cols-2 gap-3">
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button variant="outline" size="lg" onClick={() => router.push("/m/speech")}>
                <RotateCcw size={18} /> Coba Lagi
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button size="lg" onClick={() => router.push("/m/speech")}>
                Kalimat Berikut <ArrowRight size={18} />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatedPage>
    </StudentShell>
  );
}
