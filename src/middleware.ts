import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple password protection for admin routes
export function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check if admin is authenticated
    const isAuthenticated = request.cookies.get('admin-auth')?.value === 'authenticated'

    if (!isAuthenticated) {
      // Redirect to admin login
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}