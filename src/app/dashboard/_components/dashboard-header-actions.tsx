"use client";

import { ModeToggle } from "@/components/mode-toggle";
import type { AuthUser } from "@/core/auth";

interface DashboardHeaderActionsProps {
  user: AuthUser;
}

export function DashboardHeaderActions({ user }: DashboardHeaderActionsProps) {
  const name = user.name?.trim() || "Utilisateur Demo";

  return (
    <div className="flex items-center gap-2">
      <ModeToggle />
    </div>
  );
}
