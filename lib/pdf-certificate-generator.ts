
// Professional PDF Certificate Generator for OKAYiT Platform
// Generates high-quality, downloadable PDF certificates with OKAYiT branding

import { jsPDF } from 'jspdf';

export interface CertificateConfig {
  recipientName: string;
  category: 'welcome' | 'tour' | 'family' | 'stories' | 'wellbeing' | 'milestone' | 'full-platform';
  achievementTitle: string;
  description: string;
  completionDate: Date;
  certificateLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  certificateId: string;
  achievements: string[];
}

// Professional OKAYiT Brand Colors
const COLORS = {
  primary: [147, 51, 234] as [number, number, number],      // Purple #9333EA
  secondary: [59, 130, 246] as [number, number, number],    // Blue #3B82F6
  accent: [249, 115, 22] as [number, number, number],       // Orange #F97316
  success: [16, 185, 129] as [number, number, number],      // Green #10B981
  textDark: [17, 24, 39] as [number, number, number],       // Almost black #111827
  textMedium: [55, 65, 81] as [number, number, number],     // Dark gray #374151
  textLight: [107, 114, 128] as [number, number, number],   // Medium gray #6B7280
  gold: [245, 158, 11] as [number, number, number],         // Gold #F59E0B
  silver: [156, 163, 175] as [number, number, number],      // Silver #9CA3AF
  bronze: [249, 115, 22] as [number, number, number],       // Bronze/Orange #F97316
  platinum: [124, 58, 237] as [number, number, number],     // Platinum/Purple #7C3AED
  white: [255, 255, 255] as [number, number, number],       // White
  background: [249, 250, 251] as [number, number, number],  // Light gray background
};

export class PDFCertificateGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;

  constructor() {
    this.doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  async generateCertificate(config: CertificateConfig): Promise<Blob> {
    // Set background
    this.doc.setFillColor(...COLORS.background);
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');

    // Add decorative border
    this.addDecorativeBorder(config.certificateLevel);

    // Add header with OKAYiT branding
    this.addHeader(config.certificateLevel);

    // Add certificate title
    this.addCertificateTitle(config.certificateLevel);

    // Add recipient name (main focus)
    this.addRecipientName(config.recipientName);

    // Add achievement details
    this.addAchievementDetails(config);

    // Add footer with signature and verification
    this.addFooter(config);

    // Return as blob
    return this.doc.output('blob');
  }

  private addDecorativeBorder(level: string): void {
    const margin = 10;
    const borderWidth = 4;

    const borderColor = this.getLevelColorRGB(level);

    // Main outer border
    this.doc.setDrawColor(...borderColor);
    this.doc.setLineWidth(borderWidth);
    this.doc.rect(margin, margin, this.pageWidth - 2 * margin, this.pageHeight - 2 * margin);

    // Inner white border
    this.doc.setDrawColor(255, 255, 255);
    this.doc.setLineWidth(2);
    this.doc.rect(margin + 5, margin + 5, this.pageWidth - 2 * (margin + 5), this.pageHeight - 2 * (margin + 5));

    // Second inner colored border
    this.doc.setDrawColor(...borderColor);
    this.doc.setLineWidth(1);
    this.doc.rect(margin + 8, margin + 8, this.pageWidth - 2 * (margin + 8), this.pageHeight - 2 * (margin + 8));

    // Corner decorations
    this.addCornerDecorations(margin, borderColor);
  }

  private addCornerDecorations(margin: number, color: [number, number, number]): void {
    const size = 15;
    
    // Top-left corner
    this.doc.setFillColor(...color);
    this.doc.rect(margin + 3, margin + 3, size, size, 'F');
    this.doc.setFillColor(...COLORS.white);
    this.doc.rect(margin + 6, margin + 6, size - 6, size - 6, 'F');

    // Top-right corner
    this.doc.setFillColor(...color);
    this.doc.rect(this.pageWidth - margin - size - 3, margin + 3, size, size, 'F');
    this.doc.setFillColor(...COLORS.white);
    this.doc.rect(this.pageWidth - margin - size, margin + 6, size - 6, size - 6, 'F');

    // Bottom-left corner
    this.doc.setFillColor(...color);
    this.doc.rect(margin + 3, this.pageHeight - margin - size - 3, size, size, 'F');
    this.doc.setFillColor(...COLORS.white);
    this.doc.rect(margin + 6, this.pageHeight - margin - size, size - 6, size - 6, 'F');

    // Bottom-right corner
    this.doc.setFillColor(...color);
    this.doc.rect(this.pageWidth - margin - size - 3, this.pageHeight - margin - size - 3, size, size, 'F');
    this.doc.setFillColor(...COLORS.white);
    this.doc.rect(this.pageWidth - margin - size, this.pageHeight - margin - size, size - 6, size - 6, 'F');
  }

  private addHeader(level: string): void {
    const yPos = 30;
    const levelColor = this.getLevelColorRGB(level);

    // OKAYiT Logo text with bold professional styling
    this.doc.setFontSize(42);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...COLORS.textDark);
    this.doc.text('OKAYiT', this.pageWidth / 2, yPos, { align: 'center' });

    // Tagline with better visibility
    this.doc.setFontSize(13);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...COLORS.textMedium);
    this.doc.text('Care Experience Window Platform', this.pageWidth / 2, yPos + 8, { align: 'center' });

    // Level badge with clear background
    const badgeWidth = 45;
    const badgeHeight = 12;
    const badgeX = (this.pageWidth - badgeWidth) / 2;
    const badgeY = yPos + 12;

    this.doc.setFillColor(...levelColor);
    this.doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 3, 3, 'F');

    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...COLORS.white);
    this.doc.text(level.toUpperCase() + ' LEVEL', this.pageWidth / 2, badgeY + 8, { align: 'center' });
  }

  private addCertificateTitle(level: string): void {
    const yPos = 58;

    // Certificate text with high contrast
    this.doc.setFontSize(22);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...COLORS.textDark);
    this.doc.text('Certificate of Achievement', this.pageWidth / 2, yPos, { align: 'center' });
  }

  private addRecipientName(name: string): void {
    const yPos = 75;

    // "This is proudly presented to" with clear visibility
    this.doc.setFontSize(15);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...COLORS.textMedium);
    this.doc.text('This is proudly presented to', this.pageWidth / 2, yPos, { align: 'center' });

    // White box for name with border
    const nameBoxWidth = 140;
    const nameBoxHeight = 20;
    const nameBoxX = (this.pageWidth - nameBoxWidth) / 2;
    const nameBoxY = yPos + 2;

    this.doc.setFillColor(...COLORS.white);
    this.doc.setDrawColor(...COLORS.primary);
    this.doc.setLineWidth(1.5);
    this.doc.roundedRect(nameBoxX, nameBoxY, nameBoxWidth, nameBoxHeight, 3, 3, 'FD');

    // Recipient name (large, bold, and highly visible)
    this.doc.setFontSize(32);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...COLORS.textDark);
    this.doc.text(name, this.pageWidth / 2, yPos + 15, { align: 'center' });
  }

  private addAchievementDetails(config: CertificateConfig): void {
    const yPos = 108;

    // Achievement title with clear visibility
    this.doc.setFontSize(17);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...COLORS.textDark);
    this.doc.text(`For successfully completing: ${config.achievementTitle}`, this.pageWidth / 2, yPos, { align: 'center' });

    // Description with better contrast
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(...COLORS.textMedium);
    
    const description = this.wrapText(config.description, 200);
    let currentY = yPos + 8;
    description.forEach(line => {
      this.doc.text(line, this.pageWidth / 2, currentY, { align: 'center' });
      currentY += 6;
    });

    // Achievements list with white background boxes
    if (config.achievements && config.achievements.length > 0) {
      currentY += 5;
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(...COLORS.textDark);
      this.doc.text('Key Achievements:', this.pageWidth / 2, currentY, { align: 'center' });

      currentY += 6;
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(...COLORS.textMedium);
      config.achievements.slice(0, 3).forEach(achievement => {
        this.doc.text(`✓ ${achievement}`, this.pageWidth / 2, currentY, { align: 'center' });
        currentY += 5;
      });
    }

    // Points earned with high contrast box
    const pointsY = currentY + 6;
    const pointsBoxWidth = 65;
    const pointsBoxHeight = 14;
    const pointsBoxX = (this.pageWidth - pointsBoxWidth) / 2;

    this.doc.setFillColor(...COLORS.success);
    this.doc.roundedRect(pointsBoxX, pointsY, pointsBoxWidth, pointsBoxHeight, 3, 3, 'F');

    this.doc.setFontSize(13);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...COLORS.white);
    this.doc.text(`${config.points} Points Earned`, this.pageWidth / 2, pointsY + 9, { align: 'center' });
  }

  private addFooter(config: CertificateConfig): void {
    const yPos = this.pageHeight - 35;

    // Completion date with high contrast
    const dateStr = config.completionDate.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...COLORS.textDark);
    this.doc.text(`Awarded on ${dateStr}`, this.pageWidth / 2, yPos, { align: 'center' });

    // Signature section with white box
    const signatureY = yPos + 8;
    const signatureBoxWidth = 70;
    const signatureBoxHeight = 20;
    const signatureBoxX = (this.pageWidth - signatureBoxWidth) / 2;

    this.doc.setFillColor(...COLORS.white);
    this.doc.setDrawColor(...COLORS.textLight);
    this.doc.setLineWidth(0.5);
    this.doc.roundedRect(signatureBoxX, signatureY, signatureBoxWidth, signatureBoxHeight, 3, 3, 'D');

    // Signature line
    const lineWidth = 50;
    const lineX = (this.pageWidth - lineWidth) / 2;
    this.doc.setDrawColor(...COLORS.textMedium);
    this.doc.setLineWidth(1);
    this.doc.line(lineX, signatureY + 14, lineX + lineWidth, signatureY + 14);

    // Authorized signature text with high contrast
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...COLORS.textDark);
    this.doc.text('Emma Hempsall', this.pageWidth / 2, signatureY + 11, { align: 'center' });
    
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...COLORS.textMedium);
    this.doc.text('Home Manager', this.pageWidth / 2, signatureY + 17, { align: 'center' });

    // Certificate ID with clear visibility
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...COLORS.textMedium);
    this.doc.text(`Certificate ID: ${config.certificateId}`, this.pageWidth / 2, signatureY + 23, { align: 'center' });

    // Contact email with high contrast
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...COLORS.primary);
    this.doc.text('Contact: admin@okayit.uk | okayit.online', this.pageWidth / 2, signatureY + 27, { align: 'center' });
  }

  private getLevelColorRGB(level: string): [number, number, number] {
    switch (level.toLowerCase()) {
      case 'platinum':
        return COLORS.platinum;
      case 'gold':
        return COLORS.gold;
      case 'silver':
        return COLORS.silver;
      case 'bronze':
        return COLORS.bronze;
      default:
        return COLORS.primary;
    }
  }

  private wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const testWidth = this.doc.getTextWidth(testLine);

      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  downloadPDF(filename: string): void {
    this.doc.save(filename);
  }

  getPDFDataUrl(): string {
    return this.doc.output('dataurlstring');
  }
}

// Helper function to generate certificate
export async function generateAchievementPDF(config: CertificateConfig): Promise<{
  blob: Blob;
  dataUrl: string;
}> {
  const generator = new PDFCertificateGenerator();
  const blob = await generator.generateCertificate(config);
  const dataUrl = generator.getPDFDataUrl();

  return { blob, dataUrl };
}

// Helper to download certificate
export async function downloadCertificate(config: CertificateConfig, filename?: string): Promise<void> {
  const generator = new PDFCertificateGenerator();
  await generator.generateCertificate(config);
  
  const fileName = filename || `OKAYiT-Certificate-${config.recipientName.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
  generator.downloadPDF(fileName);
}
