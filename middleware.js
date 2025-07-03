
// export { auth as middleware } from "@/auth"
// import { auth } from "@/auth";
import { NextResponse } from "next/server";

export function middleware (req)  {
  const { pathname } = req.nextUrl;
  const session  = req.cookies.get("authjs.session-token");
  
  // if (pathname.startsWith("/admin") && req.auth?.user?.role !== "ADMIN") {
  if (pathname.startsWith("/admin") && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)","/profile","/profile/savenews","/profile/edit-profile","/admin/news"]
};