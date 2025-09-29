export interface AuditEntry {
  userId?: string;
  sessionId?: string;
  action: string;
  resource: string;
  metadata?: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
  timestamp: Date;
}

export interface AuditLogger {
  log(entry: AuditEntry): Promise<void>;
  logLogin(userId: string, sessionId: string, metadata?: Record<string, any>): Promise<void>;
  logLogout(userId: string, sessionId: string, reason: string): Promise<void>;
  logFailedLogin(email: string, reason: string, metadata?: Record<string, any>): Promise<void>;
}