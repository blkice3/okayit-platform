import { z } from 'zod';

// ── Shared validation schemas ────────────────────

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(255)
  .transform((v) => v.toLowerCase().trim());

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const displayNameSchema = z
  .string()
  .min(1, 'Display name is required')
  .max(50, 'Display name too long')
  .trim();

export const inviteCodeSchema = z
  .string()
  .length(6, 'Invite code must be 6 characters')
  .regex(/^[A-Z0-9]+$/, 'Invite code must be uppercase letters and numbers')
  .transform((v) => v.toUpperCase().trim());

export const careHomeIdSchema = z.string().min(1).max(100);

// ── API Request Schemas ──────────────────────────

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export const createInviteSchema = z.object({
  displayName: displayNameSchema,
  careHomeId: careHomeIdSchema,
  grantedBy: z.string().min(1, 'Name of consenting adult required').max(100),
  grantedByRole: z.enum(['social_worker', 'care_home_manager', 'guardian', 'key_worker', 'support_worker', 'other']),
});

export const createStaffUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: displayNameSchema,
  role: z.enum(['HOME_ADMIN', 'STAFF']),
  careHomeId: careHomeIdSchema,
});

// ── Helper ────────────────────────────────────────
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const message = result.error.issues.map((i) => i.message).join('; ');
  return { success: false, error: message };
}
