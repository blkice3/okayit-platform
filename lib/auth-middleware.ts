import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions, hasMinRole, canAccessHome } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/db';

export interface AuthenticatedRequest {
  userId: string;
  displayName: string;
  email: string | null;
  role: UserRole;
  careHomeId: string | null;
  careHomeName: string | null;
}

// ── Get authenticated user from session ──────────
export async function getAuthUser(): Promise<AuthenticatedRequest | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return {
    userId: session.user.id,
    displayName: session.user.displayName,
    email: session.user.email || null,
    role: session.user.role,
    careHomeId: session.user.careHomeId || null,
    careHomeName: session.user.careHomeName || null,
  };
}

// ── Require authentication (any role) ────────────
export async function requireAuth(): Promise<AuthenticatedRequest | NextResponse> {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  return user;
}

// ── Require minimum role ─────────────────────────
export async function requireRole(minRole: UserRole): Promise<AuthenticatedRequest | NextResponse> {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;

  if (!hasMinRole(result.role, minRole)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }
  return result;
}

// ── Require access to specific care home ─────────
export async function requireHomeAccess(homeId: string): Promise<AuthenticatedRequest | NextResponse> {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;

  if (!canAccessHome(result.role, result.careHomeId, homeId)) {
    return NextResponse.json({ error: 'Access denied for this care home' }, { status: 403 });
  }
  return result;
}

// ── Audit logger ─────────────────────────────────
export async function logAuditEvent({
  actorId,
  actorRole,
  action,
  resourceType,
  resourceId,
  careHomeId,
  description,
  changes,
  sensitivity = 'normal',
  request,
}: {
  actorId?: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  careHomeId?: string;
  description: string;
  changes?: Record<string, any>;
  sensitivity?: string;
  request?: NextRequest;
}) {
  try {
    const ip = request?.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
    const ua = request?.headers.get('user-agent') || null;

    await prisma.auditLog.create({
      data: {
        actorId: actorId || null,
        actorRole,
        actorIp: ip,
        actorDevice: ua,
        action,
        resourceType,
        resourceId: resourceId || null,
        careHomeId: careHomeId || null,
        description,
        changes: changes || undefined,
        sensitivity,
      },
    });
  } catch (err) {
    console.error('Audit log write failed:', err);
  }
}
