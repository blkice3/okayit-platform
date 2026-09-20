
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { dimensions: string[] } }
) {
  const [width, height] = params.dimensions;
  const w = parseInt(width) || 800;
  const h = parseInt(height) || 600;

  // Create a simple SVG placeholder
  const svg = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8fafc"/>
      <rect x="20" y="20" width="${w-40}" height="${h-40}" rx="12" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
      <circle cx="${w/2}" cy="${h/2-40}" r="30" fill="#64748b"/>
      <text x="${w/2}" y="${h/2+10}" font-family="Arial, sans-serif" font-size="16" fill="#475569" text-anchor="middle">Care Home Space</text>
      <text x="${w/2}" y="${h/2+30}" font-family="Arial, sans-serif" font-size="14" fill="#64748b" text-anchor="middle">Interactive Virtual Tour</text>
      <text x="${w/2}" y="${h-30}" font-family="Arial, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">${w} × ${h}</text>
    </svg>
  `;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
