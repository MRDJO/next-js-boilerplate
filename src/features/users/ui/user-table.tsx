"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Clock, UserCheck, Users, UserX } from "lucide-react";
import { DataTableShell } from "@/core/table/data-table-shell";
import type { StatCard } from "@/core/table/data-table.types";
import type { ParsedUserFilters } from "../model/user.filters";
import type { User, UserStatsSummary } from "../model/user.types";
import { useUserTableUrl } from "../hooks/use-user-table-url";
import { UserCard } from "./user-card";
import { userColumns } from "./user-columns";

const USERS_TABLE_BODY_HEIGHT = "calc(100dvh - 28rem)";

interface UserTableProps {
  users: User[];
  total: number;
  stats: UserStatsSummary;
  filters: ParsedUserFilters;
}

export function UserTable({ users, total, stats, filters }: UserTableProps) {
  const router = useRouter();
  const {
    searchValue,
    setSearchValue,
    onFilterChange,
    onClearFilters,
    activeFilters,
    hasActiveFilters,
    activeStatCardId,
    filterableColumns,
    isPending,
    updatePagination,
  } = useUserTableUrl(filters.search, filters);

  const statCards = useMemo<StatCard[]>(
    () => [
      {
        id: "total",
        label: "Total",
        value: stats.total,
        description: "utilisateurs enregistres",
        icon: Users,
      },
      {
        id: "active",
        label: "Actifs",
        value: stats.active,
        description: "comptes actifs",
        icon: UserCheck,
        accent: "emerald",
        filterKey: "status",
        filterValue: "active",
      },
      {
        id: "pending",
        label: "En attente",
        value: stats.pending,
        description: "en validation",
        icon: Clock,
        accent: "amber",
        filterKey: "status",
        filterValue: "pending",
      },
      {
        id: "inactive",
        label: "Inactifs",
        value: stats.inactive,
        description: "comptes desactives",
        icon: UserX,
        accent: "muted",
        filterKey: "status",
        filterValue: "inactive",
      },
    ],
    [stats],
  );

  const handleStatCardClick = (card: StatCard) => {
    if (card.id === "total") {
      onFilterChange("status", null);
      return;
    }

    if (!card.filterKey || !card.filterValue) {
      return;
    }

    const isActive =
      card.filterKey === "status" && filters.status === card.filterValue;

    onFilterChange(card.filterKey, isActive ? null : card.filterValue);
  };

  return (
    <DataTableShell
      columns={userColumns}
      data={users}
      bodyMaxHeight={USERS_TABLE_BODY_HEIGHT}
      getRowId={(user) => String(user.id)}
      onRowClick={(user) => router.push(`/dashboard/users/${user.id}`)}
      enableRowSelection
      enableColumnVisibility
      searchPlaceholder="Rechercher par nom, email, matricule..."
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      isSearchPending={isPending}
      filterableColumns={filterableColumns}
      activeFilters={activeFilters}
      onFilterChange={onFilterChange}
      onClearFilters={onClearFilters}
      hasActiveFilters={hasActiveFilters}
      statCards={statCards}
      activeStatCardId={activeStatCardId}
      onStatCardClick={handleStatCardClick}
      totalItems={total}
      entityLabel="utilisateur"
      pagination={{
        currentPage: filters.page,
        perPage: filters.perPage,
        totalItems: total,
        onPageChange: (page) => updatePagination(page),
        onItemPerPageChange: (perPage) => updatePagination(1, perPage),
      }}
      emptyMessage="Aucun utilisateur trouve."
      cardComponent={UserCard}
    />
  );
}
