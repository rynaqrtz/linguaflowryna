"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {

      const timer = setTimeout(() => containerRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            ref={containerRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-card bg-paper pb-8 shadow-soft-lg outline-none"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300, mass: 0.8 }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between bg-paper px-5 pb-2 pt-3">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-line" />
              {title && (
                <span className="absolute left-5 text-sm font-bold text-ink">{title}</span>
              )}
              <button
                onClick={onClose}
                aria-label="Tutup"
                className="absolute right-4 top-2.5 flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-sora-tint-soft hover:text-sora"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 pb-2">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
