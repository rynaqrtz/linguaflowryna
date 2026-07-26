import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-btn border border-line bg-warm-white px-3.5 text-[15px] font-semibold text-ink placeholder:text-ink-soft/70",
        "transition-colors focus:border-sora focus:outline-none focus:ring-2 focus:ring-sora/20",
        className,
      )}
      {...props}
    />
  );
}
