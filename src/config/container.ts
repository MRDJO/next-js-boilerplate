import { Container } from 'inversify';
import { AuthRepository } from '@/features/auth/application/ports/AuthRepository';
import { ApiAuthRepository } from '@/features/auth/infrastructure/repositories/ApiAuthRepository';
import { LoginUseCase } from '@/features/auth/application/use-cases/LoginUseCase';
import { AuthController } from '@/features/auth/presentation/controllers/AuthController';

const container = new Container();

container.bind<AuthRepository>('AuthRepository').to(ApiAuthRepository);

container.bind<LoginUseCase>('LoginUseCase').to(LoginUseCase);

container.bind<AuthController>('AuthController').to(AuthController);

export { container };