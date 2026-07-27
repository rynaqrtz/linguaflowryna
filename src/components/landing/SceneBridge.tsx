export function SceneBridge({
  from = "cream",
  to = "yozora",
}: {
  from?: "cream" | "yozora";
  to?: "cream" | "yozora";
}) {
  const fromColor = from === "yozora" ? "var(--color-yozora)" : "var(--color-cream)";
  const toColor = to === "yozora" ? "var(--color-yozora)" : "var(--color-cream)";

  return (
    <div
      className="relative h-24 w-full md:h-32"
      style={{
        background: `linear-gradient(to bottom, ${fromColor} 0%, ${toColor} 100%)`,
      }}
      aria-hidden="true"
    />
  );
}
