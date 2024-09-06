import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;

  const protectedPaths = ["/", "/account", "/transactions"];
  const isProtectedRoute = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Check if the route is protected
  if (isProtectedRoute) {
    if (!token) {
      // No token present, redirect to sign-in
      console.log("No token found, redirecting to /signin");
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    try {
      // Verify the JWT token
      await jwtVerify(token, secret);
    } catch (error) {
      // Token verification failed, redirect to sign-in
      console.log("Token verification failed, redirecting to /signin", error);
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account", "/transactions", "/"],
};
