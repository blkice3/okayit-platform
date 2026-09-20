// SAFEGUARDING: Alert Resolution Tracking API
// Immutable — records are created and appended to, never deleted or edited.
// Staff actions are logged as an append-only JSON array.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'okayit-admin-secret-2024';

// Auth: resolve caller identity from NextAuth session or legacy JWT
async function getCallerInfo(request: NextRequest) {
  // Try NextAuth first
  const session = await getServerSession(authOptions);
  if (session?.user && ['SUPER_ADMIN', 'HOME_ADMIN', 'STAFF'].includes(session.user.role)) {
    return {
      id: session.user.id,
      name: session.user.displayName || 'Staff',
      role: session.user.role,
      home: session.user.careHomeName || 'all',
    };
  }
  // Legacy JWT fallback
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.substring(7), JWT_SECRET) as { id: string; email: string; role: string; home: string; name?: string };
      const admin = await prisma.adminUser.findUnique({ where: { id: decoded.id, isActive: true } });
      if (admin) return { id: admin.id, name: admin.name, role: admin.role, home: admin.home };
    } catch { /* invalid token */ }
  }
  return null;
}

// ── GET: Fetch alert actions with optional filters ──
export async function GET(request: NextRequest) {
  const caller = await getCallerInfo(request);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const status = url.searchParams.get('status'); // OPEN, ACKNOWLEDGED, IN_PROGRESS, ESCALATED, RESOLVED
  const level = url.searchParams.get('level');   // RED, AMBER
  const home = url.searchParams.get('home');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 200);

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (level) where.alertLevel = level;
  // Scope by care home unless super admin viewing all
  if (home) {
    where.careHome = home;
  } else if (caller.home !== 'all') {
    where.careHome = caller.home;
  }

  const actions = await prisma.alertAction.findMany({
    where,
    include: { checkin: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return NextResponse.json({ success: true, data: actions });
}

// ── POST: Perform action on an alert ──
export async function POST(request: NextRequest) {
  const caller = await getCallerInfo(request);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { alertId, action, note } = body;
  // action: 'acknowledge' | 'spoke_with_yp' | 'escalated_to_manager' | 'referred_social_worker' | 'resolve'

  if (!alertId || !action) {
    return NextResponse.json({ error: 'alertId and action are required' }, { status: 400 });
  }

  // Fetch current alert
  const alert = await prisma.alertAction.findUnique({ where: { id: alertId }, include: { checkin: true } });
  if (!alert) return NextResponse.json({ error: 'Alert not found' }, { status: 404 });

  // Validate: cannot act on already-resolved alerts
  if (alert.status === 'RESOLVED') {
    return NextResponse.json({ error: 'This alert is already resolved. Safeguarding records are immutable.' }, { status: 400 });
  }

  const now = new Date();
  const existingActions = (alert.actions as Array<Record<string, unknown>>) || [];
  const newActionEntry = {
    action,
    note: note || null,
    actorId: caller.id,
    actorName: caller.name,
    actorRole: caller.role,
    timestamp: now.toISOString(),
  };
  const updatedActions = [...existingActions, newActionEntry];

  // Build the update payload based on action type
  const update: Record<string, unknown> = { actions: updatedActions };

  switch (action) {
    case 'acknowledge':
      if (alert.status !== 'OPEN' && alert.status !== 'ESCALATED') {
        return NextResponse.json({ error: 'Alert must be OPEN or ESCALATED to acknowledge' }, { status: 400 });
      }
      update.status = 'ACKNOWLEDGED';
      update.acknowledgedAt = now;
      update.acknowledgedBy = caller.name;
      update.acknowledgedById = caller.id;
      break;

    case 'spoke_with_yp':
    case 'escalated_to_manager':
    case 'referred_social_worker':
      // These are in-progress actions — move to IN_PROGRESS if not already
      if (alert.status === 'OPEN') {
        // Auto-acknowledge first if action taken without explicit ack
        update.status = 'IN_PROGRESS';
        if (!alert.acknowledgedAt) {
          update.acknowledgedAt = now;
          update.acknowledgedBy = caller.name;
          update.acknowledgedById = caller.id;
        }
      } else {
        update.status = 'IN_PROGRESS';
      }
      if (action === 'escalated_to_manager') {
        update.escalatedAt = now;
        update.escalatedReason = `Manually escalated by ${caller.name} (${caller.role})`;
      }
      break;

    case 'resolve':
      if (!note || note.trim().length < 5) {
        return NextResponse.json({ error: 'Outcome notes are required to resolve an alert (min 5 characters)' }, { status: 400 });
      }
      update.status = 'RESOLVED';
      update.resolvedAt = now;
      update.resolvedBy = caller.name;
      update.resolvedById = caller.id;
      update.outcome = note.trim();
      // Auto-acknowledge if somehow skipped
      if (!alert.acknowledgedAt) {
        update.acknowledgedAt = now;
        update.acknowledgedBy = caller.name;
        update.acknowledgedById = caller.id;
      }
      break;

    default:
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  }

  const updated = await prisma.alertAction.update({
    where: { id: alertId },
    data: update,
    include: { checkin: true },
  });

  // Immutable audit trail
  await prisma.auditLog.create({
    data: {
      actorRole: caller.role,
      action: 'SAFEGUARDING_ACTION',
      resourceType: 'alert_action',
      resourceId: alertId,
      careHomeId: null,
      description: `${caller.name} (${caller.role}) performed '${action}' on ${alert.alertLevel} alert for check-in ${alert.checkinId}${note ? ` — Note: ${note}` : ''}`,
      changes: JSON.parse(JSON.stringify(newActionEntry)),
      sensitivity: 'safeguarding',
    },
  }).catch(() => {}); // non-blocking

  return NextResponse.json({ success: true, data: updated });
}
