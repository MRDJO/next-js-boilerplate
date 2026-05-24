import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(5, "Le mot de passe doit contenir au moins 5 caracteres"),
});

export const otpSchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, "Le code OTP doit contenir exactement 6 chiffres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
