import type { ColumnDef, ColumnPinningState, ColumnSizingState } from "@tanstack/react-table";

export interface DataTableShellProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  onRowClick?: (row: TData) => void;
  pinFirstColumn?: boolean;
  enableColumnResizing?: boolean;
  getRowId?: (row: TData, index: number) => string;
  /** Hauteur fixe de la zone scrollable (corps du tableau). Ex: "520px", "calc(100dvh - 18rem)" */
  bodyMaxHeight?: string;
  className?: string;
}

export type { ColumnPinningState, ColumnSizingState };
