import React from "react";
import HeaderTitle from "../_components/header-title";
import { DataTablePagination } from "@/core/table/data-table-pagination";
import {
  parseUserFilters,
  UserFilters,
  UserStats,
  UserTable,
  userService,
} from "@/features/users";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const UserPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const filters = await parseUserFilters(searchParams);
  const users = await userService.list(filters);

  return (
    <div className="flex min-h-0 min-w-0 flex-col gap-6">
      <HeaderTitle
        title="Gestion des utilisateurs"
        description="Feature pilote du nouveau socle CRUD avec repository injectable."
      />
      <UserStats total={users.total} />
      <UserFilters defaultSearch={filters.search} />
      <UserTable users={users.items} />
      <DataTablePagination
        currentPage={users.page}
        perPage={users.perPage}
        totalItems={users.total}
      />
    </div>
  );
};

export default UserPage;
