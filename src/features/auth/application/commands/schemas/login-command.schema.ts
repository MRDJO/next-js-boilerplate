import { z } from 'zod';

export const LoginCommandSchema = z.object({
  email: z.email()
    .min(1, 'Email is required')
    .max(254, 'Email too long'),
  password: z.string()
    .min(1, 'Password is required')
    .max(128, 'Password too long'),
  userAgent: z.string().optional(),
  ipAddress: z.ipv6().optional(),
  rememberMe: z.boolean().default(false)
});

export const RegisterCommandSchema = z.object({
  email: z.email()
    .min(1, 'Email is required')
    .max(254, 'Email too long'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .trim(),
  userAgent: z.string().optional(),
  ipAddress: z.ipv6().optional()
});

export const RefreshTokenCommandSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
  sessionId: z.uuid('Invalid session ID format'),
  userAgent: z.string().optional(),
  ipAddress: z.ipv6().optional()
});

export const LogoutCommandSchema = z.object({
  sessionId: z.uuid('Invalid session ID format'),
  userId: z.uuid('Invalid user ID format'),
  reason: z.enum(['user_initiated', 'session_expired', 'token_invalid', 'security_violation'])
    .default('user_initiated')
});

export const ChangePasswordCommandSchema = z.object({
  userId: z.uuid('Invalid user ID format'),
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number')
});