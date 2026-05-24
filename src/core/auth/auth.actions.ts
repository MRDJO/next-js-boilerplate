"use server";

import { getAuthService } from "./auth.facade";

export async function loginAction(username: string, password: string) {
  return getAuthService().login(username, password);
}

export async function verifyOtpAction(otpSessionId: string, code: string) {
  return getAuthService().verifyOtp(otpSessionId, code);
}

export async function logoutAction() {
  await getAuthService().logout();
  return { code: 200, message: "Deconnexion reussie." };
}

export async function getCurrentUserAction() {
  return getAuthService().getCurrentUser();
}
