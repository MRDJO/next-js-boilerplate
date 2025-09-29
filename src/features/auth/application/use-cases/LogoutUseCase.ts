import { LogoutCommand } from '../commands/LogoutCommand';
import { AuditLogger } from '../ports/AuditLogger';
import { AuthRepository } from '../ports/AuthRepository';
import { EventBus } from '../ports/EventBus';
import { SessionRepository } from '../ports/SessionRepository';

export class LogoutUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly eventBus: EventBus,
    private readonly auditLogger: AuditLogger
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    // 1. Récupérer user et session
    const userId = UserId.create(command.userId);
    const sessionId = SessionId.create(command.sessionId);
    
    const user = await this.authRepository.findById(userId);
    const session = await this.sessionRepository.findById(sessionId);

    if (!user || !session) {
      return; // Déjà déconnecté
    }

    // 2. Créer agrégat et déconnecter
    const authAggregate = AuthenticationAggregate.create(user);
    authAggregate.logout(command.reason);

    // 3. Supprimer la session
    await this.sessionRepository.delete(sessionId);

    // 4. Publier événements
    const events = authAggregate.getDomainEvents();
    await this.eventBus.publishMany(events);

    // 5. Audit log
    await this.auditLogger.logLogout(
      command.userId,
      command.sessionId,
      command.reason
    );
  }
}