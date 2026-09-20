import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Auth: accept NextAuth session (HOME_ADMIN+) OR legacy bearer password
const ADMIN_PASSWORD = process.env.STAFF_ADMIN_PASSWORD || 'okayit2024';

async function checkAuth(request: Request): Promise<{ ok: boolean; role?: string; home?: string }> {
  // Try NextAuth session first
  const session = await getServerSession(authOptions);
  if (session?.user && ['SUPER_ADMIN', 'HOME_ADMIN'].includes(session.user.role)) {
    return { ok: true, role: session.user.role, home: session.user.careHomeName || 'all' };
  }
  // Fallback to bearer password
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.replace('Bearer ', '') === ADMIN_PASSWORD) {
    return { ok: true, role: 'ADMIN', home: 'all' };
  }
  return { ok: false };
}

// Public-safe fields only
const PUBLIC_STAFF_SELECT = {
  id: true, name: true, role: true, shift: true, home: true,
  photo: true, color: true, displayOrder: true, funFact: true, interests: true,
};

// GET /api/staff
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const home = searchParams.get('home');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const auth = await checkAuth(request);
    const isAdmin = auth.ok;

    const whereClause: any = {};
    if (home && home !== 'all') {
      whereClause.OR = [{ home }, { home: 'all' }];
    }
    if (!isAdmin || !includeInactive) {
      whereClause.isActive = true;
    }

    const staff = await prisma.staffMember.findMany({
      where: whereClause,
      ...(isAdmin ? {} : { select: PUBLIC_STAFF_SELECT }),
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json(staff);
  } catch (error: any) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Failed to fetch staff members' }, { status: 500 });
  }
}

// POST /api/staff — Create staff profile
export async function POST(request: Request) {
  try {
    const auth = await checkAuth(request);
    if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    if (!data.name || !data.role || !data.home) {
      return NextResponse.json({ error: 'Missing required fields: name, role, home' }, { status: 400 });
    }

    const maxOrder = await prisma.staffMember.findFirst({
      where: { home: data.home }, orderBy: { displayOrder: 'desc' }, select: { displayOrder: true },
    });

    // Link to CareHome if possible
    let careHomeId: string | undefined;
    if (data.home && data.home !== 'all') {
      const ch = await prisma.careHome.findUnique({ where: { name: data.home } });
      if (ch) careHomeId = ch.id;
    }

    const newStaff = await prisma.staffMember.create({
      data: {
        name: data.name,
        role: data.role,
        shift: data.shift || 'day',
        home: data.home,
        careHomeId: careHomeId || null,
        photo: data.photo || '',
        description: data.description || '',
        interests: data.interests || [],
        funFact: data.funFact || null,
        favoriteQuote: data.favoriteQuote || null,
        whenToTalkTo: data.whenToTalkTo || null,
        contact: data.contact || null,
        color: data.color || 'from-purple-500 to-pink-500',
        displayOrder: (maxOrder?.displayOrder || 0) + 1,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error: any) {
    console.error('Error creating staff:', error);
    return NextResponse.json({ error: 'Failed to create staff member' }, { status: 500 });
  }
}

// PATCH /api/staff — Update staff profile
export async function PATCH(request: Request) {
  try {
    const auth = await checkAuth(request);
    if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, ...updateData } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing staff ID' }, { status: 400 });

    // If home changed, update careHomeId
    if (updateData.home && updateData.home !== 'all') {
      const ch = await prisma.careHome.findUnique({ where: { name: updateData.home } });
      if (ch) updateData.careHomeId = ch.id;
    } else if (updateData.home === 'all') {
      updateData.careHomeId = null;
    }

    const updatedStaff = await prisma.staffMember.update({ where: { id }, data: updateData });
    return NextResponse.json(updatedStaff);
  } catch (error: any) {
    console.error('Error updating staff:', error);
    return NextResponse.json({ error: 'Failed to update staff member' }, { status: 500 });
  }
}

// DELETE /api/staff — Soft-delete (set isActive=false) or hard delete
export async function DELETE(request: Request) {
  try {
    const auth = await checkAuth(request);
    if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const hard = searchParams.get('hard') === 'true';
    if (!id) return NextResponse.json({ error: 'Missing staff ID' }, { status: 400 });

    if (hard) {
      await prisma.staffMember.delete({ where: { id } });
    } else {
      await prisma.staffMember.update({ where: { id }, data: { isActive: false } });
    }

    return NextResponse.json({ success: true, message: hard ? 'Staff member deleted' : 'Staff member deactivated' });
  } catch (error: any) {
    console.error('Error deleting staff:', error);
    return NextResponse.json({ error: 'Failed to delete staff member' }, { status: 500 });
  }
}
