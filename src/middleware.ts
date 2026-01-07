import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ============================================
// Route Configuration
// ============================================

// נתיבים ציבוריים - לא דורשים התחברות
const publicPaths = [
  '/',
  '/about',
  '/login',
  '/signup',
  '/forgot-password',
  '/listings',
  '/requests',
  '/how-it-works',
  '/terms',
  '/privacy',
  '/contact',
]

// נתיבים שדורשים התחברות
const protectedPaths = [
  '/profile',
  '/dashboard',
  '/settings',
  '/my-listings',
  '/my-bookings',
  '/my-requests',
]

// נתיבים שדורשים תפקיד משכיר
const lenderOnlyPaths = [
  '/list-item',
  '/my-listings',
]

// ============================================
// Helper Functions
// ============================================

function isPublicPath(pathname: string): boolean {
  // בדיקה אם הנתיב הוא נתיב ציבורי מדויק
  if (publicPaths.includes(pathname)) return true
  
  // Allow listing detail pages (public viewing)
  if (pathname.startsWith('/listing/')) return true
  
  // Allow request detail pages (public viewing)
  if (pathname.startsWith('/request/')) return true
  
  // נתיבי API, _next, קבצים סטטיים
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return true
  }
  
  return false
}

function isProtectedPath(pathname: string): boolean {
  return protectedPaths.some(path => pathname.startsWith(path))
}

function isLenderOnlyPath(pathname: string): boolean {
  return lenderOnlyPaths.some(path => pathname.startsWith(path))
}

/**
 * Get auth token from cookies
 * In production, this would verify JWT or session token
 */
function getAuthFromCookies(request: NextRequest): { isAuthenticated: boolean; role: string | null } {
  // Development: Check for dev auth cookie
  const devAuthCookie = request.cookies.get('dev-auth')
  if (devAuthCookie) {
    try {
      const authData = JSON.parse(devAuthCookie.value)
      return {
        isAuthenticated: true,
        role: authData.role || 'RENTER',
      }
    } catch {
      return { isAuthenticated: false, role: null }
    }
  }
  
  // Production: Check for real auth token
  // TODO: Implement proper JWT/session verification when next-auth is set up
  const authToken = request.cookies.get('auth-token')
  if (authToken) {
    // In production, verify the token here
    return { isAuthenticated: true, role: null }
  }
  
  return { isAuthenticated: false, role: null }
}

// ============================================
// Middleware
// ============================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }
  
  // Get auth status
  const { isAuthenticated, role } = getAuthFromCookies(request)
  
  // Check if path requires authentication
  if (isProtectedPath(pathname)) {
    if (!isAuthenticated) {
      // Redirect to login with callback URL
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      loginUrl.searchParams.set('message', 'auth_required')
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // Check if path requires lender role
  if (isLenderOnlyPath(pathname)) {
    if (!isAuthenticated) {
      // Redirect to login with callback URL and suggested role
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      loginUrl.searchParams.set('role', 'LENDER')
      loginUrl.searchParams.set('message', 'lender_required')
      return NextResponse.redirect(loginUrl)
    }
    
    // If authenticated but not a lender, show upgrade prompt
    if (role && role !== 'LENDER' && role !== 'ADMIN') {
      const upgradeUrl = new URL('/upgrade-to-lender', request.url)
      upgradeUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(upgradeUrl)
    }
  }
  
  // Handle booking paths - require authentication
  if (pathname.startsWith('/book/')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      loginUrl.searchParams.set('message', 'auth_required')
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // Default: allow access
  return NextResponse.next()
}

// ============================================
// Matcher Configuration
// ============================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
}
