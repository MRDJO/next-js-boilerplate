"use client";

import type React from "react";
import { SidebarContent } from "@/components/layout/sidebar-content";
import { useSidebarState } from "@/components/layout/hooks/use-sidebar-state";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps extends React.ComponentProps<"aside"> {
  user: {
    name?: string | null;
    email: string;
    avatar?: string | null;
  };
}

export function DashboardSidebar({ user, className, ...props }: DashboardSidebarProps) {
  const { collapsed } = useSidebarState();

  return (
    <aside
      className={cn(
        "hidden h-full shrink-0 overflow-hidden border-r bg-sidebar text-sidebar-foreground md:flex md:flex-col",
        "transition-[width] duration-200 ease-in-out",
        collapsed ? "w-16" : "w-60",
        className,
      )}
      {...props}
    >
      <SidebarContent user={user} collapsed={collapsed} className="h-full" />
    </aside>
  );
}
