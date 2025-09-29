import { z } from 'zod';

export const BackendAuthResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    user: z.object({
      id: z.string().uuid(),
      email: z.string().email(),
      name: z.string(),
      createdAt: z.string().datetime(),
      lastLoginAt: z.string().datetime().optional(),
      isActive: z.boolean()
    }),
    tokens: z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
      accessTokenExpiresAt: z.string().datetime(),
      refreshTokenExpiresAt: z.string().datetime()
    }),
    session: z.object({
      id: z.string().uuid(),
      createdAt: z.string().datetime(),
      expiresAt: z.string().datetime()
    })
  }),
  message: z.string().optional()
});

export const BackendErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.object(z.any()).optional()
  })
});

export const RefreshTokenResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    tokens: z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
      accessTokenExpiresAt: z.string().datetime(),
      refreshTokenExpiresAt: z.string().datetime()
    })
  })
});