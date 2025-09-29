import { SessionExpiredError, TokenExpiredError } from '../../domain/errors/AuthenticationError';
import { SessionId } from '../../domain/value-objects/SessionId';
import { TokenType } from '../../domain/value-objects/Token';
import { RefreshTokenCommand } from '../commands/RefreshTokenCommand';
import { AuditLogger } from '../ports/AuditLogger';
import { CryptographyService } from '../ports/CryptographyService';
import { EventBus } from '../ports/EventBus';
import { SessionRepository } from '../ports/SessionRepository';
import { TokenService } from '../ports/TokenService';
import { AuthResult } from '../results/AuthResult';

export class RefreshTokenUseCase {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly tokenService: TokenService,
    private readonly cryptographyService: CryptographyService,
    private readonly eventBus: EventBus,
    private readonly auditLogger: AuditLogger
  ) {}

  async execute(command: RefreshTokenCommand): Promise<AuthResult> {
    // 1. Récupérer la session
    const sessionId = SessionId.create(command.sessionId);
    const session = await this.sessionRepository.findById(sessionId);

    if (!session) {
      throw new SessionExpiredError();
    }

    if (!session.canRefresh()) {
      throw new TokenExpiredError();
    }

    // 2. Vérifier le refresh token
    await this.tokenService.verifyToken(command.refreshToken, TokenType.REFRESH);

    // 3. Générer nouveaux tokens
    const tokenPayload = {
      userId: session.getUserId().getValue(),
      email: '', // sera récupéré du user si nécessaire
      sessionId: session.getId().getValue(),
    };

    const newAccessToken = await this.tokenService.generateAccessToken(tokenPayload);
    const newRefreshToken = await this.tokenService.generateRefreshToken(tokenPayload);

    // 4. Mettre à jour la session
    session.refreshTokens(newAccessToken, newRefreshToken);
    await this.sessionRepository.update(session);

    // 5. Hasher les nouveaux tokens
    const hashedAccessToken = await this.cryptographyService.hashForSession(
      newAccessToken.getValue()
    );
    const hashedRefreshToken = await this.cryptographyService.hashForSession(
      newRefreshToken.getValue()
    );

    // 6. Récupérer le user pour le résultat (si nécessaire pour votre implémentation)
    const user = await this.authRepository.findById(session.getUserId());

    return new AuthResult(user!, session, hashedAccessToken, hashedRefreshToken);
  }
}