import React from "react";
import HeaderTitle from "../_components/header-title";
import { UserTable, parseUserFilters, userService } from "@/features/users";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const UserPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const filters = await parseUserFilters(searchParams);
  const [users, stats] = await Promise.all([
    userService.list(filters),
    userService.getStats(),
  ]);

  return (
    <div className="flex min-h-0 min-w-0 flex-col gap-6">
      <HeaderTitle
        title="Gestion des utilisateurs"
        description="Feature pilote du nouveau socle CRUD avec repository injectable."
      />
      <UserTable
        key={`${filters.search}-${filters.status ?? ""}-${filters.role ?? ""}-${filters.department ?? ""}-${filters.city ?? ""}-${filters.page}-${filters.perPage}`}
        users={users.items}
        total={users.total}
        stats={stats}
        filters={filters}
      />
    </div>
  );
};

export default UserPage;
