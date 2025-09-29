import { DomainEvent } from '../../domain/events/DomainEvent';

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  publishMany(events: DomainEvent[]): Promise<void>;
}