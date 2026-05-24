"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { User, UserStatus } from "../model/user.types";

const formatDate = (value: string) => {
  try {
    return format(new Date(value), "dd MMM yyyy HH:mm", { locale: fr });
  } catch {
    return value;
  }
};

const statusStyles: Record<UserStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  inactive: "bg-muted text-muted-foreground",
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

const statusLabels: Record<UserStatus, string> = {
  active: "Actif",
  inactive: "Inactif",
  pending: "En attente",
};

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "employeeId",
    header: "Matricule",
    size: 108,
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.employeeId}</span>
    ),
  },
  {
    accessorKey: "fullName",
    header: "Utilisateur",
    size: 168,
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <p className="truncate text-sm font-medium">{row.original.fullName}</p>
        <p className="truncate text-xs text-muted-foreground">
          @{row.original.username}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 180,
    cell: ({ row }) => (
      <span className="block truncate text-sm">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Telephone",
    size: 130,
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.phone}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    size: 96,
    cell: ({ row }) => (
      <span className="inline-flex max-w-full truncate rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
        {row.original.role.name}
      </span>
    ),
  },
  {
    accessorKey: "department",
    header: "Departement",
    size: 120,
    cell: ({ row }) => (
      <span className="block truncate text-sm">{row.original.department}</span>
    ),
  },
  {
    accessorKey: "jobTitle",
    header: "Poste",
    size: 140,
    cell: ({ row }) => (
      <span className="block truncate text-sm">{row.original.jobTitle}</span>
    ),
  },
  {
    accessorKey: "city",
    header: "Ville",
    size: 100,
    cell: ({ row }) => (
      <span className="block truncate text-sm">{row.original.city}</span>
    ),
  },
  {
    accessorKey: "country",
    header: "Pays",
    size: 100,
    cell: ({ row }) => (
      <span className="block truncate text-sm">{row.original.country}</span>
    ),
  },
  {
    accessorKey: "manager",
    header: "Manager",
    size: 120,
    cell: ({ row }) => (
      <span className="block truncate text-sm">{row.original.manager}</span>
    ),
  },
  {
    accessorKey: "contractType",
    header: "Contrat",
    size: 88,
    cell: ({ row }) => (
      <span className="block truncate text-sm">{row.original.contractType}</span>
    ),
  },
  {
    accessorKey: "salaryBand",
    header: "Bande",
    size: 72,
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.salaryBand}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Statut",
    size: 96,
    cell: ({ row }) => (
      <span
        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[row.original.status]}`}
      >
        {statusLabels[row.original.status]}
      </span>
    ),
  },
  {
    accessorKey: "lastLoginAt",
    header: "Dern. connexion",
    size: 140,
    cell: ({ row }) => (
      <span className="block truncate text-xs text-muted-foreground">
        {formatDate(row.original.lastLoginAt)}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Cree le",
    size: 140,
    cell: ({ row }) => (
      <span className="block truncate text-xs text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
];
