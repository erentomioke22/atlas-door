import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "./lib/get-session";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const ADMIN_PATHS = ['/admin', 'adminOrders'];
  
  if (searchParams.get('redirected') === 'true') {
    return NextResponse.next();
  }

  const session = await getServerSession();
  const pathSegments = pathname.split('/').filter(Boolean);

  // More specific route detection
  if (pathname.startsWith('/admin') || ADMIN_PATHS.includes(pathSegments[1])) {
    return handleAdminRoutes(request, session);
  }

  if (pathSegments.length === 2) {
    const protectedPaths = ['setting', 'orders', 'delivered', 'bag'];
    if (protectedPaths.includes(pathSegments[1])) {
      return handleProtectedRoutes(request, session, pathSegments[0], pathSegments[1]);
    }
  }

  return NextResponse.next();
}

function handleAdminRoutes(request: NextRequest, session: any) {
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  if (session.user.role !== 'admin') {
    return NextResponse.redirect(new URL("/not-authorized", request.url));
  }

  return NextResponse.next();
}

function handleProtectedRoutes(request: NextRequest, session: any, routeUserName: string, protectedPath: string) {
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (routeUserName !== session.user.name) {
    const correctUrl = new URL(`/${session.user.name}/${protectedPath}`, request.url);
    correctUrl.searchParams.set('redirected', 'true');
    return NextResponse.redirect(correctUrl);
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/admin/:path*",
    "/:userName/setting",
    "/:userName/orders", 
    "/:userName/delivered", 
    "/:userName/bag",
    "/:userName/adminOrders"
  ],
};
