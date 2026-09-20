// Certificate PDF generation
// Generates achievement certificates on-demand

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import jsPDF from 'jspdf';

interface CertificateRequest {
  recipientName?: string; // Optional - will be replaced with placeholder
  category: string;
  achievementTitle: string;
  description: string;
  completionDate: string;
  certificateLevel: string;
  points: number;
  certificateId: string;
  achievements: string[];

}

export async function POST(request: NextRequest) {
  try {
    // P0-03: Require authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const data: CertificateRequest = await request.json();
    
    // Use placeholder name — personalisation not yet implemented
    const safeName = '[Your Name]';
    
    // Generate PDF certificate with placeholder name
    const pdf = generateCertificatePDF({
      ...data,
      recipientName: safeName
    });

    // Return the PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${data.certificateId}.pdf"`,

      },
    });

  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}

function generateCertificatePDF(data: CertificateRequest & { recipientName: string }): jsPDF {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background gradient effect (simulated with rectangles)
  doc.setFillColor(243, 232, 255); // Light purple
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Border
  doc.setLineWidth(2);
  doc.setDrawColor(147, 51, 234); // Purple
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'S');

  // Inner border
  doc.setLineWidth(0.5);
  doc.setDrawColor(59, 130, 246); // Blue
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30, 'S');

  // Header - OKAYiT branding
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(147, 51, 234);
  doc.text('OKAYiT', pageWidth / 2, 35, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Care Experience Window Platform', pageWidth / 2, 42, { align: 'center' });

  // Certificate title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text('CERTIFICATE OF ACHIEVEMENT', pageWidth / 2, 60, { align: 'center' });

  // Recipient name (PLACEHOLDER)
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(147, 51, 234);
  doc.text(data.recipientName, pageWidth / 2, 80, { align: 'center' });

  // Achievement title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text(data.achievementTitle, pageWidth / 2, 95, { align: 'center' });

  // Description
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  const descLines = doc.splitTextToSize(data.description, pageWidth - 80);
  doc.text(descLines, pageWidth / 2, 105, { align: 'center' });

  // Details section
  const detailsY = 125;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);

  // Category
  doc.text('Category:', 40, detailsY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(31, 41, 55);
  doc.text(data.category, 70, detailsY);

  // Level
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);
  doc.text('Level:', 40, detailsY + 8);
  doc.setFont('helvetica', 'normal');
  
  // Color based on level
  const levelColors: Record<string, [number, number, number]> = {
    platinum: [124, 58, 237],
    gold: [245, 158, 11],
    silver: [156, 163, 175],
    bronze: [249, 115, 22],
  };
  const color = levelColors[data.certificateLevel] || [31, 41, 55];
  doc.setTextColor(...color);
  doc.text(data.certificateLevel.toUpperCase(), 70, detailsY + 8);

  // Points
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);
  doc.text('Points Earned:', 40, detailsY + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(data.points.toString(), 70, detailsY + 16);

  // Date
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);
  doc.text('Date:', 40, detailsY + 24);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(31, 41, 55);
  const formattedDate = new Date(data.completionDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  doc.text(formattedDate, 70, detailsY + 24);

  // Achievements list
  if (data.achievements && data.achievements.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text('Key Achievements:', 40, detailsY + 36);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    
    let achievementY = detailsY + 44;
    data.achievements.slice(0, 5).forEach((achievement, index) => {
      doc.setTextColor(16, 185, 129);
      doc.text('✓', 42, achievementY);
      doc.setTextColor(75, 85, 99);
      const achLines = doc.splitTextToSize(achievement, pageWidth - 100);
      doc.text(achLines, 48, achievementY);
      achievementY += 7 * achLines.length;
    });
  }

  // Footer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(107, 114, 128);
  doc.text('Certificate ID: ' + data.certificateId, pageWidth / 2, pageHeight - 25, { align: 'center' });
  
  // Note
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text('You can write your name in the space provided above.', pageWidth / 2, pageHeight - 20, { align: 'center' });

  // Signature line
  doc.setLineWidth(0.5);
  doc.setDrawColor(156, 163, 175);
  doc.line(pageWidth - 80, pageHeight - 35, pageWidth - 30, pageHeight - 35);
  
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text('House Manager', pageWidth - 55, pageHeight - 30, { align: 'center' });

  return doc;
}
