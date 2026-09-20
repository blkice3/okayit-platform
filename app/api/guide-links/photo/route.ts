// Private presigned upload for a guide photograph.
// Guide photos are stored PRIVATELY (never a public or guessable URL) and
// are only ever served through a short lived signed URL that expires with the
// viewer's grant. Staff only.

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { generatePresignedUploadUrl } from '@/lib/s3';

export const dynamic = 'force-dynamic';

function isStaff(role?: string) {
  return role === 'STAFF' || role === 'HOME_ADMIN' || role === 'SUPER_ADMIN';
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
  const { fileName, contentType } = body || {};
  if (!fileName || !contentType) {
    return NextResponse.json({ error: 'fileName and contentType required' }, { status: 400 });
  }
  if (!String(contentType).startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
  }
  // isPublic = false -> object is private, reachable only via a signed URL.
  const { uploadUrl, cloud_storage_path } = await generatePresignedUploadUrl(
    fileName,
    contentType,
    false
  );
  return NextResponse.json({ success: true, uploadUrl, cloud_storage_path });
}
