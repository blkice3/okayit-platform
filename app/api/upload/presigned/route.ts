import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generatePresignedUploadUrl } from '@/lib/s3';

export const dynamic = 'force-dynamic';

// POST — Generate presigned URL for tour photo upload
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only HOME_ADMIN+ can upload tour photos
    const role = (session.user as any).role;
    if (!['SUPER_ADMIN', 'HOME_ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Only admins can upload photos' }, { status: 403 });
    }

    const body = await request.json();
    const { fileName, contentType } = body;

    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'fileName and contentType required' }, { status: 400 });
    }

    // Validate file type
    if (!contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Tour photos are public so they can be displayed
    const { uploadUrl, cloud_storage_path } = await generatePresignedUploadUrl(fileName, contentType, true);

    return NextResponse.json({ success: true, uploadUrl, cloud_storage_path });
  } catch (error) {
    console.error('Presigned URL error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
