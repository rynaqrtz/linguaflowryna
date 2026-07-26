import { cn } from "@/lib/utils";

const palette = [
  'bg-sora', 'bg-sakura', 'bg-gold',
  'bg-sora-tint', 'bg-success', 'bg-sora-tint-2',
  'bg-[#9a6b16]', 'bg-[#b22f32]'
];

/** Map a CSS color class to its actual hex via getComputedStyle. */
function cssColor(cls: string): string {
  // Fallback dipakai kalau dipanggil di server (belum ada `document`).
  // Dulu warnanya #2b3a67 (indigo lama) — sekarang samakan dengan
  // --color-sora yang baru (#3d7dae) supaya konsisten dengan tema baru.
  if (typeof document === "undefined") return "#3d7dae";
  // Create a hidden element, apply the class, read computed bg
  const el = document.createElement("div");
  el.className = cls;
  el.style.position = "absolute";
  el.style.opacity = "0";
  el.style.pointerEvents = "none";
  document.body.appendChild(el);
  const color = getComputedStyle(el).backgroundColor;
  document.body.removeChild(el);
  return color;
}

/** Deterministic color from a name string (returns hex). */
export function colorFromName(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const cls = palette[h % palette.length];
  return cssColor(cls);
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AvatarProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  square?: boolean;
}

export function Avatar({ name, size = 40, color, className, square }: AvatarProps) {
  const bg = color ?? colorFromName(name);
  // If bg is a CSS class (starts with "bg-"), use it as className; otherwise fallback to inline style
  const isClass = bg.startsWith("bg-");
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center font-bold text-white shrink-0 select-none",
        square ? "rounded-card" : "rounded-full",
        isClass && bg,
        className,
      )}
      style={{ width: size, height: size, backgroundColor: isClass ? undefined : bg, fontSize: size * 0.38 }}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}
