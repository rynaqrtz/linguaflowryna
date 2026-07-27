import { cn } from "@/lib/utils";

export function ToriiMark({
  className,
  color = "var(--color-sora)",
  width = 28,
  height = 28,
}: {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={{ width, height }} fill="none" aria-hidden="true">
      <path d="M3 9h26" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M5.5 13h21" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M9 13v14M23 13v14" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M6.5 13l1.6 0M24.5 13l-1.6 0" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ToriiMark width={size} height={size} />
      <span className="text-xl font-bold text-sora tracking-tight">LinguaFlow</span>
    </div>
  );
}
