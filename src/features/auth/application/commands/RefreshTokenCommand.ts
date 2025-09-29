import { RefreshTokenCommandSchema } from './schemas/login-command.schema';


export class RefreshTokenCommand {
  public readonly refreshToken: string;
  public readonly sessionId: string;
  public readonly userAgent?: string;
  public readonly ipAddress?: string;

  private constructor(data: {
    refreshToken: string;
    sessionId: string;
    userAgent?: string;
    ipAddress?: string;
  }) {
    this.refreshToken = data.refreshToken;
    this.sessionId = data.sessionId;
    this.userAgent = data.userAgent;
    this.ipAddress = data.ipAddress;
  }

  public static create(data: unknown): RefreshTokenCommand {
    const validated = RefreshTokenCommandSchema.parse(data);
    return new RefreshTokenCommand(validated);
  }
}