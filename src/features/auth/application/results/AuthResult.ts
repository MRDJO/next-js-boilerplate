import { User } from '../../domain/entities/User';
import { AuthSession } from '../../domain/entities/AuthSession';

export class AuthResult {
  constructor(
    public readonly user: User,
    public readonly session: AuthSession,
    public readonly hashedAccessToken: string,
    public readonly hashedRefreshToken: string
  ) {}

  public toDTO() {
    return {
      user: {
        id: this.user.getId().getValue(),
        email: this.user.getEmail().getValue(),
        name: this.user.getName(),
        createdAt: this.user.getCreatedAt(),
        lastLoginAt: this.user.getLastLoginAt()
      },
      session: {
        id: this.session.getId().getValue(),
        createdAt: this.session.getCreatedAt(),
        lastActivityAt: this.session.getLastActivityAt(),
        expiresAt: this.session.getAccessToken().getExpiresAt()
      },
      tokens: {
        accessToken: this.hashedAccessToken,
        refreshToken: this.hashedRefreshToken,
        expiresAt: this.session.getAccessToken().getExpiresAt()
      }
    };
  }
}
