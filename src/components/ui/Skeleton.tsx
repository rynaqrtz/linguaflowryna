import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = "text",
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-sora-tint-soft/60",
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4 w-full rounded",
        variant === "rectangular" && "rounded-card",
        className,
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-paper p-5 shadow-soft",
        className,
      )}
      aria-hidden="true"
    >
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="text" width="60%" className="mt-3" />
      <Skeleton variant="text" width="40%" className="mt-2" />
    </div>
  );
}

export function RowSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-card border border-line bg-paper p-4 shadow-soft",
        className,
      )}
      aria-hidden="true"
    >
      <Skeleton variant="circular" width={36} height={36} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="55%" />
        <Skeleton variant="text" width="30%" />
      </div>
    </div>
  );
}

export function HeroSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-card bg-sora-tint-soft/40 p-5 shadow-soft",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={36} height={36} />
          <div className="space-y-1.5">
            <Skeleton variant="text" width={80} height={12} />
            <Skeleton variant="text" width={120} height={14} />
          </div>
        </div>
        <Skeleton variant="circular" width={32} height={32} />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton variant="text" width="70%" height={20} />
        <Skeleton variant="text" width="100%" height={10} />
      </div>
      <Skeleton variant="rectangular" width="100%" height={48} className="mt-4" />
    </div>
  );
}
