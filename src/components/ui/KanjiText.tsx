import { cn } from "@/lib/utils";

interface KanjiTextProps {
  kanji: string;
  furigana?: string;
  romaji?: string;
  size?: "sm" | "md" | "lg" | "xl";
  align?: "left" | "center";
  className?: string;
}

const sizes = {
  sm: { k: "text-2xl", f: "text-xs", r: "text-[10px]" },
  md: { k: "text-4xl", f: "text-sm", r: "text-xs" },
  lg: { k: "text-6xl", f: "text-base", r: "text-sm" },
  xl: { k: "text-8xl", f: "text-xl", r: "text-base" },
};

export function KanjiText({
  kanji,
  furigana,
  romaji,
  size = "md",
  align = "center",
  className,
}: KanjiTextProps) {
  return (
    <div className={cn("flex flex-col", align === "center" ? "items-center" : "items-start", className)}>
      {furigana && (
        <span className={cn("jp text-ink-soft", sizes[size].f)}>{furigana}</span>
      )}
      <span className={cn("jp-bold text-sora leading-none", sizes[size].k)}>{kanji}</span>
      {romaji && <span className={cn("text-ink-soft mt-1", sizes[size].r)}>{romaji}</span>}
    </div>
  );
}
