import { EventBus } from '../../application/ports/EventBus';
import { DomainEvent } from '../../domain/events/DomainEvent';

export class InMemoryEventBus implements EventBus {
  private handlers: Map<string, Array<(event: DomainEvent) => Promise<void>>> = new Map();

  async publish(event: DomainEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event.getEventName()) || [];
    
    await Promise.all(
      eventHandlers.map(handler => handler(event))
    );
  }

  async publishMany(events: DomainEvent[]): Promise<void> {
    await Promise.all(
      events.map(event => this.publish(event))
    );
  }

  subscribe(eventName: string, handler: (event: DomainEvent) => Promise<void>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    
    this.handlers.get(eventName)!.push(handler);
  }
}
