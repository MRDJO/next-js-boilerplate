import z from 'zod';
import { BackendAuthResponseSchema, BackendErrorResponseSchema, RefreshTokenResponseSchema } from './schemas/auth-api.schema';

export interface BackendLoginRequest {
  email: string;
  password: string;
  userAgent?: string;
  ipAddress?: string;
  rememberMe?: boolean;
}

export interface BackendRegisterRequest {
  email: string;
  password: string;
  name: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface BackendRefreshRequest {
  refreshToken: string;
  sessionId: string;
}

export class AuthApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey?: string
  ) {}

  async login(request: BackendLoginRequest): Promise<BackendAuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'X-API-Key': this.apiKey })
      },
      body: JSON.stringify(request)
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = BackendErrorResponseSchema.parse(data);
      throw new AuthApiError(
        errorData.error.message,
        errorData.error.code,
        response.status,
        errorData.error.details
      );
    }

    return BackendAuthResponseSchema.parse(data);
  }

  async register(request: BackendRegisterRequest): Promise<BackendAuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'X-API-Key': this.apiKey })
      },
      body: JSON.stringify(request)
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = BackendErrorResponseSchema.parse(data);
      throw new AuthApiError(
        errorData.error.message,
        errorData.error.code,
        response.status,
        errorData.error.details
      );
    }

    return BackendAuthResponseSchema.parse(data);
  }

  async refreshToken(request: BackendRefreshRequest): Promise<RefreshTokenResponse> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'X-API-Key': this.apiKey })
      },
      body: JSON.stringify(request)
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = BackendErrorResponseSchema.parse(data);
      throw new AuthApiError(
        errorData.error.message,
        errorData.error.code,
        response.status,
        errorData.error.details
      );
    }

    return RefreshTokenResponseSchema.parse(data);
  }

  async logout(sessionId: string, accessToken: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...(this.apiKey && { 'X-API-Key': this.apiKey })
      },
      body: JSON.stringify({ sessionId })
    });

    if (!response.ok) {
      const data = await response.json();
      const errorData = BackendErrorResponseSchema.parse(data);
      throw new AuthApiError(
        errorData.error.message,
        errorData.error.code,
        response.status
      );
    }
  }

  async validateUser(userId: string, accessToken: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        ...(this.apiKey && { 'X-API-Key': this.apiKey })
      }
    });

    if (!response.ok) {
      throw new AuthApiError('Failed to validate user', 'USER_VALIDATION_FAILED', response.status);
    }

    return response.json();
  }
}

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

export type BackendAuthResponse = z.infer<typeof BackendAuthResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;