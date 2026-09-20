// STAYING SAFE ONLINE - session lifecycle
// Records ONLY what the spec allows:
//   that a session started, which key worker, the date,
//   which sections were completed, that it was paused or exited,
//   and the personal plan text ONLY if actively saved.
// It NEVER stores password input, scenario choices, free text
// from warm up, or which options were tapped.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Only staff and admins run these sessions.
function isStaff(role?: string) {
  return role === 'STAFF' || role === 'HOME_ADMIN' || role === 'SUPER_ADMIN';
}

// POST: start a new session.
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !isStaff(session.user.role)) {
      return NextResponse.json({ error: 'Not allowed' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const track = body.track === 'B' ? 'B' : 'A';
    const careHome =
      session.user.careHomeName || body.careHome || 'Unknown home';

    const created = await prisma.keyworkSession.create({
      data: {
        module: 'staying-safe-online',
        track,
        careHome,
        keyWorkerName: session.user.displayName || 'Key worker',
        keyWorkerId: session.user.id || null,
        sectionsCompleted: [],
      },
      select: { id: true, track: true, sectionsCompleted: true },
    });

    return NextResponse.json({ session: created });
  } catch (err) {
    console.error('[keywork/session POST]', err);
    return NextResponse.json({ error: 'Could not start session' }, { status: 500 });
  }
}

// PATCH: update progress. Accepts a safe, fixed set of fields.
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !isStaff(session.user.role)) {
      return NextResponse.json({ error: 'Not allowed' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const id: string | undefined = body.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing session id' }, { status: 400 });
    }

    // Build a whitelist of allowed updates. Nothing else is stored.
    const data: Record<string, any> = {};

    if (Array.isArray(body.sectionsCompleted)) {
      // Keep only known section id strings.
      data.sectionsCompleted = body.sectionsCompleted
        .filter((s: unknown) => typeof s === 'string')
        .slice(0, 20);
    }
    if (body.track === 'A' || body.track === 'B') {
      data.track = body.track;
    }
    if (typeof body.paused === 'boolean') data.paused = body.paused;
    if (typeof body.exited === 'boolean') data.exited = body.exited;
    if (body.completed === true) data.completedAt = new Date();

    // The plan is stored ONLY when the young person actively saved it.
    if (body.planSaved === true && typeof body.planText === 'string') {
      data.planSaved = true;
      data.planText = body.planText.slice(0, 4000);
    }
    if (body.planSaved === false) {
      // Discard is the default. Make sure nothing lingers.
      data.planSaved = false;
      data.planText = null;
    }

    const updated = await prisma.keyworkSession.update({
      where: { id },
      data,
      select: { id: true, sectionsCompleted: true, planSaved: true },
    });

    return NextResponse.json({ session: updated });
  } catch (err) {
    console.error('[keywork/session PATCH]', err);
    return NextResponse.json({ error: 'Could not update session' }, { status: 500 });
  }
}
