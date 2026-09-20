import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'okayit-admin-secret-2024';

// ── Rate Limiting ──────────────────────────────────────────────
const loginAttempts = new Map<string, { count: number; firstAttempt: number; lockedUntil?: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 30 * 60 * 1000;

function getRateLimitKey(request: NextRequest, email: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  return `${ip}:${email.toLowerCase()}`;
}

function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry) return { allowed: true };
  if (entry.lockedUntil && now < entry.lockedUntil) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000) };
  }
  if (now - entry.firstAttempt > WINDOW_MS) {
    loginAttempts.delete(key);
    return { allowed: true };
  }
  if (entry.count < MAX_ATTEMPTS) return { allowed: true };
  entry.lockedUntil = now + LOCKOUT_MS;
  return { allowed: false, retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000) };
}

function recordFailedAttempt(key: string) {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAttempt: now });
  } else {
    entry.count++;
  }
}

function clearAttempts(key: string) {
  loginAttempts.delete(key);
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of loginAttempts.entries()) {
    if (now - entry.firstAttempt > WINDOW_MS + LOCKOUT_MS) {
      loginAttempts.delete(key);
    }
  }
}, 10 * 60 * 1000);

// ── Auth Helper ────────────────────────────────────────────────
async function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string; home: string };
    const admin = await prisma.adminUser.findUnique({ where: { id: decoded.id, isActive: true } });
    return admin;
  } catch {
    return null;
  }
}

async function getAdminInfo(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user && ['SUPER_ADMIN', 'HOME_ADMIN', 'STAFF'].includes(session.user.role)) {
    return {
      name: session.user.displayName,
      role: session.user.role,
      home: session.user.careHomeName || 'all',
    };
  }
  const legacyAdmin = await verifyAdminToken(request);
  if (legacyAdmin) {
    return { name: legacyAdmin.name, role: legacyAdmin.role, home: legacyAdmin.home };
  }
  return null;
}

// ── POST — Login & Register ────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name, role, home } = body;

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
      }
      const rateLimitKey = getRateLimitKey(request, email);
      const rateCheck = checkRateLimit(rateLimitKey);
      if (!rateCheck.allowed) {
        return NextResponse.json(
          { error: 'Too many login attempts. Please try again later.', retryAfterSeconds: rateCheck.retryAfterSeconds },
          { status: 429 }
        );
      }
      const admin = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase(), isActive: true } });
      if (!admin) {
        recordFailedAttempt(rateLimitKey);
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (!passwordMatch) {
        recordFailedAttempt(rateLimitKey);
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      clearAttempts(rateLimitKey);
      const token = jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role, home: admin.home },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      return NextResponse.json({
        success: true,
        token,
        admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role, home: admin.home },
      });
    }

    if (action === 'register') {
      const existingAdmin = await verifyAdminToken(request);
      if (!existingAdmin) {
        return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });
      }
      if (!email || !password || !name) {
        return NextResponse.json({ error: 'Email, password, and name required' }, { status: 400 });
      }
      const existingEmail = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
      if (existingEmail) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newAdmin = await prisma.adminUser.create({
        data: { email: email.toLowerCase(), password: hashedPassword, name, role: role || 'staff', home: home || 'all' },
      });
      return NextResponse.json({
        success: true,
        message: 'Admin created successfully',
        admin: { id: newAdmin.id, email: newAdmin.email, name: newAdmin.name, role: newAdmin.role },
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ── GET — Dashboard Data ───────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const adminInfo = await getAdminInfo(request);
    if (!adminInfo) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const url = new URL(request.url);
    const dataType = url.searchParams.get('type') || 'dashboard';
    const homeFilter = adminInfo.home === 'all' ? undefined : adminInfo.home;
    const hw = homeFilter ? { home: homeFilter } : undefined;

    // ── Dashboard summary ──
    if (dataType === 'dashboard') {
      const [totalCheckins, recentCheckins, progressEntries] = await Promise.all([
        prisma.sharedWellbeingCheckin.count({ where: hw }),
        prisma.sharedWellbeingCheckin.findMany({ where: hw, orderBy: { createdAt: 'desc' }, take: 20 }),
        prisma.sharedProgress.findMany({ where: hw, orderBy: { createdAt: 'desc' }, take: 20 }),
      ]);
      const moodStats = await prisma.sharedWellbeingCheckin.groupBy({
        by: ['mood'],
        where: hw,
        _count: { mood: true },
        _avg: { moodLevel: true },
      });
      return NextResponse.json({
        success: true,
        data: { totalCheckins, recentCheckins, progressEntries, moodStats, admin: adminInfo },
      });
    }

    // ── Wellbeing list ──
    if (dataType === 'wellbeing') {
      const checkins = await prisma.sharedWellbeingCheckin.findMany({
        where: hw, orderBy: { createdAt: 'desc' }, take: 100,
      });
      return NextResponse.json({ success: true, data: checkins });
    }

    // ── Progress list ──
    if (dataType === 'progress') {
      const progress = await prisma.sharedProgress.findMany({
        where: hw, orderBy: { createdAt: 'desc' }, take: 100,
      });
      return NextResponse.json({ success: true, data: progress });
    }

    // ── Alerts (RAG) ──
    // Returns recent check-ins colour-coded by mood level:
    //   RED   = moodLevel 1-3  (needs urgent attention)
    //   AMBER = moodLevel 4-5  (worth monitoring)
    //   GREEN = moodLevel 6-10 (doing well)
    if (dataType === 'alerts') {
      const since = new Date();
      since.setDate(since.getDate() - 30); // last 30 days
      const checkins = await prisma.sharedWellbeingCheckin.findMany({
        where: { ...hw, createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
        take: 200,
        include: { alertActions: true },
      });

      const red = checkins.filter((c) => c.moodLevel <= 3);
      const amber = checkins.filter((c) => c.moodLevel >= 4 && c.moodLevel <= 5);
      const green = checkins.filter((c) => c.moodLevel >= 6);

      // Unique YPs currently at each level (most recent check-in wins)
      const latestByYP = new Map<string, typeof checkins[0]>();
      for (const c of checkins) {
        if (!latestByYP.has(c.anonymousId)) latestByYP.set(c.anonymousId, c);
      }

      const now = new Date();
      const ypStatuses = Array.from(latestByYP.values()).map((c) => {
        const rag = c.moodLevel <= 3 ? 'RED' : c.moodLevel <= 5 ? 'AMBER' : 'GREEN';
        const alertAction = c.alertActions?.[0] || null;
        const minutesSinceCheckin = (now.getTime() - new Date(c.createdAt).getTime()) / 60000;
        // Auto-escalation: RED unacknowledged >15min, AMBER unacknowledged >24h
        const isOverdue = alertAction
          ? alertAction.status === 'OPEN' && (
              (rag === 'RED' && minutesSinceCheckin > 15) ||
              (rag === 'AMBER' && minutesSinceCheckin > 1440)
            )
          : false;
        return {
          anonymousId: c.anonymousId,
          displayName: c.displayName,
          home: c.home,
          mood: c.mood,
          moodLevel: c.moodLevel,
          note: c.note,
          createdAt: c.createdAt,
          rag,
          alertAction: alertAction ? {
            id: alertAction.id,
            status: alertAction.status,
            alertLevel: alertAction.alertLevel,
            acknowledgedAt: alertAction.acknowledgedAt,
            acknowledgedBy: alertAction.acknowledgedBy,
            escalatedAt: alertAction.escalatedAt,
            escalatedReason: alertAction.escalatedReason,
            autoEscalated: alertAction.autoEscalated,
            resolvedAt: alertAction.resolvedAt,
            resolvedBy: alertAction.resolvedBy,
            outcome: alertAction.outcome,
            actions: alertAction.actions,
            createdAt: alertAction.createdAt,
          } : null,
          isOverdue,
          minutesSinceCheckin: Math.round(minutesSinceCheckin),
        };
      });

      // Sort: overdue first, then RED, then AMBER, then GREEN
      ypStatuses.sort((a, b) => {
        if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
        const order = { RED: 0, AMBER: 1, GREEN: 2 };
        return (order[a.rag as keyof typeof order] ?? 3) - (order[b.rag as keyof typeof order] ?? 3);
      });

      // Fetch all open/active alert actions for shift summary
      const activeAlerts = await prisma.alertAction.findMany({
        where: {
          ...(adminInfo.home !== 'all' ? { careHome: adminInfo.home } : {}),
          status: { in: ['OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS', 'ESCALATED'] },
        },
        include: { checkin: true },
        orderBy: { createdAt: 'desc' },
      });

      const overdueRed = activeAlerts.filter(a =>
        a.alertLevel === 'RED' && a.status === 'OPEN' &&
        (now.getTime() - new Date(a.createdAt).getTime()) > 15 * 60000
      );
      const overdueAmber = activeAlerts.filter(a =>
        a.alertLevel === 'AMBER' && a.status === 'OPEN' &&
        (now.getTime() - new Date(a.createdAt).getTime()) > 24 * 60 * 60000
      );

      // Auto-escalate overdue alerts (compute-on-read escalation)
      for (const a of [...overdueRed, ...overdueAmber]) {
        if (!a.autoEscalated) {
          const reason = a.alertLevel === 'RED'
            ? 'Auto-escalated: RED alert unacknowledged for over 15 minutes'
            : 'Auto-escalated: AMBER alert unacknowledged for over 24 hours';
          await prisma.alertAction.update({
            where: { id: a.id },
            data: {
              status: 'ESCALATED',
              autoEscalated: true,
              escalatedAt: now,
              escalatedReason: reason,
              actions: JSON.parse(JSON.stringify([...((a.actions as Array<Record<string, unknown>>) || []), {
                action: 'auto_escalated',
                note: reason,
                actorName: 'System',
                actorId: 'system',
                actorRole: 'SYSTEM',
                timestamp: now.toISOString(),
              }])),
            },
          }).catch(() => {});
        }
      }

      const shiftSummary = {
        totalActive: activeAlerts.length,
        openRed: activeAlerts.filter(a => a.alertLevel === 'RED' && a.status !== 'RESOLVED').length,
        openAmber: activeAlerts.filter(a => a.alertLevel === 'AMBER' && a.status !== 'RESOLVED').length,
        overdueCount: overdueRed.length + overdueAmber.length,
        escalatedCount: activeAlerts.filter(a => a.status === 'ESCALATED').length,
        needsAttention: activeAlerts.filter(a => ['OPEN', 'ESCALATED'].includes(a.status)).map(a => ({
          alertId: a.id,
          alertLevel: a.alertLevel,
          status: a.status,
          displayName: a.checkin.displayName || 'Anonymous',
          home: a.careHome,
          moodLevel: a.checkin.moodLevel,
          mood: a.checkin.mood,
          checkinAt: a.checkin.createdAt,
          minutesSince: Math.round((now.getTime() - new Date(a.createdAt).getTime()) / 60000),
          autoEscalated: a.autoEscalated,
        })),
      };

      return NextResponse.json({
        success: true,
        data: {
          summary: { red: red.length, amber: amber.length, green: green.length, total: checkins.length },
          ypStatuses,
          recentRed: red.slice(0, 10),
          shiftSummary,
        },
      });
    }

    // ── Individual YP profile ──
    if (dataType === 'profile') {
      const anonymousId = url.searchParams.get('anonymousId');
      if (!anonymousId) {
        return NextResponse.json({ error: 'anonymousId required' }, { status: 400 });
      }
      const checkins = await prisma.sharedWellbeingCheckin.findMany({
        where: { anonymousId, ...hw },
        orderBy: { createdAt: 'desc' },
        take: 90, // ~3 months of daily
      });
      const progress = await prisma.sharedProgress.findMany({
        where: { anonymousId, ...hw },
        orderBy: { createdAt: 'desc' },
        take: 30,
      });
      const displayName = checkins[0]?.displayName || progress[0]?.displayName || 'Anonymous';
      const home = checkins[0]?.home || progress[0]?.home || '';

      // Mood over time (for timeline chart)
      const moodTimeline = checkins.map((c) => ({
        date: c.createdAt,
        mood: c.mood,
        moodLevel: c.moodLevel,
        note: c.note,
      })).reverse(); // oldest first for chart

      // Average mood
      const avgMood = checkins.length > 0
        ? Math.round((checkins.reduce((sum, c) => sum + c.moodLevel, 0) / checkins.length) * 10) / 10
        : null;

      return NextResponse.json({
        success: true,
        data: {
          anonymousId,
          displayName,
          home,
          totalCheckins: checkins.length,
          avgMood,
          latestMood: checkins[0] || null,
          moodTimeline,
          recentNotes: checkins.filter((c) => c.note).slice(0, 10),
          progress,
        },
      });
    }

    // ── Reporting data ──
    if (dataType === 'report') {
      const days = parseInt(url.searchParams.get('days') || '30', 10);
      const since = new Date();
      since.setDate(since.getDate() - days);

      const checkins = await prisma.sharedWellbeingCheckin.findMany({
        where: { ...hw, createdAt: { gte: since } },
        orderBy: { createdAt: 'asc' },
      });

      // Daily mood averages
      const dailyMap = new Map<string, { total: number; count: number; red: number; amber: number; green: number }>();
      for (const c of checkins) {
        const day = new Date(c.createdAt).toISOString().slice(0, 10);
        const entry = dailyMap.get(day) || { total: 0, count: 0, red: 0, amber: 0, green: 0 };
        entry.total += c.moodLevel;
        entry.count++;
        if (c.moodLevel <= 3) entry.red++;
        else if (c.moodLevel <= 5) entry.amber++;
        else entry.green++;
        dailyMap.set(day, entry);
      }

      const dailyStats = Array.from(dailyMap.entries()).map(([date, v]) => ({
        date,
        avgMood: Math.round((v.total / v.count) * 10) / 10,
        count: v.count,
        red: v.red,
        amber: v.amber,
        green: v.green,
      }));

      // Overall stats
      const totalCheckins = checkins.length;
      const avgMood = totalCheckins > 0
        ? Math.round((checkins.reduce((s, c) => s + c.moodLevel, 0) / totalCheckins) * 10) / 10
        : 0;
      const uniqueYP = new Set(checkins.map((c) => c.anonymousId)).size;

      // Mood distribution
      const distribution = { amazing: 0, good: 0, okay: 0, struggling: 0, 'really-low': 0 } as Record<string, number>;
      for (const c of checkins) {
        distribution[c.mood] = (distribution[c.mood] || 0) + 1;
      }

      // CSV rows
      const csvRows = checkins.map((c) => ({
        date: new Date(c.createdAt).toISOString().slice(0, 10),
        time: new Date(c.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        displayName: c.displayName || 'Anonymous',
        home: c.home,
        mood: c.mood,
        moodLevel: c.moodLevel,
        note: c.note || '',
        rag: c.moodLevel <= 3 ? 'RED' : c.moodLevel <= 5 ? 'AMBER' : 'GREEN',
      }));

      return NextResponse.json({
        success: true,
        data: {
          period: { days, from: since.toISOString(), to: new Date().toISOString() },
          summary: { totalCheckins, avgMood, uniqueYP },
          distribution,
          dailyStats,
          csvRows,
        },
      });
    }

    // ── Success Metrics + Pattern Detection ──
    if (dataType === 'metrics') {
      const days = parseInt(url.searchParams.get('days') || '30', 10);
      const since = new Date();
      since.setDate(since.getDate() - days);
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

      const [checkins, alertActions] = await Promise.all([
        prisma.sharedWellbeingCheckin.findMany({
          where: { ...hw, createdAt: { gte: since } },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.alertAction.findMany({
          where: {
            ...(adminInfo.home !== 'all' ? { careHome: adminInfo.home } : {}),
            createdAt: { gte: since },
          },
          include: { checkin: true },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      // ── Response time metrics ──
      const resolvedAlerts = alertActions.filter(a => a.status === 'RESOLVED');
      const responseTimes = alertActions
        .filter(a => a.acknowledgedAt)
        .map(a => (new Date(a.acknowledgedAt!).getTime() - new Date(a.createdAt).getTime()) / 60000);
      const resolutionTimes = resolvedAlerts
        .filter(a => a.resolvedAt)
        .map(a => (new Date(a.resolvedAt!).getTime() - new Date(a.createdAt).getTime()) / 60000);

      const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : null;
      const median = (arr: number[]) => {
        if (!arr.length) return null;
        const s = [...arr].sort((a, b) => a - b);
        return Math.round(s[Math.floor(s.length / 2)]);
      };

      const redAlerts = alertActions.filter(a => a.alertLevel === 'RED');
      const redResponseTimes = redAlerts
        .filter(a => a.acknowledgedAt)
        .map(a => (new Date(a.acknowledgedAt!).getTime() - new Date(a.createdAt).getTime()) / 60000);
      const redWithin15 = redResponseTimes.filter(t => t <= 15).length;

      const amberAlerts = alertActions.filter(a => a.alertLevel === 'AMBER');
      const amberResponseTimes = amberAlerts
        .filter(a => a.acknowledgedAt)
        .map(a => (new Date(a.acknowledgedAt!).getTime() - new Date(a.createdAt).getTime()) / 60000);
      const amberWithin24h = amberResponseTimes.filter(t => t <= 1440).length;

      // ── Pattern detection per YP ──
      const ypMap = new Map<string, { name: string; home: string; moods: { level: number; date: Date }[] }>();
      for (const c of checkins) {
        if (!ypMap.has(c.anonymousId)) ypMap.set(c.anonymousId, { name: c.displayName || 'Anonymous', home: c.home, moods: [] });
        ypMap.get(c.anonymousId)!.moods.push({ level: c.moodLevel, date: new Date(c.createdAt) });
      }

      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      const ypPatterns = Array.from(ypMap.entries()).map(([id, yp]) => {
        const last7 = yp.moods.filter(m => m.date >= sevenDaysAgo);
        const all = yp.moods;
        const avg7 = last7.length > 0 ? Math.round((last7.reduce((s, m) => s + m.level, 0) / last7.length) * 10) / 10 : null;
        const avg30 = all.length > 0 ? Math.round((all.reduce((s, m) => s + m.level, 0) / all.length) * 10) / 10 : 0;
        const redCount = all.filter(m => m.level <= 3).length;
        const latestMood = all.length > 0 ? all[0].level : null;

        // Compute trend
        let trend: 'declining' | 'improving' | 'stable' = 'stable';
        if (avg7 !== null && avg7 < avg30 - 1) trend = 'declining';
        else if (avg7 !== null && avg7 > avg30 + 1) trend = 'improving';

        // ── Day-of-week analysis ──
        const dayBuckets: Record<number, number[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
        for (const m of all) {
          const dow = m.date.getDay();
          dayBuckets[dow].push(m.level);
        }
        const dayOfWeekAvg: Record<string, number | null> = {};
        let lowestDay: string | null = null;
        let lowestDayAvg = 11;
        for (let d = 0; d < 7; d++) {
          const arr = dayBuckets[d];
          const a = arr.length >= 2 ? Math.round((arr.reduce((s, v) => s + v, 0) / arr.length) * 10) / 10 : null;
          dayOfWeekAvg[dayNames[d]] = a;
          if (a !== null && a < lowestDayAvg) { lowestDayAvg = a; lowestDay = dayNames[d]; }
        }

        // ── Time-of-day patterns ──
        const timeBuckets = { morning: [] as number[], afternoon: [] as number[], evening: [] as number[], night: [] as number[] };
        for (const m of all) {
          const h = m.date.getHours();
          if (h >= 6 && h < 12) timeBuckets.morning.push(m.level);
          else if (h >= 12 && h < 17) timeBuckets.afternoon.push(m.level);
          else if (h >= 17 && h < 21) timeBuckets.evening.push(m.level);
          else timeBuckets.night.push(m.level);
        }
        const timeOfDayAvg: Record<string, number | null> = {};
        for (const [slot, arr] of Object.entries(timeBuckets)) {
          timeOfDayAvg[slot] = arr.length >= 2 ? Math.round((arr.reduce((s, v) => s + v, 0) / arr.length) * 10) / 10 : null;
        }

        // ── Silent disengagement: days since last check-in ──
        const latestDate = all.length > 0 ? all[0].date : null;
        const daysSinceLastCheckin = latestDate ? Math.round((now.getTime() - latestDate.getTime()) / 86400000) : null;
        const isDisengaged = daysSinceLastCheckin !== null && daysSinceLastCheckin >= 3;

        // ── Check-in frequency (avg days between) ──
        let avgGapDays: number | null = null;
        if (all.length >= 2) {
          const sorted = [...all].sort((a, b) => a.date.getTime() - b.date.getTime());
          let totalGap = 0;
          for (let i = 1; i < sorted.length; i++) {
            totalGap += (sorted[i].date.getTime() - sorted[i - 1].date.getTime()) / 86400000;
          }
          avgGapDays = Math.round((totalGap / (sorted.length - 1)) * 10) / 10;
        }

        // ── Predictive indicator ──
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDow = tomorrow.getDay();
        const tomorrowDayAvg = dayOfWeekAvg[dayNames[tomorrowDow]];
        let predictiveNote: string | null = null;
        if (tomorrowDayAvg !== null && tomorrowDayAvg <= 4 && lowestDay === dayNames[tomorrowDow]) {
          predictiveNote = `Historically low mood on ${dayNames[tomorrowDow]}s (avg ${tomorrowDayAvg}/10)`;
        } else if (isDisengaged) {
          predictiveNote = `No check-in for ${daysSinceLastCheckin} days — possible silent disengagement`;
        } else if (trend === 'declining' && latestMood !== null && latestMood <= 5) {
          predictiveNote = `Declining trend with recent low mood — monitor closely`;
        }

        // Risk score: 0-10, higher = more concern (enhanced)
        let riskScore = 0;
        if (latestMood !== null && latestMood <= 3) riskScore += 3;
        else if (latestMood !== null && latestMood <= 5) riskScore += 1.5;
        if (trend === 'declining') riskScore += 2.5;
        if (redCount >= 3) riskScore += 1.5;
        else if (redCount >= 1) riskScore += 0.5;
        if (avg7 !== null && avg7 <= 3) riskScore += 1;
        if (isDisengaged) riskScore += 2; // silent disengagement is a major signal
        else if (daysSinceLastCheckin !== null && daysSinceLastCheckin >= 2) riskScore += 0.5;
        riskScore = Math.min(Math.round(riskScore * 10) / 10, 10);

        return {
          anonymousId: id,
          name: yp.name,
          home: yp.home,
          totalCheckins: all.length,
          avgMood7d: avg7,
          avgMood30d: avg30,
          trend,
          riskScore,
          redCount,
          latestMood,
          // Phase C additions
          dayOfWeekAvg,
          timeOfDayAvg,
          lowestDay,
          daysSinceLastCheckin,
          isDisengaged,
          avgGapDays,
          predictiveNote,
        };
      });
      ypPatterns.sort((a, b) => b.riskScore - a.riskScore);

      // ── Global disengagement list ──
      const disengagedYPs = ypPatterns.filter(p => p.isDisengaged);

      return NextResponse.json({
        success: true,
        data: {
          period: { days, from: since.toISOString(), to: now.toISOString() },
          successMetrics: {
            totalAlerts: alertActions.length,
            resolved: resolvedAlerts.length,
            resolutionRate: alertActions.length > 0 ? Math.round((resolvedAlerts.length / alertActions.length) * 100) : 100,
            open: alertActions.filter(a => a.status === 'OPEN').length,
            escalated: alertActions.filter(a => a.status === 'ESCALATED').length,
            autoEscalated: alertActions.filter(a => a.autoEscalated).length,
            avgResponseMin: avg(responseTimes),
            medianResponseMin: median(responseTimes),
            avgResolutionMin: avg(resolutionTimes),
            red: {
              total: redAlerts.length,
              avgResponseMin: avg(redResponseTimes),
              within15min: redWithin15,
              complianceRate: redAlerts.length > 0 ? Math.round((redWithin15 / redAlerts.length) * 100) : 100,
            },
            amber: {
              total: amberAlerts.length,
              avgResponseMin: avg(amberResponseTimes),
              within24h: amberWithin24h,
              complianceRate: amberAlerts.length > 0 ? Math.round((amberWithin24h / amberAlerts.length) * 100) : 100,
            },
          },
          patterns: ypPatterns,
          atRiskCount: ypPatterns.filter(p => p.riskScore >= 5).length,
          disengagedCount: disengagedYPs.length,
          disengagedYPs: disengagedYPs.map(p => ({ anonymousId: p.anonymousId, name: p.name, home: p.home, daysSince: p.daysSinceLastCheckin })),
        },
      });
    }

    return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
  } catch (error) {
    console.error('Admin GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;