import { DomainEvent } from "./DomainEvent";

export class TokenRefreshedEvent extends DomainEvent {
  constructor(
    userId: string,
    public readonly sessionId: string,
    public readonly oldTokenExpiry: Date,
    public readonly newTokenExpiry: Date
  ) {
    super(userId);
  }

  getEventName(): string {
    return 'TokenRefreshed';
  }
}
