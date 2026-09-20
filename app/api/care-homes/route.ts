import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Public endpoint: returns minimal branding data only (no auth required)
    if (searchParams.get('public') === 'true') {
      const homes = await prisma.careHome.findMany({
        where: { isActive: true },
        select: { name: true, displayName: true, brandColor: true },
        orderBy: { displayName: 'asc' },
      });
      return NextResponse.json({ success: true, data: homes });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const allowedRoles: string[] = [UserRole.SUPER_ADMIN, UserRole.HOME_ADMIN, UserRole.STAFF];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const full = searchParams.get('full') === 'true';

    const where = session.user.role === UserRole.SUPER_ADMIN
      ? {}
      : session.user.careHomeId ? { id: session.user.careHomeId } : {};

    const homes = await prisma.careHome.findMany({
      where,
      select: full ? {
        id: true, name: true, displayName: true, description: true,
        address: true, phone: true, email: true, brandColor: true, tourRooms: true,
        isActive: true, createdAt: true, updatedAt: true,
        _count: { select: { staff: true, users: true } },
      } : {
        id: true, name: true, displayName: true, brandColor: true, isActive: true,
      },
      orderBy: { displayName: 'asc' },
    });

    return NextResponse.json({ success: true, data: homes });
  } catch (error) {
    console.error('Care homes API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH — Update care home details (HOME_ADMIN+)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!['SUPER_ADMIN', 'HOME_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;
    if (!id) return NextResponse.json({ error: 'Missing care home ID' }, { status: 400 });

    // Non-super-admins can only edit their own home
    if (session.user.role !== 'SUPER_ADMIN' && session.user.careHomeId !== id) {
      return NextResponse.json({ error: 'You can only edit your own care home' }, { status: 403 });
    }

    // Only allow safe fields to be updated
    const allowed: Record<string, any> = {};
    const safeFields = ['displayName', 'description', 'address', 'phone', 'email', 'brandColor', 'tourRooms', 'isActive'];
    for (const key of safeFields) {
      if (updateData[key] !== undefined) allowed[key] = updateData[key];
    }

    const updated = await prisma.careHome.update({ where: { id }, data: allowed });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Care home update error:', error);
    return NextResponse.json({ error: 'Failed to update care home' }, { status: 500 });
  }
}
