import { User } from '../entities/User';
import { AuthSession } from '../entities/AuthSession';
import { UserLoggedInEvent } from '../events/UserLoggedInEvent';
import { LogoutReason, UserLoggedOutEvent } from '../events/UserLoggedOutEvent';
import { TokenRefreshedEvent } from '../events/TokenRefreshedEvent';
import { DomainEvent } from '../events/DomainEvent';
import { Token } from '../value-objects/Token';

export class AuthenticationAggregate {
  private domainEvents: DomainEvent[] = [];

  constructor(
    private readonly user: User,
    private session?: AuthSession
  ) {}

  public static create(user: User): AuthenticationAggregate {
    return new AuthenticationAggregate(user);
  }

  public authenticate(
    plainPassword: string,
    accessToken: Token,
    refreshToken: Token,
    userAgent?: string,
    ipAddress?: string
  ): void {
    if (!this.user.canAuthenticate()) {
      throw new Error('User account is not active');
    }

    if (!this.user.verifyPassword(plainPassword)) {
      throw new Error('Invalid credentials');
    }

    // Create new session
    this.session = AuthSession.create(
      this.user.getId(),
      accessToken,
      refreshToken,
      userAgent,
      ipAddress
    );

    // Record login on user
    this.user.recordLogin();

    // Emit domain event
    this.addDomainEvent(new UserLoggedInEvent(
      this.user.getId().getValue(),
      this.session.getId().getValue(),
      userAgent,
      ipAddress
    ));
  }

  public refreshTokens(newAccessToken: Token, newRefreshToken: Token): void {
    if (!this.session) {
      throw new Error('No active session to refresh');
    }

    if (!this.session.canRefresh()) {
      throw new Error('Session cannot be refreshed');
    }

    const oldExpiry = this.session.getAccessToken().getExpiresAt();
    this.session.refreshTokens(newAccessToken, newRefreshToken);

    // Emit domain event
    this.addDomainEvent(new TokenRefreshedEvent(
      this.user.getId().getValue(),
      this.session.getId().getValue(),
      oldExpiry,
      newAccessToken.getExpiresAt()
    ));
  }

  public logout(reason: LogoutReason = LogoutReason.USER_INITIATED): void {
    if (!this.session) {
      throw new Error('No active session to logout');
    }

    const sessionId = this.session.getId().getValue();

    // Emit domain event before clearing session
    this.addDomainEvent(new UserLoggedOutEvent(
      this.user.getId().getValue(),
      sessionId,
      reason
    ));

    // Clear session
    this.session = undefined;
  }

  // Query methods
  public isAuthenticated(): boolean {
    return this.session !== undefined && this.session.isValid();
  }

  public needsTokenRefresh(): boolean {
    return this.session?.needsRefresh() ?? false;
  }

  // Getters
  public getUser(): User {
    return this.user;
  }

  public getSession(): AuthSession | undefined {
    return this.session;
  }

  public getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  public clearDomainEvents(): void {
    this.domainEvents = [];
  }

  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }
}