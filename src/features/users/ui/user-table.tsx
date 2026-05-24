"use client";

import { useRouter } from "next/navigation";
import { DataTableShell } from "@/core/table/data-table-shell";
import type { User } from "../model/user.types";
import { userColumns } from "./user-columns";

/** Hauteur viewport du tableau users — scroll interne, pas la page */
const USERS_TABLE_BODY_HEIGHT = "calc(100dvh - 18.5rem)";

export function UserTable({ users }: { users: User[] }) {
  const router = useRouter();

  return (
    <DataTableShell
      columns={userColumns}
      data={users}
      emptyMessage="Aucun utilisateur pour le moment."
      bodyMaxHeight={USERS_TABLE_BODY_HEIGHT}
      getRowId={(user) => String(user.id)}
      onRowClick={(user) => router.push(`/dashboard/users/${user.id}`)}
    />
  );
}
