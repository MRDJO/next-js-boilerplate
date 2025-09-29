import { LogoutCommandSchema } from './schemas/login-command.schema';
import { LogoutReason } from '../../domain/events/UserLoggedOutEvent';

export class LogoutCommand {
  public readonly sessionId: string;
  public readonly userId: string;
  public readonly reason: LogoutReason;

  private constructor(data: {
    sessionId: string;
    userId: string;
    reason: LogoutReason;
  }) {
    this.sessionId = data.sessionId;
    this.userId = data.userId;
    this.reason = data.reason;
  }

  public static create(data: unknown): LogoutCommand {
    const validated = LogoutCommandSchema.parse(data);
    return new LogoutCommand({
      sessionId: validated.sessionId,
      userId: validated.userId,
      reason: validated.reason as LogoutReason
    });
  }
}