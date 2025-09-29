import bcrypt from 'bcryptjs';

export class Password {
  private constructor(
    private readonly hashedValue: string,
    private readonly isAlreadyHashed: boolean = false
  ) {}

  public static createFromPlain(plainPassword: string): Password {
    this.validatePlainPassword(plainPassword);
    const hashed = bcrypt.hashSync(plainPassword, 12);
    return new Password(hashed, true);
  }

  public static createFromHashed(hashedPassword: string): Password {
    return new Password(hashedPassword, true);
  }

  private static validatePlainPassword(password: string): void {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      throw new Error('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      throw new Error('Password must contain at least one number');
    }
  }

  public verify(plainPassword: string): boolean {
    if (!this.isAlreadyHashed) {
      throw new Error('Cannot verify unhashed password');
    }
    return bcrypt.compareSync(plainPassword, this.hashedValue);
  }

  public getHashedValue(): string {
    return this.hashedValue;
  }
}