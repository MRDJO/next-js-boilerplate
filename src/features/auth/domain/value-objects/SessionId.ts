import { randomUUID } from "crypto";

export class SessionId {
  private constructor(private readonly value: string) {
    this.validate();
  }

  public static generate(): SessionId {
    return new SessionId(randomUUID());
  }

  public static create(value: string): SessionId {
    return new SessionId(value);
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('SessionId cannot be empty');
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: SessionId): boolean {
    return this.value === other.value;
  }
}