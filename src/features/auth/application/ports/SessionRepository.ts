import { AuthSession } from '../../domain/entities/AuthSession';
import { SessionId } from '../../domain/value-objects/SessionId';
import { UserId } from '../../domain/value-objects/UserId';

export interface SessionRepository {
  findById(sessionId: SessionId): Promise<AuthSession | null>;
  findByUserId(userId: UserId): Promise<AuthSession[]>;
  save(session: AuthSession): Promise<void>;
  update(session: AuthSession): Promise<void>;
  delete(sessionId: SessionId): Promise<void>;
  deleteAllByUserId(userId: UserId): Promise<void>;
  cleanExpiredSessions(): Promise<void>;
}