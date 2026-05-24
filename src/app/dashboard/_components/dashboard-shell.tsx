"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarStateProvider } from "@/components/layout/hooks/use-sidebar-state";
import { DashboardHeader } from "@/app/dashboard/_components/dashboard-header";
import { Separator } from "@/components/ui/separator";
import Container from "@/components/container";
import type { AuthUser } from "@/core/auth";

interface DashboardShellProps {
  user: AuthUser;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <SidebarStateProvider>
      <div className="flex h-svh w-full overflow-hidden bg-background">
        <AppSidebar user={user} />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
          <DashboardHeader user={user} />
          <Separator />
          <Container className="flex min-h-0 flex-1 flex-col py-6">{children}</Container>
        </main>
      </div>
    </SidebarStateProvider>
  );
}
