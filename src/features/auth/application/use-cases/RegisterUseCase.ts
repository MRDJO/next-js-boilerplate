import { AuthenticationAggregate } from '../../domain/aggregates/AuthenticationAggregate';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { RegisterCommand } from '../commands/RegisterCommand';
import { AuditLogger } from '../ports/AuditLogger';
import { AuthRepository } from '../ports/AuthRepository';
import { CryptographyService } from '../ports/CryptographyService';
import { EventBus } from '../ports/EventBus';
import { SessionRepository } from '../ports/SessionRepository';
import { TokenService } from '../ports/TokenService';
import { AuthResult } from '../results/AuthResult';

export class RegisterUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly tokenService: TokenService,
    private readonly cryptographyService: CryptographyService,
    private readonly eventBus: EventBus,
    private readonly auditLogger: AuditLogger
  ) {}

  async execute(command: RegisterCommand): Promise<AuthResult> {
    const email = Email.create(command.email);
    const existingUser = await this.authRepository.findByEmail(email);

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const user = User.create(command.email, command.password, command.name);

    await this.authRepository.save(user);

    const tokenPayload = {
      userId: user.getId().getValue(),
      email: user.getEmail().getValue(),
      sessionId: '',
    };

    const accessToken = await this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = await this.tokenService.generateRefreshToken(tokenPayload);

    const authAggregate = AuthenticationAggregate.create(user);
    authAggregate.authenticate(
      command.password,
      accessToken,
      refreshToken,
      command.userAgent,
      command.ipAddress
    );

    const session = authAggregate.getSession()!;
    await this.sessionRepository.save(session);

    const hashedAccessToken = await this.cryptographyService.hashForSession(
      accessToken.getValue()
    );
    const hashedRefreshToken = await this.cryptographyService.hashForSession(
      refreshToken.getValue()
    );

    const events = authAggregate.getDomainEvents();
    await this.eventBus.publishMany(events);

    return new AuthResult(user, session, hashedAccessToken, hashedRefreshToken);
  }
}