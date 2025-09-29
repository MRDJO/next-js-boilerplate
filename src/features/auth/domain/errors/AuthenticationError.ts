export class AuthenticationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class InvalidCredentialsError extends AuthenticationError {
  constructor() {
    super('Invalid email or password', 'INVALID_CREDENTIALS');
  }
}

export class AccountNotActiveError extends AuthenticationError {
  constructor() {
    super('Account is not active', 'ACCOUNT_NOT_ACTIVE');
  }
}

export class SessionExpiredError extends AuthenticationError {
  constructor() {
    super('Session has expired', 'SESSION_EXPIRED');
  }
}

export class TokenExpiredError extends AuthenticationError {
  constructor() {
    super('Token has expired', 'TOKEN_EXPIRED');
  }
}

export class InvalidTokenError extends AuthenticationError {
  constructor() {
    super('Token is invalid', 'INVALID_TOKEN');
  }
}