// STAYING SAFE ONLINE - safeguarding flag
// Fires when a young person taps "this has happened to me".
// This is MANDATORY. It always runs. It is never a setting.
// It records WHICH scenario the flag was raised on, and never
// which option the young person chose.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { emailWrapper } from '@/lib/email';

export const dynamic = 'force-dynamic';

function isStaff(role?: string) {
  return role === 'STAFF' || role === 'HOME_ADMIN' || role === 'SUPER_ADMIN';
}

// The named on-shift recipient. Falls back to the platform admin
// mailbox so an alert is NEVER dropped.
const FALLBACK_RECIPIENT = 'admin@okayit.uk';

async function sendFlagEmail(args: {
  careHome: string;
  keyWorkerName: string;
  scenarioTitle: string;
  track: string;
  createdAt: Date;
  recipientEmail: string;
}): Promise<boolean> {
  try {
    const when = args.createdAt.toLocaleString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London',
    });
    const content = `
      <div style="background:#fef2f2;border:2px solid #ef4444;padding:16px;border-radius:8px;margin-bottom:16px;">
        <p style="margin:0;color:#b91c1c;font-weight:bold;font-size:16px;">A young person has raised a safeguarding flag.</p>
        <p style="margin:8px 0 0;color:#7f1d1d;">They tapped "this has happened to me" during an online safety session. Please check in with them now.</p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151;">
        <tr><td style="padding:6px 0;color:#6b7280;">Home</td><td style="padding:6px 0;font-weight:600;">${args.careHome}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Session run by</td><td style="padding:6px 0;font-weight:600;">${args.keyWorkerName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Section</td><td style="padding:6px 0;font-weight:600;">${args.scenarioTitle}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Track</td><td style="padding:6px 0;font-weight:600;">Track ${args.track}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Raised at</td><td style="padding:6px 0;font-weight:600;">${when}</td></tr>
      </table>
      <p style="margin:16px 0 0;color:#6b7280;font-size:13px;">This alert records the section only. It does not record what the young person tapped or typed.</p>
    `;

    const response = await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        app_id: process.env.WEB_APP_ID,
        notification_id: process.env.NOTIF_ID_ONLINE_SAFETY_SAFEGUARDING_FLAG,
        subject: `Safeguarding flag at ${args.careHome} (online safety session)`,
        body: emailWrapper('Safeguarding flag raised', content),
        is_html: true,
        recipient_email: args.recipientEmail,
        sender_email: `noreply@${new URL(process.env.NEXTAUTH_URL || 'https://okayit.online').hostname}`,
        sender_alias: 'OKAYiT Safeguarding',
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (result && result.notification_disabled) {
      // Critical notifications should not be disabled, but never claim success.
      return false;
    }
    return result?.success === true;
  } catch (err) {
    console.error('[keywork/flag email]', err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !isStaff(session.user.role)) {
      return NextResponse.json({ error: 'Not allowed' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const scenarioId: string = typeof body.scenarioId === 'string' ? body.scenarioId : 'unknown';
    const scenarioTitle: string =
      typeof body.scenarioTitle === 'string' ? body.scenarioTitle : 'A scenario';
    const track = body.track === 'B' ? 'B' : 'A';
    const sessionId: string | undefined =
      typeof body.sessionId === 'string' ? body.sessionId : undefined;
    const careHome = session.user.careHomeName || body.careHome || 'Unknown home';
    const keyWorkerName = session.user.displayName || 'Key worker';
    const recipientEmail = FALLBACK_RECIPIENT;

    // Create the record first so the flag is never lost, even if email fails.
    const flag = await prisma.keyworkSafeguardingFlag.create({
      data: {
        sessionId: sessionId || null,
        module: 'staying-safe-online',
        track,
        careHome,
        keyWorkerName,
        scenarioId,
        scenarioTitle,
        recipient: recipientEmail,
        emailSent: false,
        status: 'OPEN',
      },
      select: { id: true, createdAt: true },
    });

    // Mark the session as having raised a flag.
    if (sessionId) {
      await prisma.keyworkSession.update({
        where: { id: sessionId },
        data: { flagRaised: true },
      }).catch(() => {});
    }

    // Send the mandatory email.
    const emailSent = await sendFlagEmail({
      careHome, keyWorkerName, scenarioTitle, track,
      createdAt: flag.createdAt, recipientEmail,
    });

    if (emailSent) {
      await prisma.keyworkSafeguardingFlag.update({
        where: { id: flag.id },
        data: { emailSent: true },
      }).catch(() => {});
    }

    // Always tell the young person's screen it was handled, even if the
    // email failed. The record exists and staff will see it in the register.
    return NextResponse.json({ ok: true, flagId: flag.id, emailSent });
  } catch (err) {
    console.error('[keywork/flag POST]', err);
    return NextResponse.json({ error: 'Could not raise flag' }, { status: 500 });
  }
}
