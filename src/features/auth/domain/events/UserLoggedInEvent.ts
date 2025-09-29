import { DomainEvent } from "./DomainEvent";

export class UserLoggedInEvent extends DomainEvent {
  constructor(
    userId: string,
    public readonly sessionId: string,
    public readonly userAgent?: string,
    public readonly ipAddress?: string
  ) {
    super(userId);
  }

  getEventName(): string {
    return 'UserLoggedIn';
  }
}