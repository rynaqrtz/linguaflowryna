"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, Zap, BookOpen, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StudentShell } from "@/components/layout/StudentShell";

interface Msg {
  who: "ai" | "me";
  text: string;
  loading?: boolean;
}

const suggestions = [
  { icon: Zap, label: "Partikel を", text: "Jelaskan partikel を" },
  { icon: BookOpen, label: "Present tense", text: "Contoh kalimat present tense" },
  { icon: MessageSquare, label: "ます vs plain", text: "Perbedaan ます vs plain form" },
];

const welcomeReplies = [
  "Bisa tanya grammar, kosakata, atau cara baca kanji~",
  "Coba ketik 'Jelaskan partikel は' misalnya!",
  "Atau pilih topik di atas ya!",
];

export default function SenseiChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { who: "ai", text: "Konnichiwa! Ada yang mau ditanya soal grammar atau kosakata hari ini?" },
  ]);
  const [input, setInput] = useState("");
  const [welcomeTipIdx, setWelcomeTipIdx] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  // Rotate welcome tips
  useEffect(() => {
    if (msgs.length > 1) return;
    const t = setInterval(() => {
      setWelcomeTipIdx((i) => (i + 1) % welcomeReplies.length);
    }, 4000);
    return () => clearInterval(t);
  }, [msgs.length]);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { who: "me", text: t }, { who: "ai", text: "", loading: true }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          who: "ai",
          text: "Partikel を (wo) menandakan objek yang menerima tindakan. Contoh: ご飯を食べる (Gohan wo taberu) = makan nasi. を selalu mengikuti kata benda yang dikenai aksi kata kerja.",
        };
        return copy;
      });
    }, 1100);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function autoResize(el: HTMLTextAreaElement | null) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  return (
    <StudentShell noHeader>
      {/* Full-height chat layout — fills the area between shell top padding and bottom-nav reserve */}
      <div className="flex h-[calc(100dvh-5rem)] flex-col overflow-hidden md:mx-auto md:max-w-2xl" style={{ paddingBottom: 0 }}>
        {/* ════════════════════════════════ */}
        {/* HEADER */}
        {/* ════════════════════════════════ */}
        <div className="flex shrink-0 items-center gap-3 border-b border-line/60 bg-warm-white px-4 pb-3 pt-4">
          <motion.span
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sora to-sora-tint text-white shadow-soft"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={18} />
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-success ring-2 ring-warm-white" />
            </span>
          </motion.span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink">AI Sensei</p>
            <p className="flex items-center gap-1 text-[11px] text-success">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
              Online · Siap membantu
            </p>
            <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold">DEMO</span>
          </div>
        </div>

        {/* ════════════════════════════════ */}
        {/* MESSAGES — scrollable area */}
        {/* ════════════════════════════════ */}
        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
          <div className="mx-auto w-full max-w-2xl space-y-4">
            <AnimatePresence initial={false}>
              {msgs.map((m, i) =>
                m.who === "ai" ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-end gap-2"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sora/10 text-sora">
                      <Bot size={14} />
                    </span>
                    <div className="relative max-w-[82%]">
                      <div className="absolute -left-[6px] bottom-3 h-3 w-3 rotate-45 rounded-bl-sm border-b border-l border-line bg-paper" />
                      <div className="relative rounded-card rounded-bl-sm border border-line bg-paper px-4 py-3 text-sm leading-relaxed text-ink shadow-soft">
                        {m.loading ? (
                          <span className="flex items-center gap-1.5 px-2 py-1">
                            {[0, 0.15, 0.3].map((d) => (
                              <motion.span
                                key={d}
                                className="inline-block h-2 w-2 rounded-full bg-ink-soft"
                                animate={{ y: [0, -4, 0] }}
                                transition={{
                                  duration: 0.7,
                                  repeat: Infinity,
                                  delay: d,
                                  ease: "easeInOut",
                                }}
                              />
                            ))}
                          </span>
                        ) : (
                          <span>{m.text}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 16, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex justify-end"
                  >
                    <div className="relative max-w-[82%]">
                      <div className="absolute -right-[6px] bottom-3 h-3 w-3 rotate-45 rounded-br-sm border-r border-b border-sora bg-sora" />
                      <div className="relative rounded-card rounded-br-sm bg-sora px-4 py-3 text-sm leading-relaxed text-white shadow-soft">
                        {m.text}
                      </div>
                    </div>
                  </motion.div>
                ),
              )}
            </AnimatePresence>

            {/* Welcome suggestion cards — muncul hanya pas blom ada chat */}
            {msgs.length === 1 && !msgs[0].loading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="space-y-3 pt-2"
              >
                <p className="text-xs font-semibold text-ink-soft">Coba tanya salah satu:</p>
                <div className="grid grid-cols-1 gap-2">
                  {suggestions.map((s) => {
                    const Icon = s.icon;
                    return (
                      <motion.button
                        key={s.label}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => send(s.text)}
                        className="flex items-center gap-3 rounded-btn border border-line bg-paper px-4 py-3 text-left transition-all hover:border-sora/30 hover:shadow-soft"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sora-tint-soft text-sora">
                          <Icon size={18} />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-ink">{s.label}</p>
                          <p className="text-xs text-ink-soft">{s.text}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                {/* Rotating tip */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={welcomeTipIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="text-center text-[11px] text-ink-soft/60"
                  >
                    <Sparkles size={12} className="inline text-gold mr-0.5 -mt-0.5" /> {welcomeReplies[welcomeTipIdx]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}

            <div ref={endRef} />
          </div>
        </div>

        {/* ════════════════════════════════ */}
        {/* INPUT — fixed bottom of the flex column */}
        {/* ════════════════════════════════ */}
        <div className="shrink-0 border-t border-line/40 bg-paper px-4 pb-3 pt-3 md:px-6">
          <p className="mb-2 text-center text-[10px] text-ink-soft/70">
            Mode Demo — balasan contoh, belum terhubung ke AI.
          </p>
          <div className="mx-auto flex w-full max-w-2xl items-end gap-2">
            <div className="relative flex-1">
              <textarea
                ref={(el) => {
                  inputRef.current = el;
                  autoResize(el);
                }}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  autoResize(e.target);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Tanya soal grammar..."
                rows={1}
                className="w-full resize-none rounded-btn border border-line bg-warm-white px-4 py-2.5 pr-12 text-sm text-ink outline-none placeholder:text-ink-soft/50 transition-colors focus:border-sora/40 focus:ring-2 focus:ring-sora/10"
                style={{ maxHeight: "120px" }}
              />
            </div>
            <motion.div whileTap={{ scale: 0.9 }}>
              <button
                onClick={() => send(input)}
                disabled={!input.trim()}
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-sora text-white shadow-soft transition-all hover:bg-sora-tint disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Kirim"
              >
                <Send size={18} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </StudentShell>
  );
}
