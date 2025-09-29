import { LoginCommand } from '../../application/commands/LoginCommand';
import { RegisterCommand } from '../../application/commands/RegisterCommand';
import { LogoutCommand } from '../../application/commands/LogoutCommand';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { RegisterUseCase } from '../../application/use-cases/RegisterUseCase';
import { LogoutUseCase } from '../../application/use-cases/LogoutUseCase';
import { RefreshTokenUseCase } from '../../application/use-cases/RefreshTokenUseCase';
import { ValidateSessionUseCase } from '../../application/use-cases/ValidateSessionUseCase';
import { useAuthStore } from '../stores/auth.store';
import { LoginFormData, RegisterFormData } from '../schemas/form-schemas';
import { ValidateSessionQuery } from '../../application/queries/ValidateSessionQuery';

export interface AuthControllerDependencies {
  loginUseCase: LoginUseCase;
  registerUseCase: RegisterUseCase;
  logoutUseCase: LogoutUseCase;
  refreshTokenUseCase: RefreshTokenUseCase;
  validateSessionUseCase: ValidateSessionUseCase;
}

export class AuthController {
  constructor(private readonly deps: AuthControllerDependencies) {}

  async login(formData: LoginFormData, metadata?: { userAgent?: string; ipAddress?: string }): Promise<{
    success: boolean;
    error?: string;
  }> {
    const { setLoading, setUser, setLoginError, incrementLoginAttempts } = useAuthStore.getState();

    try {
      setLoading(true);
      setLoginError(null);

      // Créer la commande avec validation Zod
      const command = LoginCommand.create({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
        userAgent: metadata?.userAgent || navigator.userAgent,
        ipAddress: metadata?.ipAddress,
      });

      // Exécuter le use case
      const result = await this.deps.loginUseCase.execute(command);
      
      // Mettre à jour le store avec les données utilisateur
      const userDTO = result.toDTO();
      setUser({...userDTO.user, createdAt: userDTO.user.createdAt}, userDTO.session.id);

      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setLoginError(errorMessage);
      incrementLoginAttempts();
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }

  async register(formData: RegisterFormData, metadata?: { userAgent?: string; ipAddress?: string }): Promise<{
    success: boolean;
    error?: string;
  }> {
    const { setLoading, setUser, setLoginError } = useAuthStore.getState();

    try {
      setLoading(true);
      setLoginError(null);

      const command = RegisterCommand.create({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userAgent: metadata?.userAgent || navigator.userAgent,
        ipAddress: metadata?.ipAddress,
      });

      const result = await this.deps.registerUseCase.execute(command);
      
      // Auto-login après inscription
      const userDTO = result.toDTO();
      setUser(userDTO.user, userDTO.session.id);

      return { success: true };

    } catch (error) {
      console.error('Register error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setLoginError(errorMessage);
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }

  async logout(reason: 'user_initiated' | 'session_expired' | 'security_violation' = 'user_initiated'): Promise<void> {
    const { user, sessionId, logout: clearStore } = useAuthStore.getState();

    try {
      if (user && sessionId) {
        const command = LogoutCommand.create({
          userId: user.id,
          sessionId: sessionId,
          reason: reason,
        });

        await this.deps.logoutUseCase.execute(command);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue avec le nettoyage local même en cas d'erreur
    } finally {
      // Toujours nettoyer le store local
      clearStore();
    }
  }

  async validateSession(): Promise<boolean> {
    const { user, sessionId, setUser, logout: clearStore, setInitialized } = useAuthStore.getState();

    try {
      if (!user || !sessionId) {
        setInitialized(true);
        return false;
      }

      const query = ValidateSessionQuery.create({
        userId: user.id,
        sessionId: sessionId,
      });

      const result = await this.deps.validateSessionUseCase.execute(query);

      if (result.isValid && result.user && result.session) {
        // Mettre à jour les données utilisateur si nécessaire
        const userDTO = {
          id: result.user.getId().getValue(),
          email: result.user.getEmail().getValue(),
          name: result.user.getName(),
          createdAt: result.user.getCreatedAt().toISOString(),
          lastLoginAt: result.user.getLastLoginAt()?.toISOString(),
        };
        setUser(userDTO, result.session.getId().getValue());
        setInitialized(true);
        return true;
      } else {
        clearStore();
        setInitialized(true);
        return false;
      }

    } catch (error) {
      console.error('Session validation error:', error);
      clearStore();
      setInitialized(true);
      return false;
    }
  }

  async refreshTokens(): Promise<boolean> {
    const { sessionId } = useAuthStore.getState();

    try {
      if (!sessionId) {
        return false;
      }

      // Le refresh se fait automatiquement côté serveur via NextSessionService
      // Ici on peut juste vérifier que tout est OK
      return await this.validateSession();

    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }
}