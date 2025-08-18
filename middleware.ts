import { NextResponse, type NextRequest } from "next/server"
import { authUtils } from "@/lib/auth-utils"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value

  // Protected routes
  const protectedRoutes = ["/dashboard", "/profile", "/skills/enroll"]
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const user = authUtils.verifyToken(token)
    if (!user) {
      // Clear invalid token
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("auth-token")
      return response
    }
  }

  // Redirect authenticated users away from auth pages
  const authRoutes = ["/login", "/register"]
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname)

  if (isAuthRoute && token) {
    const user = authUtils.verifyToken(token)
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
