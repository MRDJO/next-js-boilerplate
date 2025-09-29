"use server"
import { cookies } from 'next/headers';
import {  EncryptJWT, jwtDecrypt } from 'jose';

export interface SessionData {
  userId: string;
  sessionId: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  createdAt: string;
  lastActivityAt: string;
}

export class NextSessionService {
  private static readonly SESSION_COOKIE = 'auth-session';
  private static readonly SECRET_KEY = new TextEncoder().encode(
    process.env.SESSION_SECRET || 'your-super-secret-key-must-be-32-chars!'
  );
  
  static async createSession(sessionData: SessionData, rememberMe: boolean = false): Promise<void> {
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 jours ou 1 jour
    
    // Chiffrer les données de session
    const encryptedSession = await new EncryptJWT(sessionData as any)
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .setIssuedAt()
      .setExpirationTime(`${maxAge}s`)
      .encrypt(this.SECRET_KEY);

    // Créer le cookie sécurisé
    (await cookies()).set(this.SESSION_COOKIE, encryptedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: maxAge,
      path: '/'
    });
  }

  static async getSession(): Promise<SessionData | null> {
    try {
      const sessionCookie = (await cookies()).get(this.SESSION_COOKIE);
      if (!sessionCookie?.value) {
        return null;
      }

      // Déchiffrer et valider
      const { payload } = await jwtDecrypt(sessionCookie.value, this.SECRET_KEY);
      
      return payload as unknown as SessionData;
    } catch (error) {
      // Session invalide ou expirée
      this.clearSession();
      return null;
    }
  }

  static async updateSession(updates: Partial<SessionData>): Promise<void> {
    const currentSession = await this.getSession();
    if (!currentSession) {
      throw new Error('No session to update');
    }

    const updatedSession = {
      ...currentSession,
      ...updates,
      lastActivityAt: new Date().toISOString()
    };

    await this.createSession(updatedSession);
  }

  static async refreshSessionTokens(
    newAccessToken: string,
    newRefreshToken: string,
    newAccessTokenExpiresAt: string,
    newRefreshTokenExpiresAt: string
  ): Promise<void> {
    await this.updateSession({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiresAt: newAccessTokenExpiresAt,
      refreshTokenExpiresAt: newRefreshTokenExpiresAt
    });
  }

   static async clearSession(): Promise<void> {
    (await cookies()).delete(this.SESSION_COOKIE);
  }

  static async isSessionValid(): Promise<boolean> {
    const session = await this.getSession();
    if (!session) return false;

    // Vérifier expiration access token
    const accessTokenExpiry = new Date(session.accessTokenExpiresAt);
    const refreshTokenExpiry = new Date(session.refreshTokenExpiresAt);
    
    // Session valide si au moins le refresh token n'a pas expiré
    return new Date() < refreshTokenExpiry;
  }

  static async needsRefresh(): Promise<boolean> {
    const session = await this.getSession();
    if (!session) return false;

    const accessTokenExpiry = new Date(session.accessTokenExpiresAt);
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    
    return accessTokenExpiry < fiveMinutesFromNow;
  }
}