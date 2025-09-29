import { DomainEvent } from "./DomainEvent";

export class UserLoggedOutEvent extends DomainEvent {
  constructor(
    userId: string,
    public readonly sessionId: string,
    public readonly reason: LogoutReason = LogoutReason.USER_INITIATED
  ) {
    super(userId);
  }

  getEventName(): string {
    return 'UserLoggedOut';
  }
}

export enum LogoutReason {
  USER_INITIATED = 'user_initiated',
  SESSION_EXPIRED = 'session_expired',
  TOKEN_INVALID = 'token_invalid',
  SECURITY_VIOLATION = 'security_violation'
}

