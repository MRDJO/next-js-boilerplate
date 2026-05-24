import type { ColumnDef } from "@tanstack/react-table";

function escapeCsvValue(value: unknown) {
  const stringValue = String(value ?? "");
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function getCellValue<TData>(row: TData, column: ColumnDef<TData, unknown>) {
  if ("accessorFn" in column && column.accessorFn) {
    return column.accessorFn(row, 0);
  }

  if ("accessorKey" in column && column.accessorKey) {
    const key = column.accessorKey as keyof TData;
    const value = row[key];
    if (value && typeof value === "object" && "name" in value) {
      return (value as { name: string }).name;
    }
    return value;
  }

  return "";
}

export function exportTableToCsv<TData>(
  rows: TData[],
  columns: ColumnDef<TData, unknown>[],
  filename: string,
) {
  const exportColumns = columns.filter(
    (column) => column.id !== "select" && column.id !== "actions",
  );

  const headers = exportColumns.map((column) => {
    if (typeof column.header === "string") {
      return column.header;
    }
  if ("accessorKey" in column && column.accessorKey) {
      return String(column.accessorKey);
    }
    return column.id ?? "colonne";
  });

  const csvRows = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) =>
      exportColumns.map((column) => escapeCsvValue(getCellValue(row, column))).join(","),
    ),
  ];

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
