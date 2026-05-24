"use client";

import { UserAccountMenu } from "@/components/layout/user-account-menu";

interface SidebarFooterProps {
  collapsed: boolean;
  name: string;
  email: string;
  avatarUrl?: string;
}

export function SidebarFooter({ collapsed, name, email, avatarUrl }: SidebarFooterProps) {
  return (
    <UserAccountMenu
      trigger="sidebar"
      collapsed={collapsed}
      name={name}
      email={email}
      avatarUrl={avatarUrl}
    />
  );
}
