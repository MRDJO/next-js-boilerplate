import { z } from "zod";

export const createUserSchema = z.object({
  fullName: z.string().min(2),
  username: z.string().min(3),
  email: z.email(),
  phone: z.string().min(8),
  roleId: z.number().int().positive(),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
