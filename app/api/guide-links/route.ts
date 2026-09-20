// Manager controls for personalised guide links.
// Staff-only. Never returns a raw token except once, in the POST response
// that creates the link. Home scoped: staff act only on their own home,
// super admins may target any home.

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { prisma } from '@/lib/db';
import {
  issueGuideLink,
  revokeGuideLink,
  revokeAllGuideLinksForHome,
  listGuideLinks,
} from '@/lib/guide-links';

export const dynamic = 'force-dynamic';

function isStaff(role?: string) {
  return role === 'STAFF' || role === 'HOME_ADMIN' || role === 'SUPER_ADMIN';
}

function clientMeta(req: NextRequest) {
  return {
    ip:
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      null,
    userAgent: req.headers.get('user-agent') || null,
  };
}

// Resolve which home the actor is operating on, enforcing scoping.
// Returns the careHomeId to use, or null if the actor may not act.
function resolveHome(
  actor: { role: string; careHomeId: string | null },
  requested?: string | null
): string | null {
  if (actor.role === 'SUPER_ADMIN') {
    // Super admin may target any home; fall back to their own if set.
    return requested || actor.careHomeId || null;
  }
  // Home admin and staff are locked to their own home.
  if (!actor.careHomeId) return null;
  if (requested && requested !== actor.careHomeId) return null;
  return actor.careHomeId;
}

export async function GET(req: NextRequest) {
  const actor = await getAuthUser();
  if (!actor || !isStaff(actor.role)) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 401 });
  }
  const requested = req.nextUrl.searchParams.get('careHomeId');
  const careHomeId = resolveHome(actor, requested);
  if (!careHomeId) {
    return NextResponse.json({ error: 'No home in scope' }, { status: 400 });
  }
  const links = await listGuideLinks(careHomeId);
  return NextResponse.json({ links });
}

export async function POST(req: NextRequest) {
  const actor = await getAuthUser();
  if (!actor || !isStaff(actor.role)) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 401 });
  }
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const careHomeId = resolveHome(actor, body?.careHomeId);
  if (!careHomeId) {
    return NextResponse.json({ error: 'No home in scope' }, { status: 400 });
  }
  const childPreferredName = (body?.childPreferredName || '').toString().trim();
  if (!childPreferredName) {
    return NextResponse.json({ error: 'A preferred name is required' }, { status: 400 });
  }
  const meta = clientMeta(req);
  const result = await issueGuideLink({
    careHomeId,
    childPreferredName,
    childRoom: body?.childRoom ? body.childRoom.toString().trim() : null,
    keyWorkerName: body?.keyWorkerName ? body.keyWorkerName.toString().trim() : null,
    photoStoragePath: body?.photoStoragePath ? body.photoStoragePath.toString().trim() : null,
    expiryDays: typeof body?.expiryDays === 'number' ? body.expiryDays : undefined,
    useLimit: typeof body?.useLimit === 'number' ? body.useLimit : undefined,
    createdById: actor.userId,
    actorRole: actor.role,
    ip: meta.ip,
    userAgent: meta.userAgent,
  });
  // rawToken is returned exactly once and never stored in plain form.
  return NextResponse.json({
    id: result.id,
    rawToken: result.rawToken,
    last4: result.last4,
    expiresAt: result.expiresAt,
  });
}

export async function PATCH(req: NextRequest) {
  const actor = await getAuthUser();
  if (!actor || !isStaff(actor.role)) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 401 });
  }
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const action = body?.action;
  const meta = clientMeta(req);

  if (action === 'revoke') {
    const id = (body?.id || '').toString();
    if (!id) return NextResponse.json({ error: 'A link id is required' }, { status: 400 });
    // Verify the link belongs to a home the actor may act on.
    const link = await prisma.guideLink.findUnique({
      where: { id },
      select: { careHomeId: true },
    });
    if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const careHomeId = resolveHome(actor, link.careHomeId);
    if (!careHomeId || careHomeId !== link.careHomeId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    await revokeGuideLink(id, {
      actorId: actor.userId,
      actorRole: actor.role,
      careHomeId: actor.careHomeId,
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
    return NextResponse.json({ ok: true });
  }

  if (action === 'revoke_all') {
    const careHomeId = resolveHome(actor, body?.careHomeId);
    if (!careHomeId) {
      return NextResponse.json({ error: 'No home in scope' }, { status: 400 });
    }
    const count = await revokeAllGuideLinksForHome(careHomeId, {
      actorId: actor.userId,
      actorRole: actor.role,
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
    return NextResponse.json({ ok: true, revoked: count });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
