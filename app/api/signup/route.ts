import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { UserRole, AccountStatus } from '@prisma/client';
import { sendNotification, emailWrapper, SUPER_ADMIN_EMAIL } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, careHomeId } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const normEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email: normEmail } });
    if (existing) {
      if (existing.status === AccountStatus.PENDING) {
        return NextResponse.json(
          { error: 'An account with this email is already awaiting approval. Please wait for an administrator to review your request.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.' },
        { status: 409 }
      );
    }

    // Validate care home if provided
    let careHome = null;
    if (careHomeId) {
      careHome = await prisma.careHome.findUnique({ where: { id: careHomeId } });
      if (!careHome) {
        return NextResponse.json({ error: 'Selected care home not found' }, { status: 400 });
      }
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        displayName: name.trim(),
        email: normEmail,
        password: hashedPassword,
        role: UserRole.STAFF,
        status: AccountStatus.PENDING,
        authProvider: 'credentials',
        careHomeId: careHomeId || null,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        actorRole: 'STAFF',
        action: 'CREATE',
        resourceType: 'user',
        resourceId: user.id,
        careHomeId: careHomeId || null,
        description: `Self-registration: ${name.trim()} (${normEmail}) at ${careHome?.displayName || 'No care home'}`,
        sensitivity: 'high',
      },
    }).catch(() => {});

    // Send approval notification to super admin
    const content = `
      <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 16px;">
        <p style="margin: 0 0 8px; font-weight: bold; color: #1e40af;">New Account Registration</p>
        <p style="margin: 4px 0;"><strong>Name:</strong> ${name.trim()}</p>
        <p style="margin: 4px 0;"><strong>Email:</strong> ${normEmail}</p>
        <p style="margin: 4px 0;"><strong>Care Home:</strong> ${careHome?.displayName || 'Not specified'}</p>
        <p style="margin: 4px 0;"><strong>Registered via:</strong> Email & Password</p>
        <p style="margin: 4px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB', { dateStyle: 'long' })}</p>
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
      subject: `[Approval Required] New registration: ${name.trim()} (${normEmail})`,
      htmlBody: emailWrapper('New Registration Awaiting Approval', content),
      recipientEmail: SUPER_ADMIN_EMAIL,
    }).catch(err => console.error('Failed to send registration notification:', err));

    return NextResponse.json({
      success: true,
      message: 'Your account has been submitted for approval. An administrator will review your request.',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
