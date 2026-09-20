// /g/[token] — the ONLY route that accepts a raw guide token.
// It performs the token exchange and then issues a 303 redirect to
// /g/view. The 303 removes the token from the address bar and from
// browser history: on a shared house device there is nothing left to
// find after the redirect. The guide is NEVER rendered from here and
// the token is NEVER placed in a query string.

import { NextRequest, NextResponse } from 'next/server';
import { redeemGuideToken, GUIDE_COOKIE_NAME, GRANT_TTL_MS } from '@/lib/guide-links';

export const dynamic = 'force-dynamic';

const NO_STORE_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, private',
  'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
  const userAgent = req.headers.get('user-agent') || null;

  const result = await redeemGuideToken(params.token, { ip, userAgent });

  const dest = req.nextUrl.clone();
  dest.search = '';
  dest.pathname = result.ok ? '/g/view' : '/g/unavailable';

  // Step 6 — always 303, success or failure.
  const res = NextResponse.redirect(dest, 303);
  for (const [k, v] of Object.entries(NO_STORE_HEADERS)) res.headers.set(k, v);

  if (result.ok) {
    res.cookies.set(GUIDE_COOKIE_NAME, result.grantSecret, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax', // Lax, NOT Strict: young people usually arrive from a message app (cross-site nav)
      path: '/',
      maxAge: Math.floor(GRANT_TTL_MS / 1000),
    });
  }

  return res;
}
