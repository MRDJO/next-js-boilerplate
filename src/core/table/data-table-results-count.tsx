"use client";

interface DataTableResultsCountProps {
  filteredCount: number;
  totalCount: number;
  entityLabel?: string;
  isFiltered?: boolean;
  isFiltering?: boolean;
  selectedCount?: number;
}

export function DataTableResultsCount({
  filteredCount,
  totalCount,
  entityLabel = "element",
  isFiltered = false,
  isFiltering = false,
  selectedCount = 0,
}: DataTableResultsCountProps) {
  const plural = filteredCount > 1 ? "s" : "";
  const entityPlural = totalCount > 1 ? "s" : "";

  if (selectedCount > 0) {
    return (
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{selectedCount}</span> selectionne
        {selectedCount > 1 ? "s" : ""} sur{" "}
        <span className="font-medium text-foreground">{filteredCount}</span>
      </p>
    );
  }

  if (isFiltering) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground" role="status">
        <span className="inline-block h-4 w-6 animate-pulse rounded bg-primary/10" aria-hidden />
        <span>
          resultat{plural}
          <span className="font-medium text-primary"> · filtrage…</span>
        </span>
      </div>
    );
  }

  if (isFiltered) {
    return (
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{filteredCount}</span> resultat{plural}
        <span className="font-medium text-primary"> · filtre sur {totalCount}</span>
      </p>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      <span className="font-medium text-foreground">{totalCount}</span> {entityLabel}
      {entityPlural}
    </p>
  );
}
