import { DASHBOARDSTARTPATH } from "@/lib/config";

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === DASHBOARDSTARTPATH) {
    return pathname === DASHBOARDSTARTPATH;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
