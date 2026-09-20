// SAFEGUARDING COMPLIANCE REPORT — PDF Export
// Generates inspection-ready safeguarding report mapped to Ofsted Quality Standards
// Covers: alert resolution stats, staff response times, escalation data, pattern analysis

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import jsPDF from 'jspdf';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'okayit-admin-secret-2024';

async function getAdminInfo(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user && ['SUPER_ADMIN', 'HOME_ADMIN', 'STAFF'].includes(session.user.role)) {
    return { name: session.user.displayName || 'Staff', role: session.user.role, home: session.user.careHomeName || 'all' };
  }
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.substring(7), JWT_SECRET) as { id: string; role: string; home: string; name?: string };
      const admin = await prisma.adminUser.findUnique({ where: { id: decoded.id, isActive: true } });
      if (admin) return { name: admin.name, role: admin.role, home: admin.home };
    } catch { /* invalid */ }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const adminInfo = await getAdminInfo(request);
  if (!adminInfo) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const days = parseInt(url.searchParams.get('days') || '30', 10);
  const format = url.searchParams.get('format') || 'pdf'; // 'pdf' or 'json'
  const since = new Date();
  since.setDate(since.getDate() - days);
  const now = new Date();

  const hw = adminInfo.home !== 'all' ? { home: adminInfo.home } : {};
  const careHomeFilter = adminInfo.home !== 'all' ? { careHome: adminInfo.home } : {};

  // ── Gather all data ──
  const [checkins, alertActions, auditLogs] = await Promise.all([
    prisma.sharedWellbeingCheckin.findMany({
      where: { ...hw, createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.alertAction.findMany({
      where: { ...careHomeFilter, createdAt: { gte: since } },
      include: { checkin: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.auditLog.findMany({
      where: { createdAt: { gte: since }, sensitivity: 'safeguarding' },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
  ]);

  // ── Compute metrics ──
  const totalCheckins = checkins.length;
  const redCheckins = checkins.filter(c => c.moodLevel <= 3);
  const amberCheckins = checkins.filter(c => c.moodLevel >= 4 && c.moodLevel <= 5);
  const greenCheckins = checkins.filter(c => c.moodLevel >= 6);
  const uniqueYP = new Set(checkins.map(c => c.anonymousId)).size;

  // Alert resolution stats
  const totalAlerts = alertActions.length;
  const resolvedAlerts = alertActions.filter(a => a.status === 'RESOLVED');
  const openAlerts = alertActions.filter(a => a.status === 'OPEN');
  const escalatedAlerts = alertActions.filter(a => a.status === 'ESCALATED');
  const autoEscalated = alertActions.filter(a => a.autoEscalated);

  // Response time calculations
  const responseTimes = resolvedAlerts
    .filter(a => a.acknowledgedAt)
    .map(a => (new Date(a.acknowledgedAt!).getTime() - new Date(a.createdAt).getTime()) / 60000);
  const avgResponseMin = responseTimes.length > 0
    ? Math.round(responseTimes.reduce((s, t) => s + t, 0) / responseTimes.length)
    : null;
  const medianResponseMin = responseTimes.length > 0
    ? Math.round(responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length / 2)])
    : null;

  // Resolution time calculations
  const resolutionTimes = resolvedAlerts
    .filter(a => a.resolvedAt)
    .map(a => (new Date(a.resolvedAt!).getTime() - new Date(a.createdAt).getTime()) / 60000);
  const avgResolutionMin = resolutionTimes.length > 0
    ? Math.round(resolutionTimes.reduce((s, t) => s + t, 0) / resolutionTimes.length)
    : null;

  // RED alert specific response
  const redAlerts = alertActions.filter(a => a.alertLevel === 'RED');
  const redResolved = redAlerts.filter(a => a.status === 'RESOLVED');
  const redResponseTimes = redAlerts
    .filter(a => a.acknowledgedAt)
    .map(a => (new Date(a.acknowledgedAt!).getTime() - new Date(a.createdAt).getTime()) / 60000);
  const avgRedResponseMin = redResponseTimes.length > 0
    ? Math.round(redResponseTimes.reduce((s, t) => s + t, 0) / redResponseTimes.length)
    : null;
  const redWithin15min = redResponseTimes.filter(t => t <= 15).length;

  // Pattern detection: YPs with declining trends
  const ypMap = new Map<string, { name: string; moods: { level: number; date: Date }[] }>();
  for (const c of checkins) {
    if (!ypMap.has(c.anonymousId)) ypMap.set(c.anonymousId, { name: c.displayName || 'Anonymous', moods: [] });
    ypMap.get(c.anonymousId)!.moods.push({ level: c.moodLevel, date: new Date(c.createdAt) });
  }

  const atRiskYPs: { name: string; avgMood7d: number; avgMood30d: number; trend: string; redCount: number }[] = [];
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
  for (const [, yp] of ypMap) {
    const last7 = yp.moods.filter(m => m.date >= sevenDaysAgo);
    const all = yp.moods;
    if (all.length < 2) continue;
    const avg7 = last7.length > 0 ? last7.reduce((s, m) => s + m.level, 0) / last7.length : null;
    const avg30 = all.reduce((s, m) => s + m.level, 0) / all.length;
    const redCount = all.filter(m => m.level <= 3).length;
    let trend = 'stable';
    if (avg7 !== null && avg7 < avg30 - 1) trend = 'declining';
    else if (avg7 !== null && avg7 > avg30 + 1) trend = 'improving';
    if (trend === 'declining' || redCount >= 2 || (avg7 !== null && avg7 <= 4)) {
      atRiskYPs.push({
        name: yp.name,
        avgMood7d: avg7 !== null ? Math.round(avg7 * 10) / 10 : 0,
        avgMood30d: Math.round(avg30 * 10) / 10,
        trend,
        redCount,
      });
    }
  }
  atRiskYPs.sort((a, b) => a.avgMood7d - b.avgMood7d);

  // ── Build report data ──
  const reportData = {
    metadata: {
      generatedAt: now.toISOString(),
      generatedBy: adminInfo.name,
      role: adminInfo.role,
      careHome: adminInfo.home === 'all' ? 'All homes' : adminInfo.home,
      periodDays: days,
      periodFrom: since.toISOString().slice(0, 10),
      periodTo: now.toISOString().slice(0, 10),
    },
    overview: {
      totalCheckins,
      uniqueYP,
      redCount: redCheckins.length,
      amberCount: amberCheckins.length,
      greenCount: greenCheckins.length,
      avgMood: totalCheckins > 0 ? Math.round((checkins.reduce((s, c) => s + c.moodLevel, 0) / totalCheckins) * 10) / 10 : 0,
    },
    safeguarding: {
      totalAlerts,
      resolved: resolvedAlerts.length,
      open: openAlerts.length,
      escalated: escalatedAlerts.length,
      autoEscalated: autoEscalated.length,
      resolutionRate: totalAlerts > 0 ? Math.round((resolvedAlerts.length / totalAlerts) * 100) : 0,
    },
    responseTimes: {
      avgResponseMin,
      medianResponseMin,
      avgResolutionMin,
      redAlertStats: {
        total: redAlerts.length,
        resolved: redResolved.length,
        avgResponseMin: avgRedResponseMin,
        respondedWithin15min: redWithin15min,
        complianceRate: redAlerts.length > 0 ? Math.round((redWithin15min / redAlerts.length) * 100) : 100,
      },
    },
    patterns: {
      atRiskYPs,
      totalAtRisk: atRiskYPs.length,
    },
    auditTrail: {
      safeguardingActions: auditLogs.length,
      recentActions: auditLogs.slice(0, 20).map(l => ({
        date: l.createdAt,
        action: l.action,
        description: l.description,
        actorRole: l.actorRole,
      })),
    },
  };

  if (format === 'json') {
    return NextResponse.json({ success: true, data: reportData });
  }

  // ── Generate PDF ──
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = margin;

  function checkPage(needed: number) {
    if (y + needed > 280) { pdf.addPage(); y = margin; }
  }

  function heading(text: string, size: number = 14) {
    checkPage(12);
    pdf.setFontSize(size);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(124, 58, 237); // OKAYiT purple
    pdf.text(text, margin, y);
    y += size * 0.5 + 2;
  }

  function subheading(text: string) {
    checkPage(10);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text(text, margin, y);
    y += 6;
  }

  function bodyText(text: string) {
    checkPage(8);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    const lines = pdf.splitTextToSize(text, contentW);
    pdf.text(lines, margin, y);
    y += lines.length * 4.5;
  }

  function statRow(label: string, value: string | number) {
    checkPage(6);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text(label, margin + 2, y);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(40, 40, 40);
    pdf.text(String(value), margin + 100, y);
    y += 5;
  }

  function divider() {
    checkPage(4);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, y, pageW - margin, y);
    y += 4;
  }

  // ── Title Page ──
  pdf.setFillColor(124, 58, 237);
  pdf.rect(0, 0, pageW, 50, 'F');
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('OKAYiT Safeguarding', margin, 22);
  pdf.text('Compliance Report', margin, 33);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated: ${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`, margin, 44);
  y = 60;

  bodyText(`Report Period: ${reportData.metadata.periodFrom} to ${reportData.metadata.periodTo} (${days} days)`);
  bodyText(`Care Home: ${reportData.metadata.careHome}`);
  bodyText(`Generated by: ${reportData.metadata.generatedBy} (${reportData.metadata.role})`);
  y += 4;

  bodyText('This report is generated automatically by the OKAYiT safeguarding system. It provides an auditable record of wellbeing monitoring, alert response times, resolution tracking, and pattern analysis. Designed for use during Ofsted inspections and internal governance reviews.');
  y += 4;

  // ── Ofsted Quality Standards Mapping ──
  heading('Ofsted Quality Standards Mapping');
  const qsMapping = [
    { qs: 'QS 1 — Children are Safe', finding: `${reportData.safeguarding.totalAlerts} safeguarding alerts tracked. ${reportData.safeguarding.resolutionRate}% resolution rate. ${reportData.safeguarding.autoEscalated} auto-escalated. All actions timestamped with actor identity.` },
    { qs: 'QS 2 — Experiences & Progress', finding: `${reportData.overview.uniqueYP} young people actively sharing wellbeing data. Average mood: ${reportData.overview.avgMood}/10. ${reportData.patterns.totalAtRisk} young people flagged as at-risk.` },
    { qs: 'QS 4 — Leadership & Management', finding: `Staff response times monitored. Average acknowledgment: ${reportData.responseTimes.avgResponseMin ?? 'N/A'} minutes. RED alert 15-min compliance: ${reportData.responseTimes.redAlertStats.complianceRate}%.` },
  ];
  for (const qs of qsMapping) {
    subheading(qs.qs);
    bodyText(qs.finding);
    y += 2;
  }
  divider();

  // ── Overview ──
  heading('Wellbeing Overview');
  statRow('Total Check-ins', reportData.overview.totalCheckins);
  statRow('Unique Young People', reportData.overview.uniqueYP);
  statRow('Average Mood (1-10)', reportData.overview.avgMood);
  statRow('RED Check-ins (1-3)', reportData.overview.redCount);
  statRow('AMBER Check-ins (4-5)', reportData.overview.amberCount);
  statRow('GREEN Check-ins (6-10)', reportData.overview.greenCount);
  divider();

  // ── Safeguarding Alerts ──
  heading('Safeguarding Alert Resolution');
  statRow('Total Alerts Created', reportData.safeguarding.totalAlerts);
  statRow('Resolved', reportData.safeguarding.resolved);
  statRow('Currently Open', reportData.safeguarding.open);
  statRow('Escalated', reportData.safeguarding.escalated);
  statRow('Auto-Escalated (system)', reportData.safeguarding.autoEscalated);
  statRow('Resolution Rate', `${reportData.safeguarding.resolutionRate}%`);
  divider();

  // ── Response Times ──
  heading('Staff Response Performance');
  statRow('Avg. Acknowledgment Time', reportData.responseTimes.avgResponseMin !== null ? `${reportData.responseTimes.avgResponseMin} minutes` : 'No data');
  statRow('Median Acknowledgment Time', reportData.responseTimes.medianResponseMin !== null ? `${reportData.responseTimes.medianResponseMin} minutes` : 'No data');
  statRow('Avg. Resolution Time', reportData.responseTimes.avgResolutionMin !== null ? `${reportData.responseTimes.avgResolutionMin} minutes` : 'No data');
  y += 2;
  subheading('RED Alert Performance (15-minute target)');
  statRow('Total RED Alerts', reportData.responseTimes.redAlertStats.total);
  statRow('Resolved', reportData.responseTimes.redAlertStats.resolved);
  statRow('Responded Within 15 Minutes', reportData.responseTimes.redAlertStats.respondedWithin15min);
  statRow('15-Minute Compliance Rate', `${reportData.responseTimes.redAlertStats.complianceRate}%`);
  divider();

  // ── At-Risk Young People ──
  heading('Young People Requiring Attention');
  if (atRiskYPs.length === 0) {
    bodyText('No young people currently flagged as at-risk based on the analysis period.');
  } else {
    for (const yp of atRiskYPs.slice(0, 10)) {
      checkPage(14);
      subheading(`${yp.name}`);
      bodyText(`7-day avg: ${yp.avgMood7d}/10 | 30-day avg: ${yp.avgMood30d}/10 | Trend: ${yp.trend.toUpperCase()} | RED check-ins: ${yp.redCount}`);
    }
  }
  divider();

  // ── Audit Trail ──
  heading('Safeguarding Audit Trail');
  bodyText(`${reportData.auditTrail.safeguardingActions} safeguarding actions recorded in this period.`);
  y += 2;
  if (reportData.auditTrail.recentActions.length > 0) {
    subheading('Recent Safeguarding Actions');
    for (const action of reportData.auditTrail.recentActions.slice(0, 15)) {
      checkPage(8);
      const dateStr = new Date(action.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      bodyText(`[${dateStr}] ${action.description}`);
    }
  }

  // ── Footer on every page ──
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(160, 160, 160);
    pdf.text(`OKAYiT Safeguarding Compliance Report — Page ${i} of ${totalPages} — CONFIDENTIAL`, margin, 290);
    pdf.text(`Generated ${now.toISOString()} by ${adminInfo.name}`, pageW - margin, 290, { align: 'right' });
  }

  const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
  const filename = `OKAYiT_Compliance_Report_${now.toISOString().slice(0, 10)}.pdf`;

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
