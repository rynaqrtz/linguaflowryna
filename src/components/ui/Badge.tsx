import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

type Tone = "sora" | "sakura" | "gold" | "success" | "error" | "neutral" | "soft";

const tones: Record<Tone, string> = {
  sora: "bg-sora-tint-soft/40 text-sora-tint-2",
  sakura: "bg-sakura/10 text-sakura",
  gold: "bg-gold/15 text-gold",
  success: "bg-success/10 text-success",
  error: "bg-error/10 text-error",
  neutral: "bg-sora-tint-soft/40 text-ink-soft",
  soft: "bg-sora-tint-soft/40 text-sora-tint-2",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "sora", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
