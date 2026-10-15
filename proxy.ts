

// export async function proxy(request: NextRequest) {
//   const { pathname, searchParams } = request.nextUrl;
//   const ADMIN_PATHS = ['/admin', 'adminOrders'];
  
//   if (searchParams.get('redirected') === 'true') {
//     return NextResponse.next();
//   }

//   // const session = await getServerSession(headers: request.headers);
//   const session = await auth.api.getSession({
//     headers: request.headers 
//   });
//   console.log(session)
//   const pathSegments = pathname.split('/').filter(Boolean);

//   // More specific route detection
//   if (pathname.startsWith('/admin') || ADMIN_PATHS.includes(pathSegments[1])) {
//     return handleAdminRoutes(request, session);
//   }

//   if (pathSegments.length === 2) {
//     const protectedPaths = ['setting', 'orders', 'delivered', 'bag'];
//     if (protectedPaths.includes(pathSegments[1])) {
//       return handleProtectedRoutes(request, session, pathSegments[0], pathSegments[1]);
//     }
//   }

//   return NextResponse.next();
// }

// function handleAdminRoutes(request: NextRequest, session: any) {
//   if (!session) {
//     const loginUrl = new URL("/login", request.url);
//     loginUrl.searchParams.set('callbackUrl', request.url);
//     return NextResponse.redirect(loginUrl);
//   }
  
//   if (session.user.role !== 'admin') {
//     return NextResponse.redirect(new URL("/not-authorized", request.url));
//   }

//   return NextResponse.next();
// }

// function handleProtectedRoutes(request: NextRequest, session: any, routeUserName: string, protectedPath: string) {
//   if (!session) {
//     const loginUrl = new URL("/login", request.url);
//     loginUrl.searchParams.set('callbackUrl', request.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   if (routeUserName !== session.user.name) {
//     const correctUrl = new URL(`/${session.user.name}/${protectedPath}`, request.url);
//     correctUrl.searchParams.set('redirected', 'true');
//     return NextResponse.redirect(correctUrl);
//   }

//   return NextResponse.next();
// }



import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const ADMIN_PATHS = ['/admin', 'adminOrders'];

  if (searchParams.get('redirected') === 'true') {
    return NextResponse.next();
  }

  // فقط چک وجود کوکی - سریع و بدون دیتابیس
  const sessionCookie = getSessionCookie(request);
  const pathSegments = pathname.split('/').filter(Boolean);

  if (pathname.startsWith('/admin') || ADMIN_PATHS.includes(pathSegments[1])) {
    if (!sessionCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathSegments.length === 2) {
    const protectedPaths = ['setting', 'orders', 'delivered', 'bag'];
    if (protectedPaths.includes(pathSegments[1])) {
      if (!sessionCookie) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set('callbackUrl', request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/:userName/setting",
    "/:userName/orders",
    "/:userName/delivered",
    "/:userName/bag",
    "/:userName/adminOrders"
  ]
};