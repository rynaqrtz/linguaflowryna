"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ScrollHint } from "@/components/landing/ScrollHint";

/**
 * Scene 4 — AI SENSEI DEMO
 * Chat panel slides from right. Bubbles appear with typing delay.
 */
export function AISenseiDemo() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const xPanel = useTransform(scrollYProgress, [0, 0.4], [80, 0]);
  const opPanel = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const bubble1 = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const bubble2 = useTransform(scrollYProgress, [0.4, 0.55], [0, 1]);
  const bubble3 = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);

  return (
    <section aria-label="AI Sensei demo" ref={ref} className="relative h-[140vh] bg-cream">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6 md:px-10">
        <div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center pb-8 md:pb-10">
          <motion.div
            style={{ x: xPanel, opacity: opPanel }}
            className="w-full rounded-2xl border border-line bg-white p-6 shadow-xl md:p-8 dark:bg-yozora-soft/80"
          >
            {/* header */}
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gold">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-bold text-yozora">Teman Belajar</p>
                <p className="text-xs text-ink-soft">Siap bantu kamu belajar</p>
              </div>
            </div>

            {/* chat bubbles */}
            <div className="space-y-4">
              {/* user bubble */}
              <motion.div
                style={{ opacity: bubble1 }}
                className="flex justify-end"
              >
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-yozora px-4 py-3 text-sm text-cream">
                  Apa bedanya は sama が?
                </div>
              </motion.div>

              {/* AI thinking dots */}
              <motion.div
                style={{ opacity: bubble2 }}
                className="flex items-center gap-2"
              >
                <div className="flex gap-1 rounded-2xl rounded-bl-md bg-cream-deep px-4 py-3 dark:bg-white/10">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-ink-soft/40 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-ink-soft/40 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-ink-soft/40 [animation-delay:300ms]" />
                </div>
              </motion.div>

              {/* AI response */}
              <motion.div
                style={{ opacity: bubble3 }}
                className="flex justify-start"
              >
                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-cream-deep px-4 py-3 text-sm text-yozora">
                  <p className="font-semibold text-sakura">は untuk topik.</p>
                  <p className="font-semibold text-sakura mt-1">が untuk subjek.</p>
                  <p className="mt-2 text-ink-soft">
                    Contoh:
                    <br />
                    <span lang="ja" className="jp">わたしは学生です。</span>
                    <span className="block text-xs text-ink-soft">(saya sebagai topik)</span>
                    <span lang="ja" className="jp mt-1 block">わたしが学生です。</span>
                    <span className="block text-xs text-ink-soft">
                      (saya sebagai subjek — yang membedakan)
                    </span>
                  </p>
                  <div className="mt-3 h-px bg-line" />
                  <p className="mt-2 text-xs text-ink-soft">
                    <span className="inline-flex items-center gap-1 font-semibold text-gold">
                      <Sparkles size={12} /> Sensei:
                    </span>{" "}
                    &quot;Bayangin は kayak tanda &quot;ngomongin tentang...&quot;,
                    kalau が itu &quot;yang melakukan.&quot;
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          <ScrollHint />
        </div>
      </div>
    </section>
  );
}
