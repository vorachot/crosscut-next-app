import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("NSmanagerSession")?.value;

  const isLoginPage = request.nextUrl.pathname === "/login";
  const isPublicPath =
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api/public");

  // ถ้า path ที่ไม่ต้องป้องกัน ก็ให้ผ่านไปเลย
  if (isPublicPath) return NextResponse.next();

  if (!token && !isLoginPage) {
    // If no token and trying to access protected route -> redirect to /login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isLoginPage) {
    // If already logged in, redirect away from login page
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}
export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - static files (_next/static)
     * - public API
     * - favicon
     */
    "/((?!_next/static|_next/image|favicon.ico|api/public).*)",
  ],
};
