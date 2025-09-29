import { SessionId } from '../value-objects/SessionId';
import { UserId } from '../value-objects/UserId';
import { Token } from '../value-objects/Token';

export class AuthSession {
  constructor(
    private readonly id: SessionId,
    private readonly userId: UserId,
    private accessToken: Token,
    private refreshToken: Token,
    private readonly createdAt: Date,
    private lastActivityAt: Date,
    private readonly userAgent?: string,
    private readonly ipAddress?: string
  ) {}

  public static create(
    userId: UserId,
    accessToken: Token,
    refreshToken: Token,
    userAgent?: string,
    ipAddress?: string
  ): AuthSession {
    const now = new Date();
    return new AuthSession(
      SessionId.generate(),
      userId,
      accessToken,
      refreshToken,
      now,
      now,
      userAgent,
      ipAddress
    );
  }

  public static reconstitute(
    id: string,
    userId: string,
    accessToken: Token,
    refreshToken: Token,
    createdAt: Date,
    lastActivityAt: Date,
    userAgent?: string,
    ipAddress?: string
  ): AuthSession {
    return new AuthSession(
      SessionId.create(id),
      UserId.create(userId),
      accessToken,
      refreshToken,
      createdAt,
      lastActivityAt,
      userAgent,
      ipAddress
    );
  }

  public refreshTokens(newAccessToken: Token, newRefreshToken: Token): void {
    this.accessToken = newAccessToken;
    this.refreshToken = newRefreshToken;
    this.updateActivity();
  }

  public updateActivity(): void {
    this.lastActivityAt = new Date();
  }

  public isExpired(): boolean {
    return this.accessToken.isExpired() && this.refreshToken.isExpired();
  }

  public canRefresh(): boolean {
    return !this.refreshToken.isExpired();
  }

  public needsRefresh(): boolean {
    const fiveMinutes = 5 * 60 * 1000;
    return this.accessToken.getRemainingTime() < fiveMinutes;
  }

  public isValid(): boolean {
    return !this.isExpired();
  }

  public getId(): SessionId {
    return this.id;
  }

  public getUserId(): UserId {
    return this.userId;
  }

  public getAccessToken(): Token {
    return this.accessToken;
  }

  public getRefreshToken(): Token {
    return this.refreshToken;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getLastActivityAt(): Date {
    return this.lastActivityAt;
  }

  public getUserAgent(): string | undefined {
    return this.userAgent;
  }

  public getIpAddress(): string | undefined {
    return this.ipAddress;
  }
}