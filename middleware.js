// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token"); // Retrieve token from cookies

  if (!token && request.nextUrl.pathname !== "/register") {
    // Redirect to login if token is missing and user is not already on login page
    return NextResponse.redirect(new URL("/register", request.url));
  }

  return NextResponse.next(); // Proceed if authenticated or already on login page
}

export const config = {
  matcher: ["/", "/app/:path*"], // Define protected routes
};
