import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

function baseUrl(): string {
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'https';
  if (host) return `${proto}://${host}`;
  return process.env.NEXTAUTH_URL || 'https://okayit.online';
}

export default function robots(): MetadataRoute.Robots {
  const base = baseUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/for-homes', '/safeguarding', '/privacy', '/contact'],
        disallow: [
          '/dashboard',
          '/login',
          '/api/',
          '/g/',
          '/accessibility',
          '/offline',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
