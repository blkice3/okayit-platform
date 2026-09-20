// Certificates endpoint — disabled
// Certificates are generated on-demand via the PDF generation endpoint.

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { 
      error: 'Certificate storage is not available.', 
      message: 'Certificates are generated on-demand only.' 
    },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json({ error: 'Certificate storage is not available.' }, { status: 410 });
}
