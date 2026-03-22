import { NextRequest, NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export {default} from "next-auth/middleware"
import {getToken} from "next-auth/jwt"
import { redirect } from "next/dist/server/api-utils";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req: request})
    const url = request.nextUrl

    if(token &&  
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname.startsWith('/') 
        )
    ) {
        return NextResponse.redirect(new URL ('/dashboard, request.url'))
    }
    if(!token && url.pathname.startsWith('/dashboard')){
      return NextResponse.redirect(new URL('/sign-in'))
    }
    return NextResponse.next()
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }


// see "matching paths" below to learn more 
// part 2 : in which path we have to run the middleware 
export const config = {
  matcher: ["/sign-in",
    "/sign-up",
    "/",
    "/dashboard/:path*",
    '/verify/:path*'
  ],
};
