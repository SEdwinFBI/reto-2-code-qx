import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = await verifySessionToken(cookie);

  const isAdminApi = pathname.startsWith("/api/admin/") && pathname !== "/api/admin/login";
  if (isAdminApi && !isAuthenticated) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  if (isAdminPage && !isAuthenticated) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
