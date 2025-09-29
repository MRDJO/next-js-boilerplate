import { ValidateSessionQuerySchema } from './schemas/query.schema';

export class ValidateSessionQuery {
  public readonly sessionId: string;
  public readonly userId: string;

  private constructor(data: { sessionId: string; userId: string }) {
    this.sessionId = data.sessionId;
    this.userId = data.userId;
  }

  public static create(data: unknown): ValidateSessionQuery {
    const validated = ValidateSessionQuerySchema.parse(data);
    return new ValidateSessionQuery(validated);
  }
}