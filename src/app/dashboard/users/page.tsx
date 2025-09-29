import { SearchParams } from "@/features/fetch_functions";
import { findPaginatedUsers } from "@/features/user/user.service";
import React from "react";
import HeaderTitle from "../_components/header-title";
import PaginateCompWrapper from "../_components/paginate-comp-wrapper";
import { Users } from "lucide-react";
import UserDataTable from "./_components/data-table";
import { userColumns } from "./_components/columns";

const UserPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const params = await searchParams;
  const page = Number(params.page || 1);
  const itemsPerPage = Number(params.itemsPerPage) || 10;
  const searchQuery = params.search || "";
  const users = await findPaginatedUsers(page, itemsPerPage, [
    `search=${searchQuery}`,
  ]);

  return (
    <div className="space-y-6">
      <HeaderTitle title="Gestion des utilisateurs" />
      <PaginateCompWrapper
        stats={
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total des Demandes </p>
                    <p className="text-2xl font-semibold">
                      {users.result?.meta.total ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
        additionnalFilters={<></>}
        table={
          <UserDataTable
            columns={userColumns}
            data={users.result?.data ?? []}
          />
        }
        currentPage={page}
        totalItems={users.result?.meta.total ?? 0}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default UserPage;
