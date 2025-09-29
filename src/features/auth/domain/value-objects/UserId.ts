import { randomUUID } from 'crypto';

export class UserId {
  private constructor(private readonly value: string) {
    this.validate();
  }

  public static create(value: string): UserId {
    return new UserId(value);
  }

  public static generate(): UserId {
    return new UserId(randomUUID());
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('UserId cannot be empty');
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: UserId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}