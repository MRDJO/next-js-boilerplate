import { z } from 'zod';

export const GetCurrentUserQuerySchema = z.object({
  sessionId: z.uuid('Invalid session ID format')
});

export const ValidateSessionQuerySchema = z.object({
  sessionId: z.uuid('Invalid session ID format'),
  userId: z.uuid('Invalid user ID format')
});

export const GetUserByEmailQuerySchema = z.object({
  email: z.email('Invalid email format')
});