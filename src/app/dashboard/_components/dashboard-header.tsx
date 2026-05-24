"use client";

import { DashboardHeaderActions } from "@/app/dashboard/_components/dashboard-header-actions";
import { MobileSheetNav } from "@/components/layout/mobile-sheet-nav";
import { SidebarToggle } from "@/components/layout/sidebar-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import type { AuthUser } from "@/core/auth";

interface DashboardHeaderProps {
  user: AuthUser;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
      <div className="flex min-w-0 items-center gap-2">
        <MobileSheetNav user={user} />
        <SidebarToggle />
        <Separator
          orientation="vertical"
          className="mr-1 hidden data-[orientation=vertical]:h-4 md:block"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Application</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <DashboardHeaderActions user={user} />
    </header>
  );
}
