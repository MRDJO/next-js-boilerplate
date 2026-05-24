export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthActionResult {
  code: number;
  message: string;
  requiresOtp?: boolean;
  otpSessionId?: string;
}

export interface AuthService {
  getAccessToken(): Promise<string | undefined>;
  getCurrentUser(): Promise<AuthUser | null>;
  login(username: string, password: string): Promise<AuthActionResult>;
  verifyOtp(otpSessionId: string, code: string): Promise<AuthActionResult>;
  logout(): Promise<void>;
}
