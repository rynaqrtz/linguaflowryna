import { cn } from "@/lib/utils";

type Color = "sora" | "sakura" | "gold" | "success" | "error";

const fills: Record<Color, string> = {
  sora: "bg-sora",
  sakura: "bg-sakura",
  gold: "bg-gold",
  success: "bg-success",
  error: "bg-error",
};

interface ProgressBarProps {
  value: number; // 0-100
  color?: Color;
  className?: string;
  trackClass?: string;
  height?: number;
}

export function ProgressBar({
  value,
  color = "sora",
  className,
  trackClass,
  height = 8,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("w-full rounded-full bg-sora-tint-soft overflow-hidden", trackClass, className)}
      style={{ height }}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500", fills[color])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

interface RingProgressProps {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  color?: Color;
  children?: React.ReactNode;
  className?: string;
}

export function RingProgress({
  value,
  size = 120,
  stroke = 10,
  color = "sora",
  children,
  className,
}: RingProgressProps) {
  const pct = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const colorVar =
    color === "sakura"
      ? "var(--color-sakura)"
      : color === "gold"
        ? "var(--color-gold)"
        : color === "success"
          ? "var(--color-success)"
          : color === "error"
            ? "var(--color-error)"
            : "var(--color-sora)";
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-sora-tint-soft)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={colorVar}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
