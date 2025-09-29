import { LoginCommand } from '../commands/LoginCommand';
import { AuthResult } from '../results/AuthResult';
import { AuthRepository } from '../ports/AuthRepository';
import { SessionRepository } from '../ports/SessionRepository';
import { TokenService } from '../ports/TokenService';
import { CryptographyService } from '../ports/CryptographyService';
import { EventBus } from '../ports/EventBus';
import { AuditLogger } from '../ports/AuditLogger';

import { Email } from '../../domain/value-objects/Email';
import { AuthenticationAggregate } from '../../domain/aggregates/AuthenticationAggregate';
import { InvalidCredentialsError, AccountNotActiveError } from '../../domain/errors/AuthenticationError';

export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly tokenService: TokenService,
    private readonly cryptographyService: CryptographyService,
    private readonly eventBus: EventBus,
    private readonly auditLogger: AuditLogger
  ) {}

  async execute(command: LoginCommand): Promise<AuthResult> {
    try {
      const email = Email.create(command.email);
      const user = await this.authRepository.findByEmail(email);

      if (!user) {
        await this.auditLogger.logFailedLogin(command.email, 'User not found', {
          userAgent: command.userAgent,
          ipAddress: command.ipAddress
        });
        throw new InvalidCredentialsError();
      }

      if (!user.canAuthenticate()) {
        await this.auditLogger.logFailedLogin(command.email, 'Account not active', {
          userAgent: command.userAgent,
          ipAddress: command.ipAddress
        });
        throw new AccountNotActiveError();
      }

      // 2. Créer l'agrégat d'authentification
      const authAggregate = AuthenticationAggregate.create(user);

      // 3. Générer les tokens
      const tokenPayload = {
        userId: user.getId().getValue(),
        email: user.getEmail().getValue(),
        sessionId: '', // sera rempli après création session
      };

      const accessToken = await this.tokenService.generateAccessToken(tokenPayload);
      const refreshToken = await this.tokenService.generateRefreshToken(tokenPayload);

      // 4. Authentifier via l'agrégat
      authAggregate.authenticate(
        command.password,
        accessToken,
        refreshToken,
        command.userAgent,
        command.ipAddress
      );

      const session = authAggregate.getSession()!;

      // 5. Persister les changements
      await this.authRepository.update(user);
      await this.sessionRepository.save(session);

      // 6. Hasher les tokens pour la session côté client
      const hashedAccessToken = await this.cryptographyService.hashForSession(
        accessToken.getValue()
      );
      const hashedRefreshToken = await this.cryptographyService.hashForSession(
        refreshToken.getValue()
      );

      // 7. Publier les événements domaine
      const events = authAggregate.getDomainEvents();
      await this.eventBus.publishMany(events);
      authAggregate.clearDomainEvents();

      // 8. Audit log
      await this.auditLogger.logLogin(
        user.getId().getValue(),
        session.getId().getValue(),
        {
          userAgent: command.userAgent,
          ipAddress: command.ipAddress,
          rememberMe: command.rememberMe
        }
      );

      return new AuthResult(user, session, hashedAccessToken, hashedRefreshToken);

    } catch (error) {
      if (error instanceof InvalidCredentialsError || error instanceof AccountNotActiveError) {
        throw error;
      }
      
      await this.auditLogger.logFailedLogin(command.email, 'System error', {
        error: `${(error as Error).message}`,
        userAgent: command.userAgent,
        ipAddress: command.ipAddress
      });
      
      throw new Error('Authentication failed');
    }
  }
}