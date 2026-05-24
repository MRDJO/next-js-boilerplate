"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/core/auth/auth.actions";
import { cn } from "@/lib/utils";

interface UserAccountMenuProps {
  name: string;
  email: string;
  avatarUrl?: string;
  trigger?: "header" | "sidebar";
  collapsed?: boolean;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UserAccountMenu({
  name,
  email,
  avatarUrl,
  trigger = "header",
  collapsed = false,
}: UserAccountMenuProps) {
  const router = useRouter();
  const initials = getInitials(name);

  const triggerButton =
    trigger === "header" ? (
      <Button variant="outline" size="sm" className="gap-2 pl-1.5 pr-2">
        <Avatar className="size-7">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-[140px] truncate sm:inline">{name}</span>
        <ChevronDown className="size-4 text-muted-foreground" />
        <span className="sr-only">Menu compte</span>
      </Button>
    ) : (
      <button
        type="button"
        className={cn(
          "flex w-full items-center rounded-xl border border-border/60 p-2 text-left transition-colors hover:bg-muted/50",
          "data-[state=open]:bg-muted/50",
          collapsed ? "justify-center" : "gap-2.5",
        )}
      >
        <Avatar className="size-8">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "min-w-0 flex-1 overflow-hidden transition-all duration-200",
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
          )}
        >
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
        {!collapsed && <ChevronDown className="size-4 shrink-0 text-muted-foreground" />}
      </button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 rounded-lg"
        side={trigger === "header" ? "bottom" : collapsed ? "right" : "top"}
        align={trigger === "header" ? "end" : collapsed ? "center" : "start"}
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{name}</span>
              <span className="truncate text-xs text-muted-foreground">{email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={async () => {
            await logoutAction();
            router.push("/login");
          }}
        >
          <LogOut />
          Se deconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
