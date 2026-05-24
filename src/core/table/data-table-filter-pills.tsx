"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ActiveFilter } from "./data-table.types";

interface DataTableFilterPillsProps {
  filters: ActiveFilter[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
  className?: string;
}

export function DataTableFilterPills({
  filters,
  onRemove,
  onClearAll,
  className,
}: DataTableFilterPillsProps) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2",
        "animate-in fade-in slide-in-from-top-1 duration-150",
        className,
      )}
    >
      {filters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="gap-1.5 rounded-full py-1 pr-1 pl-2.5 text-xs font-medium"
        >
          {filter.label}: {filter.displayValue}
          <button
            type="button"
            onClick={() => onRemove(filter.key)}
            className="ml-0.5 flex size-4 items-center justify-center rounded-full hover:bg-muted-foreground/20"
            aria-label={`Retirer le filtre ${filter.label}`}
          >
            <X className="size-2.5" />
          </button>
        </Badge>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="ml-auto h-7 px-2 text-xs text-muted-foreground"
        onClick={onClearAll}
      >
        Tout effacer
      </Button>
    </div>
  );
}
