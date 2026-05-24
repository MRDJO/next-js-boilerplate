"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
  disabled?: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
}

function SidebarNavItemButton({
  icon: Icon,
  label,
  href,
  isActive = false,
  disabled = false,
  collapsed = false,
  onNavigate,
}: SidebarNavItemProps) {
  const itemClassName = cn(
    "group flex h-10 items-center rounded-lg px-3 text-sm transition-colors",
    collapsed ? "justify-center px-0" : "gap-2.5",
    disabled
      ? "cursor-not-allowed opacity-40"
      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
    isActive && !disabled && "bg-primary/10 text-primary font-medium",
  );

  return (
    <Link
      href={disabled ? "#" : href}
      aria-disabled={disabled}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onNavigate?.();
      }}
      className={itemClassName}
    >
      <Icon className="size-4 shrink-0" />
      <span
        className={cn(
          "overflow-hidden whitespace-nowrap transition-all duration-200",
          collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
        )}
      >
        {label}
      </span>
      {!collapsed && disabled && (
        <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
          soon
        </span>
      )}
    </Link>
  );
}

export function SidebarNavItem(props: SidebarNavItemProps) {
  if (!props.collapsed) {
    return <SidebarNavItemButton {...props} />;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <SidebarNavItemButton {...props} />
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">{props.label}</TooltipContent>
    </Tooltip>
  );
}
