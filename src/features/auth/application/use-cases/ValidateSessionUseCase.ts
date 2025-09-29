import { AuthSession } from '../../domain/entities/AuthSession';
import { User } from '../../domain/entities/User';
import { SessionId } from '../../domain/value-objects/SessionId';
import { UserId } from '../../domain/value-objects/UserId';
import { AuthRepository } from '../ports/AuthRepository';
import { SessionRepository } from '../ports/SessionRepository';
import { ValidateSessionQuery } from '../queries/ValidateSessionQuery';

export class ValidateSessionUseCase {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly authRepository: AuthRepository
  ) {}

  async execute(query: ValidateSessionQuery): Promise<{ isValid: boolean; user?: User; session?: AuthSession }> {
    const sessionId = SessionId.create(query.sessionId);
    const userId = UserId.create(query.userId);

    const session = await this.sessionRepository.findById(sessionId);

    if (!session || !session.getUserId().equals(userId)) {
      return { isValid: false };
    }

    if (!session.isValid()) {
      await this.sessionRepository.delete(sessionId);
      return { isValid: false };
    }

    const user = await this.authRepository.findById(userId);

    if (!user || !user.canAuthenticate()) {
      await this.sessionRepository.delete(sessionId);
      return { isValid: false };
    }

    // Mettre à jour l'activité
    session.updateActivity();
    await this.sessionRepository.update(session);

    return { isValid: true, user, session };
  }
}