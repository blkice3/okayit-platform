// User login is handled via /api/admin for staff accounts.
// This endpoint is not used — kept as a stub to prevent 404s.

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { 
      error: 'This endpoint is not in use.', 
      message: 'Staff login is available via the admin panel.' 
    },
    { status: 410 }
  );
}
