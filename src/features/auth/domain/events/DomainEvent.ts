import { randomUUID } from "crypto";

export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventId: string;

  constructor(
    public readonly aggregateId: string,
    public readonly eventVersion: number = 1
  ) {
    this.occurredOn = new Date();
    this.eventId = randomUUID();
  }

  abstract getEventName(): string;
}