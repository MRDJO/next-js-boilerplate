export class Token {
  private constructor(
    private readonly value: string,
    private readonly expiresAt: Date,
    private readonly type: TokenType = TokenType.ACCESS
  ) {
    this.validate();
  }

  public static create(value: string, expiresAt: Date, type: TokenType = TokenType.ACCESS): Token {
    return new Token(value, expiresAt, type);
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('Token value cannot be empty');
    }
    
    if (this.expiresAt <= new Date()) {
      throw new Error('Token cannot be created with past expiration date');
    }
  }

  public getValue(): string {
    return this.value;
  }

  public getExpiresAt(): Date {
    return this.expiresAt;
  }

  public getType(): TokenType {
    return this.type;
  }

  public isExpired(): boolean {
    return new Date() >= this.expiresAt;
  }

  public isValid(): boolean {
    return !this.isExpired();
  }

  public getRemainingTime(): number {
    return Math.max(0, this.expiresAt.getTime() - Date.now());
  }
}

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh'
}