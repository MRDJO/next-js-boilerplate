"use client";

import * as React from "react";
import { DashboardSidebar } from "@/components/layout/sidebar";
import type { AuthUser } from "@/core/auth";
interface AppSidebarProps extends React.ComponentProps<"aside"> {
  user: AuthUser;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return <DashboardSidebar user={user} {...props} />;
}
