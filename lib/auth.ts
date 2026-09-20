import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { UserRole, AccountStatus } from '@prisma/client';

// Sections allowed for pending users (intro/tutorial only)
export const PENDING_ALLOWED_SECTIONS = [
  'welcome', 'welcome-guide', 'main-menu'
];

// Type augmentation is in types/next-auth.d.ts

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // P0-02: 30-minute idle timeout (UK GDPR Art.32)
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  cookies: {
    state: {
      name: 'next-auth.state',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  providers: [
    // ── Google SSO ─────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),

    // ── Email + Password (Staff / Admin) ──────────
    CredentialsProvider({
      id: 'email-password',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          include: { careHome: true },
        });

        if (!user || !user.password) {
          throw new Error('no_account');
        }

        // Check account status — PENDING users are allowed in (restricted view)
        if (user.status === AccountStatus.SUSPENDED) {
          throw new Error('account_inactive');
        }
        if (user.status === AccountStatus.ARCHIVED) {
          throw new Error('account_inactive');
        }
        if (user.role === UserRole.YOUNG_PERSON) {
          throw new Error('yp_use_invite');
        }

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) {
          throw new Error('wrong_password');
        }

        // Update last login + audit
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        }).catch(() => {});
        await prisma.auditLog.create({
          data: {
            actorId: user.id,
            actorRole: user.role,
            action: 'LOGIN',
            resourceType: 'session',
            resourceId: user.id,
            careHomeId: user.careHomeId,
            description: `${user.displayName} logged in via email (${user.role})`,
            sensitivity: 'normal',
          },
        }).catch(() => {});

        return {
          id: user.id,
          displayName: user.displayName,
          email: user.email,
          role: user.role,
          status: user.status,
          careHomeId: user.careHomeId,
          careHomeName: user.careHome?.displayName || null,
        };
      },
    }),

    // ── Invite Code (Young Person) ────────────────
    // Code is a PERMANENT login — first use creates the account, subsequent uses log in
    CredentialsProvider({
      id: 'invite-code',
      name: 'Invite Code',
      credentials: {
        code: { label: 'Invite Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.code) return null;

        const code = credentials.code.toUpperCase().trim();

        const invite = await prisma.inviteCode.findUnique({
          where: { code },
          include: { careHome: true },
        });

        if (!invite) return null;

        // If already used, log in the existing user
        if (invite.usedAt && invite.usedByUserId) {
          const existingUser = await prisma.user.findUnique({
            where: { id: invite.usedByUserId },
            include: { careHome: true },
          });
          if (!existingUser) return null;
          if (existingUser.status === AccountStatus.SUSPENDED || existingUser.status === AccountStatus.ARCHIVED) return null;

          await prisma.user.update({
            where: { id: existingUser.id },
            data: { lastLoginAt: new Date() },
          }).catch(() => {});
          await prisma.auditLog.create({
            data: {
              actorId: existingUser.id,
              actorRole: 'YOUNG_PERSON',
              action: 'LOGIN',
              resourceType: 'session',
              resourceId: existingUser.id,
              careHomeId: existingUser.careHomeId,
              description: `${existingUser.displayName} logged in via invite code at ${existingUser.careHome?.displayName || 'care home'}`,
              sensitivity: 'normal',
            },
          }).catch(() => {});

          return {
            id: existingUser.id,
            displayName: existingUser.displayName,
            email: existingUser.email,
            role: existingUser.role,
            status: existingUser.status,
            careHomeId: existingUser.careHomeId,
            careHomeName: existingUser.careHome?.displayName || null,
          };
        }

        // First use — create account (code never expires for re-login)
        if (invite.expiresAt < new Date()) return null;

        const user = await prisma.user.create({
          data: {
            displayName: invite.displayName,
            name: invite.displayName,
            role: UserRole.YOUNG_PERSON,
            status: AccountStatus.ACTIVE,
            careHomeId: invite.careHomeId,
            createdById: invite.createdById,
            authProvider: 'invite-code',
            lastLoginAt: new Date(),
          },
        });

        await prisma.inviteCode.update({
          where: { id: invite.id },
          data: { usedAt: new Date(), usedByUserId: user.id },
        });

        await prisma.auditLog.create({
          data: {
            actorId: user.id,
            actorRole: 'YOUNG_PERSON',
            action: 'CREATE',
            resourceType: 'user',
            resourceId: user.id,
            careHomeId: invite.careHomeId,
            description: `Young person account activated via invite code for ${invite.displayName} at ${invite.careHome.displayName}`,
            sensitivity: 'high',
          },
        }).catch(() => {});

        return {
          id: user.id,
          displayName: user.displayName,
          email: null,
          role: user.role,
          status: user.status,
          careHomeId: user.careHomeId,
          careHomeName: invite.careHome.displayName,
        };
      },
    }),
  ],

  events: {
    // When adapter creates a new user (Google SSO), fill in defaults and notify admin
    async createUser({ user }) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            displayName: user.name || user.email?.split('@')[0] || 'New User',
            authProvider: 'google',
            // role defaults to STAFF, status defaults to PENDING via schema
          },
        });
        console.log(`[Auth] New Google user created (PENDING): ${user.email}`);

        // Send admin notification about new registration
        const notifId = process.env.NOTIF_ID_REGISTRATION_APPROVAL_REQUEST;
        if (notifId) {
          try {
            const { sendNotification } = await import('@/lib/email');
            await sendNotification({
              notificationId: notifId,
              subject: `New Registration: ${user.name || user.email}`,
              htmlBody: `<h2>New Staff Registration via Google</h2>
                <p><strong>Name:</strong> ${user.name || 'Not provided'}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Method:</strong> Google SSO</p>
                <p><strong>Status:</strong> Awaiting Approval</p>
                <p>Log in to the admin dashboard to approve or reject this registration.</p>`,
            });
          } catch (notifErr) {
            console.error('[Auth] Failed to send registration notification:', notifErr);
          }
        }
      } catch (err) {
        console.error('[Auth] Failed to update new Google user:', err);
      }
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      // For Google SSO: check approval status
      if (account?.provider === 'google') {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { status: true, role: true, displayName: true },
          });

          if (!dbUser) return true; // New user — let adapter create them

          if (dbUser.status === AccountStatus.PENDING) {
            // Allow PENDING users in — they'll see a restricted intro-only view
            return true;
          }
          if (dbUser.status === AccountStatus.SUSPENDED) {
            return '/login?error=account_suspended';
          }
          if (dbUser.status === AccountStatus.ARCHIVED) {
            return '/login?error=account_archived';
          }

          // Log successful login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          }).catch(() => {});
          await prisma.auditLog.create({
            data: {
              actorId: user.id,
              actorRole: dbUser.role,
              action: 'LOGIN',
              resourceType: 'session',
              resourceId: user.id,
              description: `${dbUser.displayName} logged in via Google SSO (${dbUser.role})`,
              sensitivity: 'normal',
            },
          }).catch(() => {});
        } catch (err) {
          console.error('[Auth] Google signIn callback error:', err);
        }
      }
      return true;
    },

    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.displayName = (user as any).displayName || user.name || '';
        token.role = (user as any).role || UserRole.STAFF;
        token.status = (user as any).status || AccountStatus.PENDING;
        token.careHomeId = (user as any).careHomeId || null;
        token.careHomeName = (user as any).careHomeName || null;
      }

      // Refresh user data from DB on every token refresh to pick up role/status changes
      if (trigger === 'update' || !token.role) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            include: { careHome: true },
          });
          if (dbUser) {
            token.displayName = dbUser.displayName || dbUser.name || '';
            token.role = dbUser.role;
            token.status = dbUser.status;
            token.careHomeId = dbUser.careHomeId;
            token.careHomeName = dbUser.careHome?.displayName || null;
          }
        } catch {}
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        displayName: token.displayName as string,
        email: token.email || null,
        role: token.role as UserRole,
        status: token.status as AccountStatus,
        careHomeId: (token.careHomeId as string) || null,
        careHomeName: (token.careHomeName as string) || null,
      };
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {}
      return baseUrl;
    },
  },
};

// ── Role Hierarchy Helper ─────────────────────────
const ROLE_HIERARCHY: Record<UserRole, number> = {
  SUPER_ADMIN: 4,
  HOME_ADMIN: 3,
  STAFF: 2,
  YOUNG_PERSON: 1,
};

export function hasMinRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canAccessHome(userRole: UserRole, userHomeId: string | null | undefined, targetHomeId: string): boolean {
  if (userRole === UserRole.SUPER_ADMIN) return true;
  return userHomeId === targetHomeId;
}
