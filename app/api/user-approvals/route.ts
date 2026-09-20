import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole, logAuditEvent } from '@/lib/auth-middleware';
import { UserRole, AccountStatus } from '@prisma/client';

// GET — List pending approvals (SUPER_ADMIN only)
export async function GET() {
  const auth = await requireRole(UserRole.SUPER_ADMIN);
  if (auth instanceof NextResponse) return auth;

  try {
    const pending = await prisma.user.findMany({
      where: { status: AccountStatus.PENDING },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        displayName: true,
        email: true,
        role: true,
        status: true,
        careHome: { select: { displayName: true, name: true } },
        createdBy: { select: { displayName: true, email: true, role: true } },
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: pending });
  } catch (error) {
    console.error('List pending approvals error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST — Approve or reject a user (SUPER_ADMIN only)
export async function POST(request: NextRequest) {
  const auth = await requireRole(UserRole.SUPER_ADMIN);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'userId and action (approve/reject) required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { careHome: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.status !== AccountStatus.PENDING) {
      return NextResponse.json({ error: `User is already ${user.status}` }, { status: 400 });
    }

    const newStatus = action === 'approve' ? AccountStatus.ACTIVE : AccountStatus.ARCHIVED;

    await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
    });

    await logAuditEvent({
      actorId: auth.userId,
      actorRole: auth.role,
      action: action === 'approve' ? 'UPDATE' : 'DELETE',
      resourceType: 'user',
      resourceId: userId,
      careHomeId: user.careHomeId || undefined,
      description: `Super Admin ${action === 'approve' ? 'approved' : 'rejected'} ${user.role} account for ${user.displayName} (${user.email}) at ${user.careHome?.displayName || 'N/A'}`,
      sensitivity: 'high',
      request,
    });

    return NextResponse.json({
      success: true,
      message: `Account ${action === 'approve' ? 'approved' : 'rejected'} for ${user.displayName}`,
      status: newStatus,
    });
  } catch (error) {
    console.error('Approval action error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE — Permanently delete a user and all related records (SUPER_ADMIN only)
export async function DELETE(request: NextRequest) {
  const auth = await requireRole(UserRole.SUPER_ADMIN);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { careHome: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent deleting yourself
    if (userId === auth.userId) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }

    const userName = user.displayName || user.email || 'Unknown';
    const userEmail = user.email || 'N/A';
    const homeName = user.careHome?.displayName || 'N/A';

    // Delete related records that don't cascade, then the user
    // Account and Session have onDelete: Cascade, so they auto-delete
    await prisma.$transaction([
      // Nullify audit logs actor references (preserve logs but unlink user)
      prisma.auditLog.updateMany({ where: { actorId: userId }, data: { actorId: null } }),
      // Delete consent records
      prisma.consentRecord.deleteMany({ where: { userId } }),
      prisma.consentRecord.deleteMany({ where: { recordedById: userId } }),
      // Delete invite codes created by this user
      prisma.inviteCode.deleteMany({ where: { createdById: userId } }),
      // Nullify createdById references on other users
      prisma.user.updateMany({ where: { createdById: userId }, data: { createdById: null } }),
      // Delete the user (cascades to Account, Session)
      prisma.user.delete({ where: { id: userId } }),
    ]);

    await logAuditEvent({
      actorId: auth.userId,
      actorRole: auth.role,
      action: 'DELETE',
      resourceType: 'user',
      resourceId: userId,
      careHomeId: user.careHomeId || undefined,
      description: `Super Admin permanently deleted ${user.role} account: ${userName} (${userEmail}) from ${homeName}`,
      sensitivity: 'high',
      request,
    });

    return NextResponse.json({
      success: true,
      message: `Account permanently deleted for ${userName} (${userEmail}). They can now re-register with this email.`,
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Failed to delete user. There may be dependent records.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
