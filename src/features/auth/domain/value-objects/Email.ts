export class Email{
    constructor(private readonly value: string){
        this.validate();
    }

   public static create(email: string): Email {
    return new Email(email.toLowerCase().trim());
  }

  private validate(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
      throw new Error('Invalid email format');
    }
    
    if (this.value.length > 254) {
      throw new Error('Email too long');
    }
  }

  public getValue(): string {
    return this.value;
  }

  public getDomain(): string {
    return this.value.split('@')[1];
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}