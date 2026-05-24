import type { ComponentType } from "react";
import type { ColumnDef, Row } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";

export type DataTableViewMode = "table" | "card";

export type BulkAction<TData> = {
  id: string;
  label: string;
  icon?: LucideIcon;
  variant?: "default" | "outline" | "destructive" | "ghost";
  onClick: (rows: Row<TData>[]) => void;
};

export type StatCard = {
  id: string;
  label: string;
  value: number;
  description: string;
  icon?: LucideIcon;
  accent?: "emerald" | "amber" | "muted" | null;
  filterKey?: string;
  filterValue?: string;
};

export type FilterableColumn = {
  id: string;
  label: string;
  paramKey: string;
  options: { label: string; value: string }[];
};

export type ActiveFilter = {
  key: string;
  label: string;
  value: string;
  displayValue: string;
};

export type DataTablePaginationConfig = {
  currentPage: number;
  perPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemPerPageChange: (perPage: number) => void;
};

export interface DataTableShellProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  onRowClick?: (row: TData) => void;
  pinFirstColumn?: boolean;
  enableColumnResizing?: boolean;
  getRowId?: (row: TData, index: number) => string;
  bodyMaxHeight?: string;
  className?: string;
  enableRowSelection?: boolean;
  bulkActions?: BulkAction<TData>[];
  enableColumnVisibility?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterableColumns?: FilterableColumn[];
  activeFilters?: ActiveFilter[];
  onFilterChange?: (key: string, value: string | null) => void;
  onClearFilters?: () => void;
  statCards?: StatCard[];
  activeStatCardId?: string | null;
  onStatCardClick?: (card: StatCard) => void;
  totalItems?: number;
  entityLabel?: string;
  pagination?: DataTablePaginationConfig;
  hasActiveFilters?: boolean;
  isSearchPending?: boolean;
  cardComponent?: ComponentType<{ row: TData }>;
}

export type { ColumnDef, Row };
