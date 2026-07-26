import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost" | "gold" | "success";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-sakura text-white shadow-soft hover:bg-sakura/80 active:brightness-[0.92] disabled:bg-sora-tint-soft/50 disabled:text-ink-soft/50 disabled:cursor-not-allowed disabled:shadow-none",
  outline:
    "bg-white text-sora border border-line hover:border-sora hover:bg-sora-tint-soft active:brightness-[0.92] disabled:opacity-50",
  ghost:
    "bg-transparent text-sora hover:bg-sora-tint-soft active:brightness-[0.92] disabled:opacity-40",
  gold: "bg-gold text-ink shadow-soft hover:brightness-95 active:brightness-[0.92]",
  success:
    "bg-success text-white shadow-soft hover:brightness-95 active:brightness-[0.92]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-btn",
  md: "h-11 px-5 text-[15px] rounded-btn",
  lg: "h-14 px-7 text-base rounded-btn",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sora/40",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
