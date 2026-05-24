"use client";

import { LayoutDashboard, BarChart2, Package, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarFooter } from "@/components/layout/sidebar-footer";
import { SidebarNavItem } from "@/components/layout/sidebar-nav-item";
import { isNavItemActive } from "@/components/layout/is-nav-item-active";
import { DASHBOARDSTARTPATH } from "@/lib/config";
import { cn } from "@/lib/utils";

const navItems = [
  {
    section: "General",
    items: [{ label: "Vue d'ensemble", icon: LayoutDashboard, href: DASHBOARDSTARTPATH, disabled: false }],
  },
  {
    section: "Fonctionnalites",
    items: [
      { label: "Utilisateurs", icon: Users, href: `${DASHBOARDSTARTPATH}/users`, disabled: false },
      { label: "Produits", icon: Package, href: `${DASHBOARDSTARTPATH}/products`, disabled: true },
      { label: "Commandes", icon: ShoppingCart, href: `${DASHBOARDSTARTPATH}/orders`, disabled: true },
      { label: "Rapports", icon: BarChart2, href: `${DASHBOARDSTARTPATH}/reports`, disabled: true },
    ],
  },
] as const;

interface SidebarContentProps {
  user: {
    name?: string | null;
    email: string;
    avatar?: string | null;
  };
  collapsed?: boolean;
  onNavigate?: () => void;
  className?: string;
}

export function SidebarContent({
  user,
  collapsed = false,
  onNavigate,
  className,
}: SidebarContentProps) {
  const pathname = usePathname();
  const userName = user.name?.trim() || "Utilisateur Demo";

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex shrink-0 items-center gap-2 px-3 py-4">
        <Link
          href={DASHBOARDSTARTPATH}
          onClick={onNavigate}
          className={cn("flex min-w-0 items-center", collapsed ? "justify-center" : "gap-2")}
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            S
          </div>
          <span
            className={cn(
              "overflow-hidden text-base font-semibold transition-all duration-200",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
            )}
          >
            Starter
          </span>
        </Link>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3">
        <div className="flex flex-col gap-4">
          {navItems.map((group) => (
            <div key={group.section} className="space-y-1.5">
              {!collapsed && (
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.section}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    !item.disabled && isNavItemActive(pathname, item.href);
                  return (
                    <SidebarNavItem
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      href={item.href}
                      disabled={item.disabled}
                      isActive={isActive}
                      collapsed={collapsed}
                      onNavigate={onNavigate}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="shrink-0 px-3 pb-4 pt-2">
        <SidebarFooter
          collapsed={collapsed}
          name={userName}
          email={user.email || "demo@example.com"}
          avatarUrl={user.avatar ?? undefined}
        />
      </div>
    </div>
  );
}
