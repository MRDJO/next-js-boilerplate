import "server-only";

import { injectable } from "inversify";
import { featureFlags } from "@/core/config/feature-flags";
import type { AuthActionResult, AuthService, AuthUser } from "./auth.types";
import {
  clearAccessTokenCookie,
  readAccessTokenCookie,
  setAccessTokenCookie,
} from "./auth.cookie";

const MOCK_OTP_CODE = "123456";
const MOCK_TOKEN = "mock-access-token";

interface OtpSession {
  username: string;
  expiresAt: number;
}

const otpSessions = new Map<string, OtpSession>();

const createOtpSession = (username: string) => {
  const otpSessionId = crypto.randomUUID();
  otpSessions.set(otpSessionId, {
    username,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
  return otpSessionId;
};

@injectable()
export class MockAuthService implements AuthService {
  async getAccessToken() {
    const cookieToken = await readAccessTokenCookie();
    return cookieToken ?? undefined;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const token = await this.getAccessToken();
    if (!token) {
      return null;
    }

    return {
      id: "mock-user-1",
      name: "Utilisateur Demo",
      email: "demo@example.com",
    };
  }

  async login(username: string, _password: string): Promise<AuthActionResult> {
    if (!username.trim()) {
      return { code: 400, message: "Nom d'utilisateur requis." };
    }

    if (featureFlags.otpEnabled) {
      const otpSessionId = createOtpSession(username);
      return {
        code: 200,
        message: "Verification OTP requise (mock: utilisez 123456).",
        requiresOtp: true,
        otpSessionId,
      };
    }

    await setAccessTokenCookie(MOCK_TOKEN);
    return { code: 200, message: "Connexion reussie (mock)." };
  }

  async verifyOtp(otpSessionId: string, code: string): Promise<AuthActionResult> {
    const session = otpSessions.get(otpSessionId);

    if (!session || session.expiresAt < Date.now()) {
      otpSessions.delete(otpSessionId);
      return { code: 400, message: "Session OTP expiree ou invalide." };
    }

    if (code !== MOCK_OTP_CODE) {
      return { code: 401, message: "Code OTP invalide (mock: 123456)." };
    }

    otpSessions.delete(otpSessionId);
    await setAccessTokenCookie(MOCK_TOKEN);
    return { code: 200, message: "Connexion reussie (mock)." };
  }

  async logout() {
    await clearAccessTokenCookie();
  }
}
