import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Public routes that do NOT require authentication (prefix match)
const PUBLIC_PATHS = [
  '/login',
  '/privacy',           // P0-04: Privacy policy must be accessible pre-login
  '/accessibility',     // P2-04: Accessibility statement
  '/api/auth',          // NextAuth routes (signin, callback, etc.)
  '/api/signup',        // Self-registration endpoint
  '/api/contact',       // Public marketing contact form submission
  '/offline',           // PWA offline page
  '/tour',              // Public pre-arrival tour (no individual-child data)
  '/api/care-homes',    // Public branding data (filtered below)
  '/api/placeholder',   // Placeholder images
];

// Public marketing pages (EXACT match only, so '/' does not open everything)
const PUBLIC_PAGES = new Set([
  '/',
  '/for-homes',
  '/safeguarding',
  '/contact',
  '/pilot-pack.pdf',   // Public marketing download
]);

// Static file extensions to skip
const STATIC_EXTENSIONS = /\.(ico|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|eot|css|js|map|json|txt|xml|webmanifest)$/;

// Staff+ roles
const STAFF_ROLES = ['SUPER_ADMIN', 'HOME_ADMIN', 'STAFF'];

// API routes that require staff-level auth (elevated protection)
const STAFF_ONLY_API_ROUTES = [
  '/api/invite-codes',
  '/api/users',
  '/api/user-approvals',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Skip static assets and Next.js internals ──
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/sw.js') ||
    pathname.startsWith('/manifest') ||
    pathname.startsWith('/splash') ||
    pathname.startsWith('/favicon') ||
    STATIC_EXTENSIONS.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ── Personalised guide routes (/g/*) ──
  // Public entry point, but every response must be no-store, no-index and
  // no-referrer so a guide URL never leaks in a Referer header and is never
  // cached or indexed. Returned BEFORE the auth check (these are public),
  // and BEFORE addSecurityHeaders so Referrer-Policy is no-referrer, not the
  // site default.
  if (pathname === '/g' || pathname.startsWith('/g/')) {
    const gres = NextResponse.next();
    gres.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    gres.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
    gres.headers.set('Referrer-Policy', 'no-referrer');
    gres.headers.set('X-Content-Type-Options', 'nosniff');
    gres.headers.set('X-Frame-Options', 'DENY');
    return gres;
  }

  // ── Allow public marketing pages (exact match) ──
  if (PUBLIC_PAGES.has(pathname)) {
    return addSecurityHeaders(NextResponse.next());
  }

  // ── Allow public paths ──
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublicPath) {
    // Special case: /api/care-homes is only public with ?public=true
    if (pathname.startsWith('/api/care-homes') && request.nextUrl.searchParams.get('public') !== 'true') {
      // Falls through to auth check below
    } else {
      // Redirect authenticated users away from /login
      if (pathname === '/login') {
        const token = await getToken({ req: request });
        if (token?.id) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
      return addSecurityHeaders(NextResponse.next());
    }
  }

  // ── Require authentication for everything else ──
  const token = await getToken({ req: request });

  if (!token?.id) {
    // API routes return 401 JSON
    if (pathname.startsWith('/api/')) {
      // Bearer token: only allowed for specific APIs that validate it themselves
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ') && (
        pathname.startsWith('/api/alert-actions') ||
        pathname.startsWith('/api/admin') ||
        pathname.startsWith('/api/staff')
      )) {
        return addSecurityHeaders(NextResponse.next());
      }
      const r401 = NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
      return addSecurityHeaders(r401);
    }
    // P1-02: Page routes redirect to login with validated callbackUrl
    const loginUrl = new URL('/login', request.url);
    // Only allow relative paths as callbackUrl — prevent open redirect
    if (pathname.startsWith('/') && !pathname.startsWith('//') && !pathname.includes('://')) {
      loginUrl.searchParams.set('callbackUrl', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // ── Staff-only API protection ──
  const isStaffOnlyApi = STAFF_ONLY_API_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  if (isStaffOnlyApi) {
    if (!token.role || !STAFF_ROLES.includes(token.role as string)) {
      const r403 = NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
      return addSecurityHeaders(r403);
    }
  }

  // ── P1-01: Security headers on all responses ──
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Strict-Transport-Security (HSTS) — enforce HTTPS for 1 year
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  // Prevent MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // Referrer policy — send origin only for cross-origin, full URL for same-origin
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Permissions policy — disable sensitive browser features
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self), payment=()');
  // Content-Security-Policy — allow inline styles/scripts for Next.js, restrict sources
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apps.abacus.ai https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
      "img-src 'self' data: blob: https: http:",
      "media-src 'self' https: blob:",
      "frame-src 'self' https://www.youtube.com https://youtube.com https://apps.abacus.ai",
      "connect-src 'self' https://apps.abacus.ai https://www.google-analytics.com https://analytics.google.com https://*.abacusai.app",
      "frame-ancestors 'self' https://*.abacusai.app https://apps.abacus.ai",
    ].join('; ')
  );
  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image).*)',
  ],
};
