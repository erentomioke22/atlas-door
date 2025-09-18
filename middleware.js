import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname, search } = req.nextUrl;

  const isProtected =
    pathname.startsWith("/admin") ||
    /^\/[^\/]+\/(setting|orders|bag|delivered|allorderadminpanell)(\/.*)?$/.test(pathname);

  if (isProtected) {
    const secure = req.cookies.get("__Secure-authjs.session-token");
    const dev = req.cookies.get("authjs.session-token");
    const hasSession = Boolean(secure?.value || dev?.value);

    if (!hasSession) {
      // const url = new URL("/", req.url);
      // url.searchParams.set("from", pathname + search);
      // return NextResponse.redirect(url);
      return NextResponse.redirect(new URL("/notFound", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/:userName/:path*",
  ],
};