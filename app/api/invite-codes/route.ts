import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole, logAuditEvent } from '@/lib/auth-middleware';
import { validateInput, createInviteSchema } from '@/lib/input-validation';
import { UserRole } from '@prisma/client';
import crypto from 'crypto';

function generateInviteCode(): string {
  // 6-char uppercase alphanumeric, easy to read (no O/0/I/1 confusion)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

// POST — Create invite code (staff+ only)
export async function POST(request: NextRequest) {
  const auth = await requireRole(UserRole.STAFF);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const validation = validateInput(createInviteSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { displayName, careHomeId, grantedBy, grantedByRole } = validation.data;

    // Verify care home exists and user has access
    const careHome = await prisma.careHome.findUnique({ where: { id: careHomeId } });
    if (!careHome) {
      return NextResponse.json({ error: 'Care home not found' }, { status: 404 });
    }

    // Non-super-admins can only create codes for their own home
    if (auth.role !== UserRole.SUPER_ADMIN && auth.careHomeId !== careHomeId) {
      return NextResponse.json({ error: 'You can only create invite codes for your own care home' }, { status: 403 });
    }

    // Generate unique code
    let code = generateInviteCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.inviteCode.findUnique({ where: { code } });
      if (!existing) break;
      code = generateInviteCode();
      attempts++;
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invite = await prisma.inviteCode.create({
      data: {
        code,
        careHomeId,
        createdById: auth.userId,
        displayName,
        expiresAt,
      },
    });

    // Record consent from corporate parent/guardian
    // (The invite itself is proof that consent was obtained)
    // We'll create the ConsentRecord when the YP activates

    await logAuditEvent({
      actorId: auth.userId,
      actorRole: auth.role,
      action: 'CREATE',
      resourceType: 'invite_code',
      resourceId: invite.id,
      careHomeId,
      description: `${auth.displayName} created invite code for "${displayName}" at ${careHome.displayName}. Consent given by ${grantedBy} (${grantedByRole}).`,
      sensitivity: 'high',
      request,
    });

    return NextResponse.json({
      success: true,
      inviteCode: code,
      displayName,
      careHome: careHome.displayName,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Create invite error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET — List invite codes for your care home (staff+ only)
export async function GET(request: NextRequest) {
  const auth = await requireRole(UserRole.STAFF);
  if (auth instanceof NextResponse) return auth;

  try {
    const where = auth.role === UserRole.SUPER_ADMIN
      ? {}
      : { careHomeId: auth.careHomeId || undefined };

    const invites = await prisma.inviteCode.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        careHome: { select: { displayName: true } },
        createdBy: { select: { displayName: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: invites.map((inv) => ({
        id: inv.id,
        code: inv.code,
        displayName: inv.displayName,
        careHome: inv.careHome.displayName,
        createdBy: inv.createdBy.displayName,
        createdAt: inv.createdAt,
        expiresAt: inv.expiresAt,
        used: !!inv.usedAt,
        expired: inv.expiresAt < new Date(),
      })),
    });
  } catch (error) {
    console.error('List invites error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
