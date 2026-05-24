"use client";

import { Download, Trash2, X } from "lucide-react";
import type { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { BulkAction } from "./data-table.types";

interface DataTableBulkBarProps<TData> {
  selectedCount: number;
  selectedRows: Row<TData>[];
  entityLabel?: string;
  bulkActions?: BulkAction<TData>[];
  onExport: () => void;
  onDelete: () => void;
  onClearSelection: () => void;
}

export function DataTableBulkBar<TData>({
  selectedCount,
  selectedRows,
  entityLabel = "element",
  bulkActions = [],
  onExport,
  onDelete,
  onClearSelection,
}: DataTableBulkBarProps<TData>) {
  if (selectedCount === 0) {
    return null;
  }

  const label =
    selectedCount > 1
      ? `${selectedCount} ${entityLabel}s selectionnes`
      : `${selectedCount} ${entityLabel} selectionne`;

  return (
    <div
      className="fixed bottom-6 left-4 right-4 z-50 flex items-center gap-2 overflow-x-auto rounded-xl border bg-card px-3 py-2 shadow-lg animate-in slide-in-from-bottom-2 duration-200 md:left-1/2 md:right-auto md:w-auto md:-translate-x-1/2 md:gap-3 md:px-4 md:py-2.5"
      role="status"
      aria-live="polite"
    >
      <span className="text-sm font-medium">{label}</span>
      <Separator orientation="vertical" className="h-4" />
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="size-3.5" data-icon="inline-start" />
        Exporter
      </Button>
      <Button variant="destructive" size="sm" onClick={onDelete}>
        <Trash2 className="size-3.5" data-icon="inline-start" />
        Supprimer
      </Button>
      {bulkActions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.id}
            variant={action.variant ?? "outline"}
            size="sm"
            onClick={() => action.onClick(selectedRows)}
          >
            {Icon && <Icon className="size-3.5" data-icon="inline-start" />}
            {action.label}
          </Button>
        );
      })}
      <Separator orientation="vertical" className="h-4" />
      <Button
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={onClearSelection}
        aria-label="Deselectionner tout"
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}
