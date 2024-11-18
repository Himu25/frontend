import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;

  if (pathname === "/") {
    if (token) {
      const redirectUrl = new URL("/user/portfolio", req.url);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/user/:path*", "/"],
};
