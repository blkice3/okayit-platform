// SOVEREIGN IDENTITY — Leaver Profile Export
// Generates a portable PDF containing a young person's complete data:
// identity profile, wellbeing history, achievements, mood timeline, support contacts.
// This is their data — they own it and take it with them when leaving care.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import jsPDF from 'jspdf';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // P0-03: Require authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { anonymousId, identityProfile } = body;

    if (!anonymousId) {
      return NextResponse.json({ error: 'anonymousId is required' }, { status: 400 });
    }

    // Fetch server-side data
    const [checkins, progress] = await Promise.all([
      prisma.sharedWellbeingCheckin.findMany({
        where: { anonymousId },
        orderBy: { createdAt: 'desc' },
        take: 365,
      }),
      prisma.sharedProgress.findMany({
        where: { anonymousId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    ]);

    const displayName = identityProfile?.nickname || checkins[0]?.displayName || 'Young Person';
    const home = checkins[0]?.home || '';

    // Build the PDF
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 18;
    const contentW = pageW - margin * 2;
    let y = 0;

    const addPageIfNeeded = (needed: number) => {
      if (y + needed > pageH - 25) {
        doc.addPage();
        y = margin;
        // Footer on each page
        addFooter();
      }
    };

    const addFooter = () => {
      const pg = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(160, 160, 160);
      doc.text(`OKAYiT — My Data Export — Page ${pg}`, pageW / 2, pageH - 10, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageW / 2, pageH - 6, { align: 'center' });
    };

    // ═══ COVER PAGE ═══
    // Purple header block
    doc.setFillColor(124, 58, 237); // #7c3aed
    doc.rect(0, 0, pageW, 80, 'F');
    doc.setFontSize(32);
    doc.setTextColor(255, 255, 255);
    doc.text('My OKAYiT Profile', pageW / 2, 35, { align: 'center' });
    doc.setFontSize(14);
    doc.text('This is your data. You own it.', pageW / 2, 48, { align: 'center' });
    doc.setFontSize(11);
    doc.text('A record of your time, your growth, and your story.', pageW / 2, 58, { align: 'center' });

    y = 95;
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(16);
    doc.text(displayName, pageW / 2, y, { align: 'center' });
    y += 8;
    if (home) {
      doc.setFontSize(11);
      doc.setTextColor(120, 120, 120);
      doc.text(home.charAt(0).toUpperCase() + home.slice(1) + ' House', pageW / 2, y, { align: 'center' });
      y += 6;
    }

    // Identity avatar
    if (identityProfile?.avatar) {
      doc.setFontSize(40);
      doc.text(identityProfile.avatar, pageW / 2, y + 15, { align: 'center' });
      y += 25;
    }

    y += 10;

    // Quick stats box
    const totalCheckins = checkins.length;
    const avgMood = totalCheckins > 0
      ? Math.round((checkins.reduce((s, c) => s + c.moodLevel, 0) / totalCheckins) * 10) / 10
      : 0;
    const achievements = progress.filter(p => p.progressType === 'achievement').length;
    const journalEntries = progress.filter(p => p.progressType === 'journal').length;

    doc.setFillColor(245, 243, 255);
    doc.roundedRect(margin, y, contentW, 30, 3, 3, 'F');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const statY = y + 12;
    const col = contentW / 4;
    const stats = [
      { label: 'Check-ins', value: String(totalCheckins) },
      { label: 'Avg Mood', value: `${avgMood}/10` },
      { label: 'Achievements', value: String(achievements) },
      { label: 'Journal Entries', value: String(journalEntries) },
    ];
    stats.forEach((s, i) => {
      const cx = margin + col * i + col / 2;
      doc.setFontSize(16);
      doc.setTextColor(124, 58, 237);
      doc.text(s.value, cx, statY, { align: 'center' });
      doc.setFontSize(8);
      doc.setTextColor(130, 130, 130);
      doc.text(s.label, cx, statY + 7, { align: 'center' });
    });
    y += 40;

    addFooter();

    // ═══ ABOUT ME SECTION ═══
    if (identityProfile && (identityProfile.nickname || identityProfile.aboutMe || identityProfile.interests?.length > 0)) {
      doc.addPage();
      y = margin;
      addFooter();

      // Section header
      doc.setFillColor(124, 58, 237);
      doc.roundedRect(margin, y, contentW, 10, 2, 2, 'F');
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text('About Me', margin + 5, y + 7);
      y += 16;

      const ip = identityProfile;
      const fields: [string, string | undefined][] = [
        ['Nickname', ip.nickname],
        ['Pronouns', ip.pronouns],
        ['Birthday', ip.birthday],
        ['Favourite Colour', ip.favouriteColour],
        ['My Dream', ip.dream],
        ['My Superpower', ip.superpower],
        ['My Safe Place', ip.safePlace],
        ['Trusted Adult', ip.trustedAdult],
        ['Trusted Adult Contact', ip.trustedAdultContact],
      ];

      for (const [label, val] of fields) {
        if (val) {
          addPageIfNeeded(10);
          doc.setFontSize(9);
          doc.setTextColor(130, 130, 130);
          doc.text(label, margin, y);
          doc.setFontSize(11);
          doc.setTextColor(60, 60, 60);
          doc.text(val, margin + 50, y);
          y += 7;
        }
      }

      if (ip.interests?.length > 0) {
        y += 3;
        addPageIfNeeded(15);
        doc.setFontSize(9);
        doc.setTextColor(130, 130, 130);
        doc.text('Interests', margin, y);
        y += 5;
        doc.setFontSize(10);
        doc.setTextColor(124, 58, 237);
        const interestLabels: Record<string, string> = {
          music: 'Music', gaming: 'Gaming', art: 'Art & Drawing', reading: 'Reading',
          sports: 'Sports', photography: 'Photography', cooking: 'Cooking', nature: 'Nature',
          writing: 'Writing', animals: 'Animals', film: 'Films & TV', dance: 'Dance',
        };
        const interestText = ip.interests.map((i: string) => interestLabels[i] || i).join('  •  ');
        const lines = doc.splitTextToSize(interestText, contentW);
        doc.text(lines, margin, y);
        y += lines.length * 5 + 3;
      }

      if (ip.aboutMe) {
        y += 3;
        addPageIfNeeded(20);
        doc.setFontSize(9);
        doc.setTextColor(130, 130, 130);
        doc.text('About Me', margin, y);
        y += 5;
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const lines = doc.splitTextToSize(ip.aboutMe, contentW);
        doc.text(lines, margin, y);
        y += lines.length * 5 + 3;
      }
    }

    // ═══ WELLBEING TIMELINE ═══
    if (checkins.length > 0) {
      doc.addPage();
      y = margin;
      addFooter();

      doc.setFillColor(236, 72, 153); // pink
      doc.roundedRect(margin, y, contentW, 10, 2, 2, 'F');
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text('My Wellbeing Journey', margin + 5, y + 7);
      y += 16;

      // Mood summary by category
      const moodCounts: Record<string, number> = {};
      for (const c of checkins) {
        moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1;
      }
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const moodEmojis: Record<string, string> = {
        amazing: '🤩', good: '😊', okay: '😐', struggling: '😟', 'really-low': '😢',
      };
      let mx = margin;
      for (const [mood, count] of Object.entries(moodCounts)) {
        addPageIfNeeded(10);
        const label = `${moodEmojis[mood] || ''} ${mood}: ${count}`;
        doc.text(label, mx, y);
        mx += 35;
        if (mx > pageW - margin - 30) { mx = margin; y += 6; }
      }
      y += 10;

      // Recent check-ins table (last 50)
      doc.setFontSize(9);
      doc.setTextColor(130, 130, 130);
      doc.text('Recent Check-ins (most recent first)', margin, y);
      y += 6;

      // Table header
      addPageIfNeeded(8);
      doc.setFillColor(240, 240, 245);
      doc.rect(margin, y - 4, contentW, 7, 'F');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Date', margin + 2, y);
      doc.text('Mood', margin + 40, y);
      doc.text('Level', margin + 75, y);
      doc.text('Note', margin + 95, y);
      y += 5;

      const displayCheckins = checkins.slice(0, 50);
      for (const c of displayCheckins) {
        addPageIfNeeded(7);
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        const date = new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const time = new Date(c.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        doc.text(`${date} ${time}`, margin + 2, y);
        doc.text(c.mood, margin + 40, y);

        // Colour-coded level
        if (c.moodLevel <= 3) doc.setTextColor(220, 38, 38);
        else if (c.moodLevel <= 5) doc.setTextColor(217, 119, 6);
        else doc.setTextColor(22, 163, 74);
        doc.text(`${c.moodLevel}/10`, margin + 75, y);

        doc.setTextColor(100, 100, 100);
        if (c.note) {
          const noteLines = doc.splitTextToSize(c.note, contentW - 95);
          doc.text(noteLines[0], margin + 95, y);
          if (noteLines.length > 1) {
            y += 4;
            doc.text(noteLines.slice(1, 3).join(' '), margin + 95, y);
          }
        }
        y += 5;
      }
      if (checkins.length > 50) {
        y += 3;
        doc.setFontSize(8);
        doc.setTextColor(130, 130, 130);
        doc.text(`... and ${checkins.length - 50} earlier check-ins`, margin, y);
      }
    }

    // ═══ ACHIEVEMENTS & JOURNAL ═══
    const achievementEntries = progress.filter(p => p.progressType === 'achievement');
    const journalEntriesList = progress.filter(p => p.progressType === 'journal');

    if (achievementEntries.length > 0 || journalEntriesList.length > 0) {
      doc.addPage();
      y = margin;
      addFooter();

      doc.setFillColor(16, 185, 129); // emerald
      doc.roundedRect(margin, y, contentW, 10, 2, 2, 'F');
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text('My Achievements & Journal', margin + 5, y + 7);
      y += 16;

      if (achievementEntries.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);
        doc.text(`Achievements (${achievementEntries.length})`, margin, y);
        y += 6;

        for (const a of achievementEntries.slice(0, 30)) {
          addPageIfNeeded(12);
          doc.setFontSize(9);
          doc.setTextColor(16, 185, 129);
          doc.text('★', margin, y);
          doc.setTextColor(60, 60, 60);
          let progressText = '';
          try {
            const pd = typeof a.progressData === 'string' ? JSON.parse(a.progressData) : a.progressData;
            progressText = pd.title || pd.description || JSON.stringify(pd);
          } catch { progressText = String(a.progressData); }
          const lines = doc.splitTextToSize(progressText, contentW - 10);
          doc.text(lines[0], margin + 6, y);
          doc.setFontSize(7);
          doc.setTextColor(150, 150, 150);
          doc.text(new Date(a.createdAt).toLocaleDateString('en-GB'), margin + 6, y + 4);
          y += 8 + (lines.length > 1 ? 4 : 0);
        }
        y += 5;
      }

      if (journalEntriesList.length > 0) {
        addPageIfNeeded(15);
        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);
        doc.text(`Journal Entries (${journalEntriesList.length})`, margin, y);
        y += 6;

        for (const j of journalEntriesList.slice(0, 20)) {
          addPageIfNeeded(15);
          doc.setFontSize(8);
          doc.setTextColor(130, 130, 130);
          doc.text(new Date(j.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }), margin, y);
          y += 4;
          doc.setFontSize(9);
          doc.setTextColor(60, 60, 60);
          let journalText = '';
          try {
            const pd = typeof j.progressData === 'string' ? JSON.parse(j.progressData) : j.progressData;
            journalText = pd.entry || pd.text || pd.content || JSON.stringify(pd);
          } catch { journalText = String(j.progressData); }
          const lines = doc.splitTextToSize(journalText, contentW);
          doc.text(lines.slice(0, 4), margin, y);
          y += lines.slice(0, 4).length * 4 + 5;
        }
      }
    }

    // ═══ FINAL PAGE — YOUR RIGHTS ═══
    doc.addPage();
    y = margin;
    addFooter();

    doc.setFillColor(59, 130, 246); // blue
    doc.roundedRect(margin, y, contentW, 10, 2, 2, 'F');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text('Your Rights & Support', margin + 5, y + 7);
    y += 18;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const rightsText = [
      'This document belongs to you. It is a record of your time in care and your personal growth.',
      '',
      'Your Rights:',
      '• You have the right to access all data held about you',
      '• You have the right to take this document with you when you leave care',
      '• You have the right to request corrections to any inaccurate information',
      '• Your data is kept confidential and only shared with your consent',
      '',
      'Key Contacts:',
      '• Childline: 0800 1111 (free, 24/7)',
      '• The Mix: 0808 808 4994 (under 25s)',
      '• Coram Voice: 0808 800 5792 (children in care)',
      '• Your local authority leaving care team',
      '',
      'Remember: your experiences and your growth are uniquely yours.',
      'Wherever you go next, you carry your strength with you.',
    ];
    for (const line of rightsText) {
      addPageIfNeeded(6);
      if (line.startsWith('Your Rights:') || line.startsWith('Key Contacts:') || line.startsWith('Remember:')) {
        doc.setFontSize(11);
        doc.setTextColor(59, 130, 246);
      } else {
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
      }
      if (line === '') { y += 3; continue; }
      doc.text(line, margin, y);
      y += 6;
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="OKAYiT_My_Profile_${displayName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Leaver profile export error:', error);
    return NextResponse.json({ error: 'Failed to generate profile export' }, { status: 500 });
  }
}
