import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DataTableStatCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="size-7 rounded-md" />
          </div>
          <Skeleton className="h-7 w-12" />
          <Skeleton className="h-3 w-24" />
        </Card>
      ))}
    </div>
  );
}
