import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;



  // If user is not authenticated and trying to access the /post-ad page
  if (!token && pathname === "/post-ad") {
    const loginUrl = new URL("/api/auth/signin", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (!token && pathname === "/my-ads") {
    const loginUrl = new URL("/api/auth/signin", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }


  // //if user is not an admin and trying to access the /admin/dashboard page
  // if (!token && pathname === "/admin/dashboard") {
  //   const loginUrl = new URL("/api/auth/signin", req.url);
  //   loginUrl.searchParams.set("callbackUrl", req.url);
  //   return NextResponse.redirect(loginUrl);
  // }
  
  

  // Allow the request to proceed
  return NextResponse.next();
}

// Apply middleware to protect only the /post-ad route
export const config = {
  matcher: ["/post-ad", "/my-ads"],
};
