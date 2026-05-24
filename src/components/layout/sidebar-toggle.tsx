"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebarState } from "@/components/layout/hooks/use-sidebar-state";
import { Button } from "@/components/ui/button";

export function SidebarToggle() {
  const { collapsed, toggle } = useSidebarState();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 shrink-0 border border-border/70"
      onClick={toggle}
      title="Ouvrir ou fermer la sidebar (⌘S ou Ctrl+S)"
      aria-label={collapsed ? "Etendre la sidebar" : "Reduire la sidebar"}
    >
      {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
    </Button>
  );
}
