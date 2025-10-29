import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "./lib/get-session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getServerSession();

  const pathSegments = pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  const routeUserName = pathSegments[0];
  const ADMIN_PATHS = ['/admin', 'adminOrders'];
  const PROTECTED_PATHS = ['setting', 'orders', 'delivered', 'bag'];

  // const isAdminRoute = ADMIN_PATHS.some(path => pathname.includes(lastSegment));
  // const isProtectedRoute = PROTECTED_PATHS.some(path => pathname.includes(lastSegment));

  const isAdminRoute = pathname.startsWith('/admin') || ADMIN_PATHS.includes(lastSegment);
  const isProtectedRoute = PROTECTED_PATHS.includes(lastSegment);
  // پردازش مسیرهای ادمین
  if (isAdminRoute) {
    return handleAdminRoutes(request, session);
  }

  // پردازش مسیرهای محافظت شده
  if (isProtectedRoute) {
    return handleProtectedRoutes(request, session, routeUserName,lastSegment);
  }

  return NextResponse.next();
}

// هندلر مخصوص مسیرهای ادمین
function handleAdminRoutes(request: NextRequest, session: any) {
  if (!session) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
  
  if (session.user.role !== 'admin') {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}

// هندلر مخصوص مسیرهای محافظت شده
function handleProtectedRoutes(request: NextRequest, session: any, routeUserName: string,lastSegment:string) {
  if (!session) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  // بررسی تطابق userName
  if (routeUserName && routeUserName !== session.user.name) {
    return NextResponse.redirect(new URL(`/${session.user.name}/${lastSegment}`, request.url));
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