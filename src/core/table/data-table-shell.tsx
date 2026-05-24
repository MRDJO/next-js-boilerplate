"use client";

import { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { DataTableBulkBar } from "./data-table-bulk-bar";
import { DataTableEmptyState } from "./data-table-empty-state";
import { exportTableToCsv } from "./data-table-export";
import { DataTableFilterPills } from "./data-table-filter-pills";
import { getCommonPinningStyles } from "./data-table-pinning";
import { createSelectColumn } from "./data-table-select-column";
import { DataTableStatCards } from "./data-table-stat-cards";
import { DataTableToolbar } from "./data-table-toolbar";
import type { DataTableShellProps, DataTableViewMode } from "./data-table.types";
import { PaginationControls } from "./pagination-controls";
import "./data-table.css";

const DEFAULT_BODY_MAX_HEIGHT = "min(32rem, calc(100dvh - 24rem))";

const MOBILE_HIDDEN_COLUMNS: VisibilityState = {
  manager: false,
  salaryBand: false,
  contractType: false,
  lastLoginAt: false,
  createdAt: false,
};

export function DataTableShell<TData, TValue>({
  columns,
  data,
  emptyMessage,
  onRowClick,
  pinFirstColumn = true,
  enableColumnResizing = true,
  getRowId,
  bodyMaxHeight = DEFAULT_BODY_MAX_HEIGHT,
  className,
  enableRowSelection = false,
  bulkActions,
  enableColumnVisibility = true,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filterableColumns,
  activeFilters = [],
  onFilterChange,
  onClearFilters,
  statCards,
  activeStatCardId,
  onStatCardClick,
  totalItems,
  entityLabel = "element",
  pagination,
  hasActiveFilters = false,
  isSearchPending,
  cardComponent: CardComponent,
}: DataTableShellProps<TData, TValue>) {
  const isMobile = useIsMobile();
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [view, setView] = useState<DataTableViewMode>("table");
  const [mobileColumnsApplied, setMobileColumnsApplied] = useState(false);

  useEffect(() => {
    if (!CardComponent) {
      return;
    }

    if (isMobile) {
      setView("card");
      return;
    }

    setView("table");
  }, [isMobile, CardComponent]);

  useEffect(() => {
    if (!isMobile || CardComponent || mobileColumnsApplied) {
      return;
    }

    setColumnVisibility((prev) => ({
      ...MOBILE_HIDDEN_COLUMNS,
      ...prev,
    }));
    setMobileColumnsApplied(true);
  }, [isMobile, CardComponent, mobileColumnsApplied]);

  const tableColumns = useMemo(() => {
    if (!enableRowSelection) {
      return columns;
    }
    return [createSelectColumn<TData>(), ...columns];
  }, [columns, enableRowSelection]);

  const firstColumnId = useMemo(() => {
    const first = tableColumns[0];
    if (!first) return undefined;
    if ("id" in first && first.id) return first.id;
    if ("accessorKey" in first && typeof first.accessorKey === "string") {
      return first.accessorKey;
    }
    return undefined;
  }, [tableColumns]);

  const [columnPinning] = useState({
    left: pinFirstColumn && firstColumnId ? [firstColumnId] : [],
    right: [] as string[],
  });

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      columnPinning,
      rowSelection,
      columnVisibility,
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    enableColumnPinning: pinFirstColumn,
    enableColumnResizing,
    enableRowSelection,
    columnResizeMode: "onChange",
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const displayTotal = totalItems ?? data.length;
  const rows = table.getRowModel().rows;
  const isEmpty = rows.length === 0;

  const showCardView = Boolean(CardComponent) && (isMobile || view === "card");
  const showTableView = !CardComponent || (!isMobile && view === "table");

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: Record<string, number> = {};
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  const handleExport = () => {
    const rowsToExport =
      selectedCount > 0 ? selectedRows.map((row) => row.original) : data;

    exportTableToCsv(
      rowsToExport,
      tableColumns as never,
      `export-${new Date().toISOString().slice(0, 10)}.csv`,
    );
  };

  const handleDelete = () => {
    const ids = selectedRows.map((row) => row.id).join(", ");
    window.alert(`Suppression simulee pour ${selectedCount} ligne(s): ${ids}`);
    table.resetRowSelection();
  };

  const statusLine =
    selectedCount > 0
      ? `${selectedCount} selectionne${selectedCount > 1 ? "s" : ""} sur ${displayTotal}`
      : `${displayTotal} ${entityLabel}${displayTotal > 1 ? "s" : ""}`;

  return (
    <div className={cn("flex min-w-0 flex-col gap-4", className)}>
      {statCards && statCards.length > 0 && (
        <DataTableStatCards
          cards={statCards}
          activeCardId={activeStatCardId}
          onCardClick={onStatCardClick}
        />
      )}

      <DataTableToolbar
        table={table}
        searchPlaceholder={searchPlaceholder}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        isSearchPending={isSearchPending}
        filterableColumns={filterableColumns}
        onFilterChange={onFilterChange}
        activeFilterKeys={activeFilters.map((filter) => filter.key)}
        activeFiltersCount={activeFilters.length}
        onExport={handleExport}
        enableColumnVisibility={enableColumnVisibility}
        view={view}
        onViewChange={setView}
        hasCardComponent={Boolean(CardComponent)}
      />

      <p className="text-xs text-muted-foreground">{statusLine}</p>

      <DataTableFilterPills
        filters={activeFilters}
        onRemove={(key) => onFilterChange?.(key, null)}
        onClearAll={() => onClearFilters?.()}
      />

      {showCardView && CardComponent && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {!isEmpty ? (
            rows.map((row) => (
              <button
                key={row.id}
                type="button"
                className="text-left"
                onClick={() => onRowClick?.(row.original)}
              >
                <CardComponent row={row.original} />
              </button>
            ))
          ) : (
            <div className="col-span-full rounded-xl border bg-card shadow-sm">
              <DataTableEmptyState
                variant={hasActiveFilters ? "filtered" : "default"}
                title={
                  hasActiveFilters
                    ? "Aucun resultat pour ces filtres"
                    : emptyMessage
                }
                onClearFilters={hasActiveFilters ? onClearFilters : undefined}
              />
            </div>
          )}
        </div>
      )}

      {showTableView && (
        <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border bg-card shadow-sm">
          <div
            className="table-container -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0"
            style={{ maxHeight: bodyMaxHeight }}
          >
            <table
              className="text-sm"
              style={{
                ...columnSizeVars,
                width: table.getTotalSize(),
                tableLayout: "fixed",
              }}
            >
              <thead className="sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          ...getCommonPinningStyles(header.column),
                          width: `calc(var(--header-${header.id}-size) * 1px)`,
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanResize() && (
                          <div
                            onDoubleClick={() => header.column.resetSize()}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={`resizer ${
                              header.column.getIsResizing() ? "isResizing" : ""
                            }`}
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {!isEmpty ? (
                  rows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => onRowClick?.(row.original)}
                      className={cn(
                        "transition-colors",
                        row.getIsSelected()
                          ? "bg-primary/5 hover:bg-primary/10"
                          : onRowClick && "cursor-pointer hover:bg-muted/40",
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{
                            ...getCommonPinningStyles(cell.column),
                            width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={tableColumns.length}>
                      <DataTableEmptyState
                        variant={hasActiveFilters ? "filtered" : "default"}
                        title={
                          hasActiveFilters
                            ? "Aucun resultat pour ces filtres"
                            : emptyMessage
                        }
                        onClearFilters={hasActiveFilters ? onClearFilters : undefined}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pagination && selectedCount === 0 && (
        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={Math.max(1, Math.ceil(pagination.totalItems / pagination.perPage))}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.perPage}
          loading={false}
          onPageChange={pagination.onPageChange}
          onItemPerPageChange={pagination.onItemPerPageChange}
        />
      )}

      <DataTableBulkBar
        selectedCount={selectedCount}
        selectedRows={selectedRows}
        entityLabel={entityLabel}
        bulkActions={bulkActions}
        onExport={handleExport}
        onDelete={handleDelete}
        onClearSelection={() => table.resetRowSelection()}
      />
    </div>
  );
}
