import { UserId } from '../value-objects/UserId';
import { Email } from '../value-objects/Email';
import { Password } from '../value-objects/Password';

export class User {
  constructor(
    private readonly id: UserId,
    private email: Email,
    private password: Password,
    private readonly name: string,
    private readonly createdAt: Date,
    private lastLoginAt?: Date,
    private readonly isActive: boolean = true
  ) {}

  public static create(email: string, plainPassword: string, name: string): User {
    return new User(
      UserId.generate(),
      Email.create(email),
      Password.createFromPlain(plainPassword),
      name,
      new Date()
    );
  }

  public static reconstitute(
    id: string,
    email: string,
    hashedPassword: string,
    name: string,
    createdAt: Date,
    lastLoginAt?: Date,
    isActive: boolean = true
  ): User {
    return new User(
      UserId.create(id),
      Email.create(email),
      Password.createFromHashed(hashedPassword),
      name,
      createdAt,
      lastLoginAt,
      isActive
    );
  }

  // Business methods
  public verifyPassword(plainPassword: string): boolean {
    return this.password.verify(plainPassword);
  }

  public changeEmail(newEmail: string): void {
    const email = Email.create(newEmail);
    this.email = email;
  }

  public changePassword(currentPassword: string, newPassword: string): void {
    if (!this.verifyPassword(currentPassword)) {
      throw new Error('Current password is incorrect');
    }
    
    this.password = Password.createFromPlain(newPassword);
  }

  public recordLogin(): void {
    this.lastLoginAt = new Date();
  }

  public canAuthenticate(): boolean {
    return this.isActive;
  }

  // Getters
  public getId(): UserId {
    return this.id;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getName(): string {
    return this.name;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getLastLoginAt(): Date | undefined {
    return this.lastLoginAt;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getHashedPassword(): string {
    return this.password.getHashedValue();
  }
}