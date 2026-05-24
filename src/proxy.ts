import { NextRequest, NextResponse } from "next/server";
import { DASHBOARDSTARTPATH } from "./lib/config";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtected = pathname.startsWith(DASHBOARDSTARTPATH);
  const isLogin = pathname === "/login";
  const isRoot = pathname === "/";

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if ((isLogin || isRoot) && token) {
    return NextResponse.redirect(new URL(DASHBOARDSTARTPATH, request.url));
  }

  if (isRoot && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/", "/login"],
};
