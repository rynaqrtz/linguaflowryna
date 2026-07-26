import { cn } from "@/lib/utils";
import { type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-btn border border-line bg-warm-white px-3.5 text-[15px] font-semibold text-ink",
        "transition-colors focus:border-sora focus:outline-none focus:ring-2 focus:ring-sora/20",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
