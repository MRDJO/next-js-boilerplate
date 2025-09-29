import { LoginCommandSchema } from './schemas/login-command.schema';

export class LoginCommand {
  public readonly email: string;
  public readonly password: string;
  public readonly userAgent?: string;
  public readonly ipAddress?: string;
  public readonly rememberMe: boolean;

  private constructor(data: {
    email: string;
    password: string;
    userAgent?: string;
    ipAddress?: string;
    rememberMe?: boolean;
  }) {
    this.email = data.email;
    this.password = data.password;
    this.userAgent = data.userAgent;
    this.ipAddress = data.ipAddress;
    this.rememberMe = data.rememberMe ?? false;
  }

  public static create(data: unknown): LoginCommand {
    const validated = LoginCommandSchema.parse(data);
    return new LoginCommand(validated);
  }
}