"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { DataTableEmptyState } from "./data-table-empty-state";
import { getCommonPinningStyles } from "./data-table-pinning";
import type { DataTableShellProps } from "./data-table.types";
import "./data-table.css";

const DEFAULT_BODY_MAX_HEIGHT = "min(32rem, calc(100dvh - 17.5rem))";

export function DataTableShell<TData, TValue>({
  columns,
  data,
  emptyMessage = "Aucun resultat trouve.",
  onRowClick,
  pinFirstColumn = true,
  enableColumnResizing = true,
  getRowId,
  bodyMaxHeight = DEFAULT_BODY_MAX_HEIGHT,
  className,
}: DataTableShellProps<TData, TValue>) {
  const firstColumnId = useMemo(() => {
    const first = columns[0];
    if (!first) return undefined;
    if ("id" in first && first.id) return first.id;
    if ("accessorKey" in first && typeof first.accessorKey === "string")
      return first.accessorKey;
    return undefined;
  }, [columns]);

  const [columnPinning] = useState({
    left: pinFirstColumn && firstColumnId ? [firstColumnId] : [],
    right: [] as string[],
  });

  const table = useReactTable({
    data,
    columns,
    state: { columnPinning },
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    enableColumnPinning: pinFirstColumn,
    enableColumnResizing,
    columnResizeMode: "onChange",
  });

  // ✅ Calcul des tailles en CSS variables
  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: Record<string, number> = {};
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  return (
    <div
      className={cn(
        "w-full min-w-0 max-w-full overflow-hidden rounded-xl border bg-card shadow-sm",
        className
      )}
    >
      <div className="table-container" style={{ maxHeight: bodyMaxHeight }}>
        {/* ✅ CSS variables + largeur totale sur la table */}
        <table
          className="text-sm"
          style={{ ...columnSizeVars, width: table.getTotalSize() }}
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
                      // ✅ Largeur via CSS variable
                      width: `calc(var(--header-${header.id}-size) * 1px)`,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(onRowClick && "cursor-pointer hover:bg-muted/40")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles(cell.column),
                        // ✅ Largeur via CSS variable
                        width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <DataTableEmptyState message={emptyMessage} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}