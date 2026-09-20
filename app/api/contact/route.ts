import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { prisma } from '@/lib/db';
import { sendNotification, emailWrapper, SUPER_ADMIN_EMAIL } from '@/lib/email';

export const dynamic = 'force-dynamic';

// Very small in-memory rate limit per IP. Resets when the server restarts.
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(ipHash: string): boolean {
  const now = Date.now();
  const list = (hits.get(ipHash) || []).filter((t) => now - t < RATE_WINDOW_MS);
  list.push(now);
  hits.set(ipHash, list);
  return list.length > RATE_MAX;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, role, organisation, email, message, company } = body || {};

    // Honeypot: bots fill this hidden field. Pretend success and drop it.
    if (typeof company === 'string' && company.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    // Validation
    const fields = { name, role, organisation, email, message };
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value !== 'string' || value.trim().length === 0) {
        return NextResponse.json({ error: `Please complete the ${key} field.` }, { status: 400 });
      }
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (message.trim().length > 5000) {
      return NextResponse.json({ error: 'Your message is too long.' }, { status: 400 });
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const ipHash = createHash('sha256').update(ip).digest('hex').slice(0, 32);

    if (rateLimited(ipHash)) {
      return NextResponse.json(
        { error: 'Too many messages. Please try again later.' },
        { status: 429 }
      );
    }

    // Store the enquiry
    await prisma.platformEnquiry.create({
      data: {
        name: name.trim().slice(0, 200),
        role: role.trim().slice(0, 200),
        organisation: organisation.trim().slice(0, 300),
        email: email.trim().slice(0, 200),
        message: message.trim(),
        ipHash,
      },
    });

    // Email the OKAYiT inbox
    const content = `
      <p style="color:#374151;font-size:14px;">A new pilot enquiry has arrived.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151;">
        <tr><td style="padding:6px 0;font-weight:600;width:160px;">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding:6px 0;font-weight:600;">Role</td><td>${escapeHtml(role)}</td></tr>
        <tr><td style="padding:6px 0;font-weight:600;">Home or local authority</td><td>${escapeHtml(organisation)}</td></tr>
        <tr><td style="padding:6px 0;font-weight:600;">Email</td><td>${escapeHtml(email)}</td></tr>
      </table>
      <p style="margin-top:16px;font-weight:600;color:#1f2937;font-size:14px;">Message</p>
      <p style="white-space:pre-wrap;color:#374151;font-size:14px;">${escapeHtml(message)}</p>
    `;

    await sendNotification({
      notificationId: process.env.NOTIF_ID_PLATFORM_ENQUIRY || '',
      subject: `New pilot enquiry from ${name.trim()}`,
      htmlBody: emailWrapper('New pilot enquiry', content),
      recipientEmail: SUPER_ADMIN_EMAIL,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
