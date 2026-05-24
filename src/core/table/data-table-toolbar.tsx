"use client";

import { useState } from "react";
import {
  Columns3,
  Download,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  Table2,
  X,
} from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DataTableViewMode, FilterableColumn } from "./data-table.types";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  isSearchPending?: boolean;
  filterableColumns?: FilterableColumn[];
  onFilterChange?: (key: string, value: string | null) => void;
  activeFilterKeys?: string[];
  activeFiltersCount?: number;
  onExport?: () => void;
  enableColumnVisibility?: boolean;
  view?: DataTableViewMode;
  onViewChange?: (view: DataTableViewMode) => void;
  hasCardComponent?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Rechercher...",
  searchValue = "",
  onSearchChange,
  isSearchPending,
  filterableColumns = [],
  onFilterChange,
  activeFilterKeys = [],
  activeFiltersCount = 0,
  onExport,
  enableColumnVisibility = true,
  view = "table",
  onViewChange,
  hasCardComponent = false,
}: DataTableToolbarProps<TData>) {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const availableFilters = filterableColumns.filter(
    (column) => !activeFilterKeys.includes(column.paramKey),
  );

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:w-72">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder={searchPlaceholder}
          className="h-9 pr-9 pl-9"
          aria-busy={isSearchPending}
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => onSearchChange?.("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Effacer la recherche"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <ButtonGroup aria-label="Actions du tableau" className="w-full md:w-auto">
        {filterableColumns.length > 0 && (
          <DropdownMenu open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" type="button" className="flex-1 md:flex-none">
                <SlidersHorizontal className="size-3.5" data-icon="inline-start" />
                Filtres
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1.5 flex h-4 items-center justify-center px-1 text-[10px]"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Ajouter un filtre</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableFilters.length === 0 ? (
                <DropdownMenuItem disabled>Tous les filtres sont actifs</DropdownMenuItem>
              ) : (
                availableFilters.map((column) => (
                  <DropdownMenuSub key={column.id}>
                    <DropdownMenuSubTrigger>{column.label}</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {column.options.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => {
                            onFilterChange?.(column.paramKey, option.value);
                            setFilterMenuOpen(false);
                          }}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {enableColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" type="button" className="flex-1 md:flex-none">
                <Columns3 className="size-3.5" data-icon="inline-start" />
                Colonnes
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Colonnes visibles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {hasCardComponent && (
          <Button
            variant="outline"
            size="sm"
            type="button"
            className={cn("hidden flex-1 md:inline-flex md:flex-none")}
            onClick={() => onViewChange?.(view === "table" ? "card" : "table")}
            aria-label={view === "table" ? "Vue carte" : "Vue tableau"}
          >
            {view === "table" ? (
              <LayoutGrid className="size-3.5" />
            ) : (
              <Table2 className="size-3.5" />
            )}
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          type="button"
          className="flex-1 md:flex-none"
          onClick={onExport}
        >
          <Download className="size-3.5" data-icon="inline-start" />
          Export
        </Button>
      </ButtonGroup>
    </div>
  );
}
