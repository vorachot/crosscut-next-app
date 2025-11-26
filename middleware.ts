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

  if (isPublicPath || isCallbackPath) return NextResponse.next();

  let isAuthenticated = false;
  let newAccessToken = accessToken;
  let newRefreshToken = refreshToken;

  try {
    // Try to authenticate using backend endpoint with cookies
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/users/me`,
      {
        withCredentials: true, // <-- include httpOnly cookies
      }
    );
    isAuthenticated = response.status === 200;
  } catch (error: any) {
    if (error.response?.status === 401 && refreshToken) {
      try {
        // Use refresh token automatically from cookie
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/users/auth/refresh-token`,
          {}, // empty body
          { withCredentials: true } // cookies sent automatically
        );

        newAccessToken = refreshResponse.data.access_token;
        newRefreshToken = refreshResponse.data.refresh_token;

        // Verify new access token works
        const verifyResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/users/me`,
          {
            withCredentials: true, // cookies included
          }
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

  // Redirect logic
  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  // Set refreshed cookies if any
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
    "/((?!_next/static|_next/image|favicon.ico|api/public).*)",
  ],
};
