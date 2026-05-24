import "server-only";

import { injectable } from "inversify";
import { env } from "@/core/config/env";
import { featureFlags } from "@/core/config/feature-flags";
import type { AuthActionResult, AuthService, AuthUser } from "./auth.types";
import {
  clearAccessTokenCookie,
  readAccessTokenCookie,
  setAccessTokenCookie,
} from "./auth.cookie";

interface LoginApiResponse {
  accessToken?: { token: string };
  requiresOtp?: boolean;
  otpSessionId?: string;
  message?: string;
}

interface MeApiResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

@injectable()
export class CookieAuthService implements AuthService {
  async getAccessToken() {
    return readAccessTokenCookie();
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const token = await this.getAccessToken();
    if (!token || !env.backendBaseUrl) {
      return null;
    }

    try {
      const response = await fetch(`${env.backendBaseUrl}auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as MeApiResponse;
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      };
    } catch {
      return null;
    }
  }

  async login(username: string, password: string): Promise<AuthActionResult> {
    if (!env.backendBaseUrl) {
      return { code: 500, message: "NEXTBACKEND_URL est manquant." };
    }

    try {
      const response = await fetch(`${env.backendBaseUrl}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, otpEnabled: featureFlags.otpEnabled }),
      });

      const data = (await response.json()) as LoginApiResponse;

      if (!response.ok) {
        return {
          code: response.status,
          message: data.message ?? "Identifiants invalides.",
        };
      }

      if (featureFlags.otpEnabled && data.requiresOtp && data.otpSessionId) {
        return {
          code: 200,
          message: "Verification OTP requise.",
          requiresOtp: true,
          otpSessionId: data.otpSessionId,
        };
      }

      const token = data.accessToken?.token;
      if (!token) {
        return { code: 500, message: "Token d'acces manquant dans la reponse." };
      }

      await setAccessTokenCookie(token);
      return { code: 200, message: "Connexion reussie." };
    } catch {
      return { code: 500, message: "Echec de la connexion." };
    }
  }

  async verifyOtp(otpSessionId: string, code: string): Promise<AuthActionResult> {
    if (!env.backendBaseUrl) {
      return { code: 500, message: "NEXTBACKEND_URL est manquant." };
    }

    try {
      const response = await fetch(`${env.backendBaseUrl}auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpSessionId, code }),
      });

      const data = (await response.json()) as LoginApiResponse;

      if (!response.ok) {
        return {
          code: response.status,
          message: data.message ?? "Code OTP invalide.",
        };
      }

      const token = data.accessToken?.token;
      if (!token) {
        return { code: 500, message: "Token d'acces manquant dans la reponse." };
      }

      await setAccessTokenCookie(token);
      return { code: 200, message: "Connexion reussie." };
    } catch {
      return { code: 500, message: "Echec de la verification OTP." };
    }
  }

  async logout() {
    await clearAccessTokenCookie();
  }
}
