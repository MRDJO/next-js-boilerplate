import { DataTableToolbar } from "@/core/table/data-table-toolbar";

export function UserFilters({ defaultSearch }: { defaultSearch: string }) {
  return (
    <DataTableToolbar
      defaultValue={defaultSearch}
      searchParamKey="search"
      searchPlaceholder="Rechercher par nom, email, username..."
    />
  );
}
