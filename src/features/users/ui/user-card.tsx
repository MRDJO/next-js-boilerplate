"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { User } from "../model/user.types";
import { USER_STATUS_LABELS } from "../model/user.constants";

const statusVariant: Record<User["status"], "default" | "secondary" | "outline"> = {
  active: "default",
  pending: "secondary",
  inactive: "outline",
};

export function UserCard({ row }: { row: User }) {
  const initials = row.fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{row.fullName}</p>
          <p className="truncate text-xs text-muted-foreground">@{row.username}</p>
        </div>
        <Badge variant="secondary" className="shrink-0">
          {row.role.name}
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <span className="truncate">{row.email}</span>
        <span className="truncate">{row.department}</span>
        <span className="truncate">{row.jobTitle}</span>
        <span className="truncate">
          {row.city}, {row.country}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-muted-foreground">{row.employeeId}</span>
        <Badge variant={statusVariant[row.status]}>{USER_STATUS_LABELS[row.status]}</Badge>
      </div>
    </Card>
  );
}
