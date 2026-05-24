import { DASHBOARDSTARTPATH } from "@/lib/config";
import { LayoutGrid, Users, type LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const dashboardNav = {
  brand: {
    name: "Starter",
    shortName: "ST",
  },
  overview: {
    title: "Vue d'ensemble",
    href: DASHBOARDSTARTPATH,
    icon: LayoutGrid,
  },
  items: [
    {
      title: "Utilisateurs",
      href: `${DASHBOARDSTARTPATH}/users`,
      icon: Users,
    },
  ] satisfies NavItem[],
};
