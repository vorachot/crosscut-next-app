import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const isLoginPage = request.nextUrl.pathname === "/login";
  const isCallbackPath = request.nextUrl.pathname.startsWith("/callback");
  const isPublicPath =
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api/public");

  // ถ้า path ที่ไม่ต้องป้องกัน ก็ให้ผ่านไปเลย
  if (isPublicPath) return NextResponse.next();
  if (isCallbackPath) return NextResponse.next();

  let isAuthenticated = false;
  let newAccessToken = accessToken;
  let newRefreshToken = refreshToken;

  try {
    // Try to authenticate with access token
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/users/me`,
      { withCredentials: true }
    );
    isAuthenticated = response.status === 200;
  } catch (error: any) {
    // If 401, try to refresh the token
    if (error.response?.status === 401 && refreshToken) {
      try {
        const refreshResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/users/auth/refresh-token`,
          { withCredentials: true }
        );

        newAccessToken = refreshResponse.data.access_token;
        newRefreshToken = refreshResponse.data.refresh_token;

        // Verify the new access token works
        const verifyResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/users/me`,
          { withCredentials: true }
        );
        isAuthenticated = verifyResponse.status === 200;
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        isAuthenticated = false;
      }
    } else {
      console.error("Error checking authentication:", error);
    }
  }

  if (!isAuthenticated && !isLoginPage) {
    // If no token and trying to access protected route -> redirect to /login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && isLoginPage) {
    // If already logged in, redirect away from login page
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  // If tokens were refreshed, set new cookies in the response
  const response = NextResponse.next();
  if (newAccessToken !== accessToken && newAccessToken) {
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }
  if (newRefreshToken !== refreshToken && newRefreshToken) {
    response.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
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
