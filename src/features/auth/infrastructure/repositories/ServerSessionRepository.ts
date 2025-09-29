import { SessionRepository } from '../../application/ports/SessionRepository';
import { AuthSession } from '../../domain/entities/AuthSession';
import { SessionId } from '../../domain/value-objects/SessionId';
import { UserId } from '../../domain/value-objects/UserId';
import { Token, TokenType } from '../../domain/value-objects/Token';
import { NextSessionService, SessionData } from '../services/NextSessionService';

export class ServerSessionRepository implements SessionRepository {
  async findById(sessionId: SessionId): Promise<AuthSession | null> {
    const sessionData = await NextSessionService.getSession();
    
    if (!sessionData || sessionData.sessionId !== sessionId.getValue()) {
      return null;
    }

    return this.mapToAuthSession(sessionData);
  }

  async findByUserId(userId: UserId): Promise<AuthSession[]> {
    const sessionData = await NextSessionService.getSession();
    
    if (!sessionData || sessionData.userId !== userId.getValue()) {
      return [];
    }

    const session = this.mapToAuthSession(sessionData);
    return session ? [session] : [];
  }

  async save(session: AuthSession): Promise<void> {
    const sessionData: SessionData = {
      userId: session.getUserId().getValue(),
      sessionId: session.getId().getValue(),
      email: '', // Sera rempli par le use case
      name: '', // Sera rempli par le use case
      accessToken: session.getAccessToken().getValue(),
      refreshToken: session.getRefreshToken().getValue(),
      accessTokenExpiresAt: session.getAccessToken().getExpiresAt().toISOString(),
      refreshTokenExpiresAt: session.getRefreshToken().getExpiresAt().toISOString(),
      createdAt: session.getCreatedAt().toISOString(),
      lastActivityAt: session.getLastActivityAt().toISOString()
    };

    await NextSessionService.createSession(sessionData);
  }

  async update(session: AuthSession): Promise<void> {
    await NextSessionService.updateSession({
      accessToken: session.getAccessToken().getValue(),
      refreshToken: session.getRefreshToken().getValue(),
      accessTokenExpiresAt: session.getAccessToken().getExpiresAt().toISOString(),
      refreshTokenExpiresAt: session.getRefreshToken().getExpiresAt().toISOString(),
      lastActivityAt: session.getLastActivityAt().toISOString()
    });
  }

  async delete(sessionId: SessionId): Promise<void> {
    const currentSession = await NextSessionService.getSession();
    
    if (currentSession && currentSession.sessionId === sessionId.getValue()) {
      NextSessionService.clearSession();
    }
  }

  async deleteAllByUserId(userId: UserId): Promise<void> {
    const currentSession = await NextSessionService.getSession();
    
    if (currentSession && currentSession.userId === userId.getValue()) {
      NextSessionService.clearSession();
    }
  }

  async cleanExpiredSessions(): Promise<void> {
    const isValid = await NextSessionService.isSessionValid();
    if (!isValid) {
      NextSessionService.clearSession();
    }
  }

  private mapToAuthSession(sessionData: SessionData): AuthSession {
    const accessToken = Token.create(
      sessionData.accessToken,
      new Date(sessionData.accessTokenExpiresAt),
      TokenType.ACCESS
    );

    const refreshToken = Token.create(
      sessionData.refreshToken,
      new Date(sessionData.refreshTokenExpiresAt),
      TokenType.REFRESH
    );

    return AuthSession.reconstitute(
      sessionData.sessionId,
      sessionData.userId,
      accessToken,
      refreshToken,
      new Date(sessionData.createdAt),
      new Date(sessionData.lastActivityAt)
    );
  }
}