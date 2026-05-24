"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { dashboardNav } from "@/core/config/navigation";
import type { AuthUser } from "@/core/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: AuthUser;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const { open } = useSidebar();
  const pathname = usePathname();
  const { brand, overview, items } = dashboardNav;
  const OverviewIcon = overview.icon;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-col items-center justify-center py-6 text-center">
        {open ? (
          <Link href={overview.href} className="text-2xl font-semibold tracking-tight">
            {brand.name}
          </Link>
        ) : (
          <Link href={overview.href} className="text-xl font-bold text-primary">
            {brand.shortName}
          </Link>
        )}
      </SidebarHeader>

      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={overview.title}
              isActive={pathname === overview.href}
              asChild
            >
              <Link href={overview.href}>
                <OverviewIcon />
                <span>{overview.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarContent>
        <NavMain items={items} label="Fonctionnalites" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
