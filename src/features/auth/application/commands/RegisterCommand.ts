import { RegisterCommandSchema } from './schemas/login-command.schema';

export class RegisterCommand {
  public readonly email: string;
  public readonly password: string;
  public readonly name: string;
  public readonly userAgent?: string;
  public readonly ipAddress?: string;

  private constructor(data: {
    email: string;
    password: string;
    name: string;
    userAgent?: string;
    ipAddress?: string;
  }) {
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.userAgent = data.userAgent;
    this.ipAddress = data.ipAddress;
  }

  public static create(data: unknown): RegisterCommand {
    const validated = RegisterCommandSchema.parse(data);
    return new RegisterCommand(validated);
  }
}
