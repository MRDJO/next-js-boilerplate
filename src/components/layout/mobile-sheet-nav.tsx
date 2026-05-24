"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { SidebarContent } from "@/components/layout/sidebar-content";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { AuthUser } from "@/core/auth";

interface MobileSheetNavProps {
  user: AuthUser;
}

export function MobileSheetNav({ user }: MobileSheetNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Ouvrir le menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SidebarContent
          user={user}
          collapsed={false}
          onNavigate={() => setOpen(false)}
          className="bg-sidebar text-sidebar-foreground"
        />
      </SheetContent>
    </Sheet>
  );
}
