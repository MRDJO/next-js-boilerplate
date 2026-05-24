import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DataTableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
}

export function DataTableSkeleton({ columnCount = 8, rowCount = 10 }: DataTableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="flex flex-col gap-3 border-b bg-muted/20 p-3 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-9 w-full rounded-md md:w-64" />
        <Skeleton className="h-9 w-full rounded-md md:w-56" />
      </div>

      <div className="flex gap-4 border-b bg-muted/30 px-4 py-3">
        <Skeleton className="size-4 rounded" />
        {Array.from({ length: columnCount }).map((_, index) => (
          <Skeleton key={index} className="h-4 max-w-32 flex-1" />
        ))}
      </div>

      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-4 border-b px-4 py-3.5 last:border-0"
        >
          <Skeleton className="size-4 rounded" />
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn(
                "h-4 flex-1",
                colIndex === 0 && "max-w-20",
                colIndex === 1 && "max-w-36",
                colIndex === 2 && "max-w-44",
              )}
            />
          ))}
        </div>
      ))}

      <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-48 rounded-md" />
      </div>
    </div>
  );
}
