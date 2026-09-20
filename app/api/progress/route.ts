// Progress endpoint — disabled
// Progress is tracked on the client side only (localStorage).

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { 
      error: 'Server-side progress tracking is not available.', 
      message: 'Progress is stored locally on your device.' 
    },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json({ error: 'Server-side progress tracking is not available.' }, { status: 410 });
}

export async function PATCH() {
  return NextResponse.json({ error: 'Server-side progress tracking is not available.' }, { status: 410 });
}
