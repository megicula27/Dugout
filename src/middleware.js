import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req });
  const url = req.nextUrl.clone();

  // If user is not logged in and tries to access a protected route
  if (!token && url.pathname.startsWith("/protected")) {
    url.pathname = "/auth"; // Redirect unauthenticated users to login
    return NextResponse.redirect(url);
  }

  // If user is logged in and tries to access the login page
  if (token && url.pathname === "/auth") {
    url.pathname = "/"; // Redirect authenticated users away from login
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/protected/:path*", // Matches all routes under /protected/
    "/auth", // Matches the login route
  ],
};
