// Session endpoint — disabled
// This endpoint is not currently in use.

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { 
      error: 'Session management is not currently available.', 
      message: 'This endpoint is disabled.' 
    },
    { status: 410 }
  );
}
