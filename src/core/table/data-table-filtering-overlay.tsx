"use client";

import type { ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface DataTableFilteringOverlayProps {
  isFiltering?: boolean;
  children: ReactNode;
  className?: string;
}

export function DataTableFilteringOverlay({
  isFiltering = false,
  children,
  className,
}: DataTableFilteringOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {isFiltering && (
        <div className="absolute top-0 right-0 left-0 z-20 h-0.5 overflow-hidden rounded-t-xl">
          <div className="animate-progress-bar h-full bg-primary" />
        </div>
      )}

      {isFiltering && (
        <div
          className="absolute inset-0 z-10 flex items-start justify-center rounded-xl bg-background/50 pt-16 backdrop-blur-[1px] animate-in fade-in duration-150"
          aria-hidden
        >
          <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 shadow-md">
            <Spinner className="size-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Filtrage en cours…</span>
          </div>
        </div>
      )}

      <div
        className={cn(
          "transition-opacity duration-150",
          isFiltering ? "opacity-60" : "opacity-100",
        )}
      >
        {children}
      </div>
    </div>
  );
}
