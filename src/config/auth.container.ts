import 'reflect-metadata';
import { Container } from 'inversify';

// Domain
import { AuthenticationAggregate } from '../features/auth/domain/aggregates/AuthenticationAggregate';

// Application Ports
import { AuthRepository } from '../features/auth/application/ports/AuthRepository';
import { SessionRepository } from '../features/auth/application/ports/SessionRepository';
import { TokenService } from '../features/auth/application/ports/TokenService';
import { CryptographyService } from '../features/auth/application/ports/CryptographyService';
import { EventBus } from '../features/auth/application/ports/EventBus';
import { AuditLogger } from '../features/auth/application/ports/AuditLogger';

// Application Use Cases
import { LoginUseCase } from '../features/auth/application/use-cases/LoginUseCase';
import { RegisterUseCase } from '../features/auth/application/use-cases/RegisterUseCase';
import { LogoutUseCase } from '../features/auth/application/use-cases/LogoutUseCase';
import { RefreshTokenUseCase } from '../features/auth/application/use-cases/RefreshTokenUseCase';
import { ValidateSessionUseCase } from '../features/auth/application/use-cases/ValidateSessionUseCase';

// Infrastructure Implementations
import { ApiAuthRepository } from '../features/auth/infrastructure/repositories/ApiAuthRepository';
import { ServerSessionRepository } from '../features/auth/infrastructure/repositories/ServerSessionRepository';
import { JwtTokenService } from '../features/auth/infrastructure/services/JwtTokenService';
import { CryptoHashService } from '../features/auth/infrastructure/services/CryptoHashService';
import { InMemoryEventBus } from '../features/auth/infrastructure/services/EventBusService';
import { ConsoleAuditLogger } from '../features/auth/infrastructure/services/AuditLoggerService';
import { AuthApiClient } from '../features/auth/infrastructure/api/auth-api.client';

// Presentation
import { AuthController, AuthControllerDependencies } from '../features/auth/presentation/controllers/AuthController';

// Symbols pour l'injection
export const TYPES = {
  // Repositories
  AuthRepository: Symbol.for('AuthRepository'),
  SessionRepository: Symbol.for('SessionRepository'),
  
  // Services
  TokenService: Symbol.for('TokenService'),
  CryptographyService: Symbol.for('CryptographyService'),
  EventBus: Symbol.for('EventBus'),
  AuditLogger: Symbol.for('AuditLogger'),
  AuthApiClient: Symbol.for('AuthApiClient'),
  
  // Use Cases
  LoginUseCase: Symbol.for('LoginUseCase'),
  RegisterUseCase: Symbol.for('RegisterUseCase'),
  LogoutUseCase: Symbol.for('LogoutUseCase'),
  RefreshTokenUseCase: Symbol.for('RefreshTokenUseCase'),
  ValidateSessionUseCase: Symbol.for('ValidateSessionUseCase'),
  
  // Controllers
  AuthController: Symbol.for('AuthController'),
} as const;

// Container configuration
export function createAuthContainer(): Container {
  const container = new Container();

  // Environment configuration
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const backendApiKey = process.env.BACKEND_API_KEY;

  // Infrastructure Services
  container.bind<AuthApiClient>(TYPES.AuthApiClient)
    .toDynamicValue(() => new AuthApiClient(backendUrl, backendApiKey))
    .inSingletonScope();

  container.bind<TokenService>(TYPES.TokenService)
    .to(JwtTokenService)
    .inSingletonScope();

  container.bind<CryptographyService>(TYPES.CryptographyService)
    .to(CryptoHashService)
    .inSingletonScope();

  container.bind<EventBus>(TYPES.EventBus)
    .to(InMemoryEventBus)
    .inSingletonScope();

  container.bind<AuditLogger>(TYPES.AuditLogger)
    .to(ConsoleAuditLogger)
    .inSingletonScope();

  // Repositories
  container.bind<AuthRepository>(TYPES.AuthRepository)
    .to(ApiAuthRepository)
    .inSingletonScope();

  container.bind<SessionRepository>(TYPES.SessionRepository)
    .to(ServerSessionRepository)
    .inSingletonScope();

  // Use Cases
  container.bind<LoginUseCase>(TYPES.LoginUseCase)
    .toDynamicValue((context) => {
      return new LoginUseCase(
        context.container.get<AuthRepository>(TYPES.AuthRepository),
        context.container.get<SessionRepository>(TYPES.SessionRepository),
        context.container.get<TokenService>(TYPES.TokenService),
        context.container.get<CryptographyService>(TYPES.CryptographyService),
        context.container.get<EventBus>(TYPES.EventBus),
        context.container.get<AuditLogger>(TYPES.AuditLogger)
      );
    })
    .inSingletonScope();

  container.bind<RegisterUseCase>(TYPES.RegisterUseCase)
    .toDynamicValue((context) => {
      return new RegisterUseCase(
        context.container.get<AuthRepository>(TYPES.AuthRepository),
        context.container.get<SessionRepository>(TYPES.SessionRepository),
        context.container.get<TokenService>(TYPES.TokenService),
        context.container.get<CryptographyService>(TYPES.CryptographyService),
        context.container.get<EventBus>(TYPES.EventBus),
        context.container.get<AuditLogger>(TYPES.AuditLogger)
      );
    })
    .inSingletonScope();

  container.bind<LogoutUseCase>(TYPES.LogoutUseCase)
    .toDynamicValue((context) => {
      return new LogoutUseCase(
        context.container.get<AuthRepository>(TYPES.AuthRepository),
        context.container.get<SessionRepository>(TYPES.SessionRepository),
        context.container.get<EventBus>(TYPES.EventBus),
        context.container.get<AuditLogger>(TYPES.AuditLogger)
      );
    })
    .inSingletonScope();

  container.bind<RefreshTokenUseCase>(TYPES.RefreshTokenUseCase)
    .toDynamicValue((context) => {
      return new RefreshTokenUseCase(
        context.container.get<SessionRepository>(TYPES.SessionRepository),
        context.container.get<TokenService>(TYPES.TokenService),
        context.container.get<CryptographyService>(TYPES.CryptographyService),
        context.container.get<EventBus>(TYPES.EventBus),
        context.container.get<AuditLogger>(TYPES.AuditLogger)
      );
    })
    .inSingletonScope();

  container.bind<ValidateSessionUseCase>(TYPES.ValidateSessionUseCase)
    .toDynamicValue((context) => {
      return new ValidateSessionUseCase(
        context.container.get<SessionRepository>(TYPES.SessionRepository),
        context.container.get<AuthRepository>(TYPES.AuthRepository)
      );
    })
    .inSingletonScope();

  // Controller
  container.bind<AuthController>(TYPES.AuthController)
    .toDynamicValue((context) => {
      const dependencies: AuthControllerDependencies = {
        loginUseCase: context.container.get<LoginUseCase>(TYPES.LoginUseCase),
        registerUseCase: context.container.get<RegisterUseCase>(TYPES.RegisterUseCase),
        logoutUseCase: context.container.get<LogoutUseCase>(TYPES.LogoutUseCase),
        refreshTokenUseCase: context.container.get<RefreshTokenUseCase>(TYPES.RefreshTokenUseCase),
        validateSessionUseCase: context.container.get<ValidateSessionUseCase>(TYPES.ValidateSessionUseCase),
      };
      
      return new AuthController(dependencies);
    })
    .inSingletonScope();

  return container;
}

// Singleton container instance
let containerInstance: Container | null = null;

export function getAuthContainer(): Container {
  if (!containerInstance) {
    containerInstance = createAuthContainer();
  }
  return containerInstance;
}

// Helper pour récupérer les dépendances du controller
export function getAuthControllerDependencies(): AuthControllerDependencies {
  const container = getAuthContainer();
  
  return {
    loginUseCase: container.get<LoginUseCase>(TYPES.LoginUseCase),
    registerUseCase: container.get<RegisterUseCase>(TYPES.RegisterUseCase),
    logoutUseCase: container.get<LogoutUseCase>(TYPES.LogoutUseCase),
    refreshTokenUseCase: container.get<RefreshTokenUseCase>(TYPES.RefreshTokenUseCase),
    validateSessionUseCase: container.get<ValidateSessionUseCase>(TYPES.ValidateSessionUseCase),
  };
}