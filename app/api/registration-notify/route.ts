// Registration notification endpoint — disabled
// Email notifications are not currently in use.

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { 
      error: 'Email notifications are not currently available.', 
      message: 'This endpoint is disabled.' 
    },
    { status: 410 }
  );
}
