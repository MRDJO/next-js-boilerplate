import { TokenService, TokenPayload } from '../../application/ports/TokenService';
import { Token, TokenType } from '../../domain/value-objects/Token';
import { SignJWT, jwtVerify } from 'jose';

export class JwtTokenService implements TokenService {
  private readonly secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-256-bit-secret'
  );

  async generateAccessToken(payload: TokenPayload): Promise<Token> {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresAt)
      .setSubject(payload.userId)
      .sign(this.secret);

    return Token.create(jwt, expiresAt, TokenType.ACCESS);
  }

  async generateRefreshToken(payload: TokenPayload): Promise<Token> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
    
    const jwt = await new SignJWT({ 
      userId: payload.userId, 
      sessionId: payload.sessionId,
      type: 'refresh'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresAt)
      .setSubject(payload.userId)
      .sign(this.secret);

    return Token.create(jwt, expiresAt, TokenType.REFRESH);
  }

  async verifyToken(tokenValue: string, expectedType: TokenType): Promise<TokenPayload> {
    try {
      const { payload } = await jwtVerify(tokenValue, this.secret);
      
      // Vérifier le type si c'est un refresh token
      if (expectedType === TokenType.REFRESH && payload.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return payload as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async extractPayload(tokenValue: string): Promise<TokenPayload> {
    const { payload } = await jwtVerify(tokenValue, this.secret);
    return payload as TokenPayload;
  }

  async isTokenExpired(tokenValue: string): Promise<boolean> {
    try {
      await jwtVerify(tokenValue, this.secret);
      return false;
    } catch (error) {
      return true;
    }
  }
}