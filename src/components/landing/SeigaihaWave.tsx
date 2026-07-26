"use client";

/**
 * Seigaiha Wave — decorative Japanese wave divider
 * Renders subtle overlapping wave patterns.
 * Use as decorative element at scene edges.
 */
export function SeigaihaWave({
  position = "bottom",
  variant = "cream",
}: {
  position?: "top" | "bottom";
  variant?: "cream" | "yozora";
}) {
  const cls =
    variant === "yozora" ? "seigaiha-yozora" : "seigaiha";
  const pos = position === "top" ? "top-0 rotate-180" : "bottom-0";

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 ${pos} z-0 h-16 md:h-20 ${cls}`}
      aria-hidden="true"
    />
  );
}

/**
 * Full-width seigaiha banner — for section transitions
 */
export function SeigaihaBanner({ variant = "cream" }: { variant?: "cream" | "yozora" }) {
  const cls = variant === "yozora" ? "seigaiha-yozora" : "seigaiha";

  return (
    <div className={`relative w-full ${cls}`} aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-current/5 to-transparent" />
      <div className="h-16 md:h-20" />
    </div>
  );
}
