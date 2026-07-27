import { HeroSkeleton, RowSkeleton } from "@/components/ui/Skeleton";

export default function StudentLoading() {
  return (
    <div className="space-y-4 pt-2">
      <HeroSkeleton />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <RowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
