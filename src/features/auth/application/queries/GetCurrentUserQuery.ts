import { GetCurrentUserQuerySchema } from './schemas/query.schema';

export class GetCurrentUserQuery {
  public readonly sessionId: string;

  private constructor(data: { sessionId: string }) {
    this.sessionId = data.sessionId;
  }

  public static create(data: unknown): GetCurrentUserQuery {
    const validated = GetCurrentUserQuerySchema.parse(data);
    return new GetCurrentUserQuery(validated);
  }
}
