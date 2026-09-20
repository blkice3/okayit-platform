import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole, logAuditEvent } from '@/lib/auth-middleware';
import { validateInput, createStaffUserSchema } from '@/lib/input-validation';
import { UserRole, AccountStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sendNotification, emailWrapper, SUPER_ADMIN_EMAIL } from '@/lib/email';

// POST — Create a staff/admin user (HOME_ADMIN+ only)
// All new accounts are set to PENDING — admin@okayit.uk must approve before login
export async function POST(request: NextRequest) {
  const auth = await requireRole(UserRole.HOME_ADMIN);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const validation = validateInput(createStaffUserSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { email, password, displayName, role, careHomeId } = validation.data;

    // Only SUPER_ADMIN can create HOME_ADMIN accounts
    if (role === 'HOME_ADMIN' && auth.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Only platform administrators can create home admin accounts' }, { status: 403 });
    }

    // Non-super-admins can only create for their own home
    if (auth.role !== UserRole.SUPER_ADMIN && auth.careHomeId !== careHomeId) {
      return NextResponse.json({ error: 'You can only create accounts for your own care home' }, { status: 403 });
    }

    // Check email uniqueness
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Verify care home
    const careHome = await prisma.careHome.findUnique({ where: { id: careHomeId } });
    if (!careHome) {
      return NextResponse.json({ error: 'Care home not found' }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // SUPER_ADMIN-created accounts are auto-approved; all others need approval
    const initialStatus = auth.role === UserRole.SUPER_ADMIN ? AccountStatus.ACTIVE : AccountStatus.PENDING;

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        displayName,
        role: role as UserRole,
        status: initialStatus,
        careHomeId,
        createdById: auth.userId,
      },
    });

    await logAuditEvent({
      actorId: auth.userId,
      actorRole: auth.role,
      action: 'CREATE',
      resourceType: 'user',
      resourceId: user.id,
      careHomeId,
      description: `${auth.displayName} created ${role} account for ${displayName} (${email}) at ${careHome.displayName} — status: ${initialStatus}`,
      sensitivity: 'high',
      request,
    });

    // Send approval email to super admin if account is pending
    if (initialStatus === AccountStatus.PENDING) {
      const content = `
        <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 16px;">
          <p style="margin: 8px 0;"><strong>New Account:</strong> ${displayName}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 8px 0;"><strong>Role:</strong> ${role}</p>
          <p style="margin: 8px 0;"><strong>Care Home:</strong> ${careHome.displayName}</p>
          <p style="margin: 8px 0;"><strong>Created By:</strong> ${auth.displayName} (${auth.role})</p>
          <p style="margin: 8px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB', { dateStyle: 'long' })}</p>
        </div>
        <div style="background: #fef3c7; padding: 12px; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            <strong>Action Required:</strong> This account cannot log in until you approve it.
            Please log in to the OKAYiT Staff Dashboard to approve or reject this registration.
          </p>
        </div>
        <div style="text-align: center; margin-top: 16px;">
          <a href="https://okayit.online/login" style="display: inline-block; background: #7c3aed; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Review in Dashboard</a>
        </div>
      `;

      sendNotification({
        notificationId: process.env.NOTIF_ID_REGISTRATION_APPROVAL_REQUEST || '',
        subject: `[Approval Required] New ${role} registration: ${displayName} at ${careHome.displayName}`,
        htmlBody: emailWrapper('New Registration Awaiting Approval', content),
        recipientEmail: SUPER_ADMIN_EMAIL,
      }).catch(err => console.error('Failed to send approval email:', err));
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        status: user.status,
        careHome: careHome.displayName,
      },
      message: initialStatus === AccountStatus.PENDING
        ? 'Account created — awaiting approval from admin@okayit.uk'
        : 'Account created and activated',
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET — List users (STAFF+ for own home, SUPER_ADMIN for all)
export async function GET(request: NextRequest) {
  const auth = await requireRole(UserRole.STAFF);
  if (auth instanceof NextResponse) return auth;

  try {
    const url = new URL(request.url);
    const roleFilter = url.searchParams.get('role');

    const where: Record<string, unknown> = {};

    // Non-super-admins only see their own care home
    if (auth.role !== UserRole.SUPER_ADMIN) {
      where.careHomeId = auth.careHomeId;
    }

    if (roleFilter && Object.values(UserRole).includes(roleFilter as UserRole)) {
      where.role = roleFilter;
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        displayName: true,
        email: true,
        role: true,
        status: true,
        careHome: { select: { displayName: true, name: true } },
        lastLoginAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('List users error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PATCH — Update user status (HOME_ADMIN+ only)
export async function PATCH(request: NextRequest) {
  const auth = await requireRole(UserRole.HOME_ADMIN);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { userId, status } = body;

    if (!userId || !['ACTIVE', 'SUSPENDED'].includes(status)) {
      return NextResponse.json({ error: 'userId and status (ACTIVE/SUSPENDED) required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { careHome: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Cannot modify SUPER_ADMIN accounts
    if (user.role === UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Cannot modify super admin accounts' }, { status: 403 });
    }

    // Non-super-admins can only modify users in their own home
    if (auth.role !== UserRole.SUPER_ADMIN && user.careHomeId !== auth.careHomeId) {
      return NextResponse.json({ error: 'You can only manage users in your own care home' }, { status: 403 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { status: status as AccountStatus },
    });

    await logAuditEvent({
      actorId: auth.userId,
      actorRole: auth.role,
      action: 'UPDATE',
      resourceType: 'user',
      resourceId: userId,
      careHomeId: user.careHomeId || undefined,
      description: `${auth.role} ${status === 'ACTIVE' ? 'activated' : 'suspended'} ${user.role} account for ${user.displayName} (${user.email})`,
      sensitivity: 'high',
    });

    return NextResponse.json({
      success: true,
      message: `Account ${status === 'ACTIVE' ? 'activated' : 'suspended'} for ${user.displayName}`,
    });
  } catch (error) {
    console.error('Update user status error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
