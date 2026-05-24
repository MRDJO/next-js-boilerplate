import React from "react";
import { DashboardShell } from "@/app/dashboard/_components/dashboard-shell";
import { getAuthService } from "@/core/auth/server";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getAuthService().getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
};

export default DashboardLayout;
