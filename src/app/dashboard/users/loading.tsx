import HeaderTitle from "../_components/header-title";
import { DataTableSkeleton } from "@/core/table/data-table-skeleton";
import { DataTableStatCardsSkeleton } from "@/core/table/data-table-stat-cards-skeleton";

export default function UsersLoading() {
  return (
    <div className="flex min-h-0 min-w-0 flex-col gap-6">
      <HeaderTitle
        title="Gestion des utilisateurs"
        description="Feature pilote du nouveau socle CRUD avec repository injectable."
      />
      <DataTableStatCardsSkeleton />
      <DataTableSkeleton columnCount={8} rowCount={10} />
    </div>
  );
}
