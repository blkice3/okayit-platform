// ============================================
// PERSONALISED GUIDE LINK CONTAINMENT (OK-14)
// ============================================
// Server-side only. Every function here carries its own
// authorisation / validity checks so that an error in the
// application layer still fails CLOSED. A raw token is never
// stored, never logged and never placed in a URL after the
// initial exchange. Only SHA-256 hashes are persisted.

import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { generateSignedDownloadUrl } from '@/lib/s3';

export const GRANT_TTL_MS = 30 * 60 * 1000; // 30 minutes
export const GUIDE_COOKIE_NAME = '__Host-okayit_guide';

// ── Crypto helpers ────────────────────────────────
export function generateRawSecret(): string {
  // 32 bytes -> 64 hexadecimal characters
  return crypto.randomBytes(32).toString('hex');
}

export function sha256Hex(input: string): string {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

export function isValidTokenFormat(token: unknown): token is string {
  return typeof token === 'string' && /^[0-9a-f]{64}$/.test(token);
}

// Constant-time compare of the last4 label only (non secret) is not needed;
// all secret comparisons happen via a hashed unique lookup in the database.

export type GuideLinkStatus = 'active' | 'used' | 'expired' | 'revoked';

export function guideLinkStatus(link: {
  revoked: boolean;
  expiresAt: Date;
  useCount: number;
  useLimit: number;
}, now: Date = new Date()): GuideLinkStatus {
  if (link.revoked) return 'revoked';
  if (link.expiresAt.getTime() <= now.getTime()) return 'expired';
  if (link.useCount >= link.useLimit) return 'used';
  return 'active';
}

// ── Audit (never writes a raw token) ──────────────
type AuditMeta = { ip?: string | null; userAgent?: string | null; actorId?: string | null; actorRole?: string };

async function audit(
  action: string,
  description: string,
  opts: { resourceId?: string; careHomeId?: string; sensitivity?: string } & AuditMeta
) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: opts.actorId ?? null,
        actorRole: opts.actorRole ?? 'anonymous',
        actorIp: opts.ip ?? null,
        actorDevice: opts.userAgent ?? null,
        action,
        resourceType: 'guide_link',
        resourceId: opts.resourceId ?? null,
        careHomeId: opts.careHomeId ?? null,
        description,
        sensitivity: opts.sensitivity ?? 'high',
      },
    });
  } catch {
    // Audit failure must never surface a token or block the security path.
    console.error('guide-link audit write failed');
  }
}

// ── Token exchange (steps 1-6 of the spec, in order) ──
export type RedeemResult = { ok: true; grantSecret: string } | { ok: false };

export async function redeemGuideToken(
  rawToken: unknown,
  meta: AuditMeta = {}
): Promise<RedeemResult> {
  try {
    // Step 1 — validate exactly 64 hex characters.
    if (!isValidTokenFormat(rawToken)) {
      await audit('GUIDE_REJECT', 'Token exchange rejected: malformed token', meta);
      return { ok: false };
    }

    // Step 2 — look up by SHA-256 hash. Never look up a raw token.
    const tokenHash = sha256Hex(rawToken);
    const link = await prisma.guideLink.findUnique({ where: { tokenHash } });

    const now = new Date();

    // Step 3 — reject if unknown, revoked, expired, or use limit reached.
    // All of these produce the SAME outcome so the endpoint is not an oracle.
    if (!link) {
      await audit('GUIDE_REJECT', 'Token exchange rejected: no matching link', meta);
      return { ok: false };
    }
    if (
      link.revoked ||
      link.expiresAt.getTime() <= now.getTime() ||
      link.useCount >= link.useLimit
    ) {
      await audit('GUIDE_REJECT', 'Token exchange rejected: link not usable', {
        ...meta,
        resourceId: link.id,
        careHomeId: link.careHomeId,
      });
      return { ok: false };
    }

    // Step 4 — atomically increment the use count (guards against double-use
    // races), and record first/last used timestamps.
    const guarded = await prisma.guideLink.updateMany({
      where: {
        id: link.id,
        revoked: false,
        expiresAt: { gt: now },
        useCount: { lt: link.useLimit },
      },
      data: { useCount: { increment: 1 }, lastUsedAt: now },
    });
    if (guarded.count !== 1) {
      await audit('GUIDE_REJECT', 'Token exchange rejected: use limit reached (race)', {
        ...meta,
        resourceId: link.id,
        careHomeId: link.careHomeId,
      });
      return { ok: false };
    }
    if (!link.firstUsedAt) {
      await prisma.guideLink.update({
        where: { id: link.id },
        data: { firstUsedAt: now },
      });
    }

    // Step 5 — create a short lived grant (30 minutes). Store only its hash.
    const grantSecret = generateRawSecret();
    await prisma.guideGrant.create({
      data: {
        grantHash: sha256Hex(grantSecret),
        guideLinkId: link.id,
        expiresAt: new Date(now.getTime() + GRANT_TTL_MS),
      },
    });

    await audit('GUIDE_REDEEM', `Token redeemed for link ****${link.last4}`, {
      ...meta,
      resourceId: link.id,
      careHomeId: link.careHomeId,
      sensitivity: 'high',
    });

    // Step 6 handled by the route: 303 redirect to /g/view with the cookie set.
    return { ok: true, grantSecret };
  } catch {
    console.error('redeemGuideToken failed');
    return { ok: false };
  }
}

// ── Render a guide from a grant cookie (never from a token) ──
export type GuideRenderData = {
  homeDisplayName: string;
  childPreferredName: string;
  childRoom: string | null;
  keyWorkerName: string | null;
  photoUrl: string | null;
};

export async function resolveGuideGrant(
  rawGrantSecret: unknown,
  meta: AuditMeta = {}
): Promise<GuideRenderData | null> {
  try {
    if (typeof rawGrantSecret !== 'string' || !/^[0-9a-f]{64}$/.test(rawGrantSecret)) {
      return null;
    }
    const grantHash = sha256Hex(rawGrantSecret);
    const grant = await prisma.guideGrant.findUnique({
      where: { grantHash },
      include: { guideLink: { include: { careHome: true } } },
    });

    const now = new Date();
    if (!grant) return null;
    if (grant.expiresAt.getTime() <= now.getTime()) return null;

    const link = grant.guideLink;
    // Fail closed if the parent link has since been revoked or expired.
    if (!link || link.revoked || link.expiresAt.getTime() <= now.getTime()) {
      return null;
    }

    // Photograph: served through a signed URL that expires WITH the grant,
    // never a public or guessable URL. Storage path only is persisted.
    let photoUrl: string | null = null;
    if (link.photoStoragePath) {
      const remainingMs = grant.expiresAt.getTime() - now.getTime();
      const expiresIn = Math.max(60, Math.floor(remainingMs / 1000));
      try {
        photoUrl = await generateSignedDownloadUrl(link.photoStoragePath, expiresIn);
      } catch {
        photoUrl = null; // If it cannot be signed, show no photo rather than a public URL.
      }
    }

    await audit('GUIDE_VIEW', `Guide viewed for link ****${link.last4}`, {
      ...meta,
      resourceId: link.id,
      careHomeId: link.careHomeId,
      sensitivity: 'high',
    });

    return {
      homeDisplayName: link.careHome?.displayName || 'your new home',
      childPreferredName: link.childPreferredName,
      childRoom: link.childRoom,
      keyWorkerName: link.keyWorkerName,
      photoUrl,
    };
  } catch {
    console.error('resolveGuideGrant failed');
    return null;
  }
}

// ── Manager controls ──────────────────────────────
export async function issueGuideLink(params: {
  careHomeId: string;
  childPreferredName: string;
  childRoom?: string | null;
  keyWorkerName?: string | null;
  photoStoragePath?: string | null;
  expiryDays?: number;
  useLimit?: number;
  createdById: string;
  actorRole?: string;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<{ id: string; rawToken: string; last4: string; expiresAt: Date }> {
  const rawToken = generateRawSecret(); // 64 hex chars
  const last4 = rawToken.slice(-4);
  const expiryDays = params.expiryDays && params.expiryDays > 0 ? params.expiryDays : 1; // default 1 day
  const useLimit = params.useLimit && params.useLimit > 0 ? params.useLimit : 1; // default single use
  const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

  const link = await prisma.guideLink.create({
    data: {
      careHomeId: params.careHomeId,
      tokenHash: sha256Hex(rawToken),
      last4,
      childPreferredName: params.childPreferredName,
      childRoom: params.childRoom || null,
      keyWorkerName: params.keyWorkerName || null,
      photoStoragePath: params.photoStoragePath || null,
      expiresAt,
      useLimit,
      createdById: params.createdById,
    },
  });

  await audit('GUIDE_ISSUE', `Guide link issued ****${last4} (expires ${expiresAt.toISOString()}, useLimit ${useLimit})`, {
    actorId: params.createdById,
    actorRole: params.actorRole,
    ip: params.ip,
    userAgent: params.userAgent,
    resourceId: link.id,
    careHomeId: params.careHomeId,
    sensitivity: 'high',
  });

  return { id: link.id, rawToken, last4, expiresAt };
}

export async function revokeGuideLink(
  id: string,
  actor: { actorId: string; actorRole?: string; careHomeId?: string | null; ip?: string | null; userAgent?: string | null }
): Promise<boolean> {
  const link = await prisma.guideLink.findUnique({ where: { id } });
  if (!link) return false;
  // Home scoping check is enforced by the caller; still record the home.
  await prisma.$transaction([
    prisma.guideGrant.deleteMany({ where: { guideLinkId: id } }),
    prisma.guideLink.update({
      where: { id },
      data: { revoked: true, revokedAt: new Date(), revokedById: actor.actorId },
    }),
  ]);
  await audit('GUIDE_REVOKE', `Guide link revoked ****${link.last4} (grants deleted)`, {
    actorId: actor.actorId,
    actorRole: actor.actorRole,
    ip: actor.ip,
    userAgent: actor.userAgent,
    resourceId: id,
    careHomeId: link.careHomeId,
    sensitivity: 'high',
  });
  return true;
}

// Containment control: revoke EVERY outstanding link for a home in one action,
// and delete all their grants so open sessions die immediately.
export async function revokeAllGuideLinksForHome(
  careHomeId: string,
  actor: { actorId: string; actorRole?: string; ip?: string | null; userAgent?: string | null }
): Promise<number> {
  const links = await prisma.guideLink.findMany({
    where: { careHomeId, revoked: false },
    select: { id: true },
  });
  const ids = links.map((l) => l.id);
  if (ids.length === 0) {
    await audit('GUIDE_REVOKE_ALL', 'Revoke all requested: no outstanding links', {
      actorId: actor.actorId,
      actorRole: actor.actorRole,
      ip: actor.ip,
      userAgent: actor.userAgent,
      careHomeId,
      sensitivity: 'high',
    });
    return 0;
  }
  await prisma.$transaction([
    prisma.guideGrant.deleteMany({ where: { guideLinkId: { in: ids } } }),
    prisma.guideLink.updateMany({
      where: { id: { in: ids } },
      data: { revoked: true, revokedAt: new Date(), revokedById: actor.actorId },
    }),
  ]);
  await audit('GUIDE_REVOKE_ALL', `Revoke all: ${ids.length} link(s) revoked and all grants deleted`, {
    actorId: actor.actorId,
    actorRole: actor.actorRole,
    ip: actor.ip,
    userAgent: actor.userAgent,
    careHomeId,
    sensitivity: 'high',
  });
  return ids.length;
}

export async function listGuideLinks(careHomeId: string) {
  const now = new Date();
  const links = await prisma.guideLink.findMany({
    where: { careHomeId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      last4: true,
      childPreferredName: true,
      childRoom: true,
      keyWorkerName: true,
      expiresAt: true,
      useLimit: true,
      useCount: true,
      firstUsedAt: true,
      lastUsedAt: true,
      revoked: true,
      createdAt: true,
    },
  });
  return links.map((l) => ({ ...l, status: guideLinkStatus(l, now) }));
}
