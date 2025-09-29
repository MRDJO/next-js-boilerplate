import { AuthRepository } from '../../application/ports/AuthRepository';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { UserId } from '../../domain/value-objects/UserId';
import { AuthApiClient, AuthApiError, BackendAuthResponse } from '../api/auth-api.client';

export class ApiAuthRepository implements AuthRepository {
  constructor(private readonly apiClient: AuthApiClient) {}

  async findById(id: UserId): Promise<User | null> {
    try {
      // Note: Cette méthode pourrait nécessiter un token d'accès
      // Implémentation dépend de votre backend
      const userData = await this.apiClient.validateUser(id.getValue(), 'token');
      return this.mapToUser(userData);
    } catch (error) {
      if (error instanceof AuthApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async findByEmail(email: Email): Promise<User | null> {
    try {
      // Cette méthode serait utilisée pendant le login
      // L'authentification se fait via le login endpoint
      // Donc on ne peut pas vraiment "trouver" un user par email sans authentification
      throw new Error('findByEmail not implemented - use authenticate instead');
    } catch (error) {
      return null;
    }
  }

  async save(user: User): Promise<void> {
    // L'enregistrement se fait via l'endpoint register
    throw new Error('save not implemented - use register endpoint instead');
  }

  async update(user: User): Promise<void> {
    // Mise à jour via API backend si nécessaire
    // Implémentation dépend des besoins
    console.log('User update logged locally');
  }

  async delete(id: UserId): Promise<void> {
    throw new Error('delete not implemented');
  }

  async emailExists(email: Email): Promise<boolean> {
    // Cette vérification pourrait se faire côté backend
    // ou être intégrée à l'endpoint register
    return false;
  }

  // Helper pour authentification
  async authenticate(email: Email, password: string, userAgent?: string, ipAddress?: string): Promise<BackendAuthResponse> {
    return await this.apiClient.login({
      email: email.getValue(),
      password,
      userAgent,
      ipAddress
    });
  }

  private mapToUser(userData: any): User {
    return User.reconstitute(
      userData.id,
      userData.email,
      userData.hashedPassword || '', // Pas exposé par l'API normalement
      userData.name,
      new Date(userData.createdAt),
      userData.lastLoginAt ? new Date(userData.lastLoginAt) : undefined,
      userData.isActive
    );
  }
}