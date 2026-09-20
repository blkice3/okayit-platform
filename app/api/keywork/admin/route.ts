// STAYING SAFE ONLINE - staff and admin view data
// Returns the helpline verification register, recent sessions
// and raised flags for the signed in staff member's home.
// PATCH lets staff acknowledge or resolve a flag.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { HELPLINES, helplineState } from '@/lib/keywork/staying-safe-online-config';

export const dynamic = 'force-dynamic';

function isStaff(role?: string) {
  return role === 'STAFF' || role === 'HOME_ADMIN' || role === 'SUPER_ADMIN';
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !isStaff(session.user.role)) {
      return NextResponse.json({ error: 'Not allowed' }, { status: 401 });
    }

    const isSuper = session.user.role === 'SUPER_ADMIN';
    const careHome = session.user.careHomeName || null;

    // Super admins see everything. Others see their own home only.
    const homeFilter = isSuper || !careHome ? {} : { careHome };

    const now = new Date();
    const helplines = HELPLINES.map((h) => ({
      id: h.id,
      name: h.name,
      what: h.what,
      phone: h.phone || null,
      web: h.web || null,
      hours: h.hours,
      ageEligibility: h.ageEligibility,
      contactMethods: h.contactMethods,
      verifiedBy: h.verifiedBy,
      verifiedOn: h.verifiedOn,
      reviewEveryDays: h.reviewEveryDays,
      state: helplineState(h, now),
    }));

    const [sessions, flags] = await Promise.all([
      prisma.keyworkSession.findMany({
        where: { module: 'staying-safe-online', ...homeFilter },
        orderBy: { startedAt: 'desc' },
        take: 25,
        select: {
          id: true, track: true, careHome: true, keyWorkerName: true,
          startedAt: true, sectionsCompleted: true, paused: true,
          exited: true, completedAt: true, planSaved: true, flagRaised: true,
        },
      }),
      prisma.keyworkSafeguardingFlag.findMany({
        where: { module: 'staying-safe-online', ...homeFilter },
        orderBy: { createdAt: 'desc' },
        take: 25,
        select: {
          id: true, track: true, careHome: true, keyWorkerName: true,
          scenarioTitle: true, recipient: true, emailSent: true,
          status: true, acknowledgedAt: true, acknowledgedBy: true,
          outcome: true, createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({ helplines, sessions, flags });
  } catch (err) {
    console.error('[keywork/admin GET]', err);
    return NextResponse.json({ error: 'Could not load data' }, { status: 500 });
  }
}

// PATCH: acknowledge or resolve a flag.
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !isStaff(session.user.role)) {
      return NextResponse.json({ error: 'Not allowed' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const id: string | undefined = body.id;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const data: Record<string, any> = {};
    if (body.status === 'ACKNOWLEDGED' || body.status === 'RESOLVED') {
      data.status = body.status;
      data.acknowledgedAt = new Date();
      data.acknowledgedBy = session.user.displayName || 'Staff';
    }
    if (typeof body.outcome === 'string') {
      data.outcome = body.outcome.slice(0, 4000);
    }

    const updated = await prisma.keyworkSafeguardingFlag.update({
      where: { id },
      data,
      select: { id: true, status: true, acknowledgedAt: true, acknowledgedBy: true, outcome: true },
    });

    return NextResponse.json({ flag: updated });
  } catch (err) {
    console.error('[keywork/admin PATCH]', err);
    return NextResponse.json({ error: 'Could not update flag' }, { status: 500 });
  }
}
