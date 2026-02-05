import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // const token = request.cookies.get("NSmanagerSession")?.value;
  const accessToken = request.cookies.get("access_token")?.value;

  const isLoginPage = request.nextUrl.pathname === "/login";
  const isRegisterPage = request.nextUrl.pathname === "/register";
  const isCallbackPath = request.nextUrl.pathname.startsWith("/callback");
  const isPublicPath =
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api/public");

  // ถ้า path ที่ไม่ต้องป้องกัน ก็ให้ผ่านไปเลย
  if (isPublicPath) return NextResponse.next();
  if (isCallbackPath) return NextResponse.next();

  if (!accessToken && !isLoginPage && !isRegisterPage) {
    // If no token and trying to access protected route -> redirect to /login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (accessToken && (isLoginPage || isRegisterPage)) {
    // If already logged in, redirect away from login/register page
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  if (request.nextUrl.pathname === "/") {
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
