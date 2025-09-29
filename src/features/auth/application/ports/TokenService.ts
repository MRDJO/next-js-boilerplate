import { Token, TokenType } from '../../domain/value-objects/Token';

export interface TokenPayload {
  userId: string;
  email: string;
  sessionId: string;
  [key: string]: any;
}

export interface TokenService {
  generateAccessToken(payload: TokenPayload): Promise<Token>;
  generateRefreshToken(payload: TokenPayload): Promise<Token>;
  verifyToken(tokenValue: string, expectedType: TokenType): Promise<TokenPayload>;
  extractPayload(tokenValue: string): Promise<TokenPayload>;
  isTokenExpired(tokenValue: string): Promise<boolean>;
}