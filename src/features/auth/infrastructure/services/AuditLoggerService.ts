import { AuditLogger, AuditEntry } from '../../application/ports/AuditLogger';

export class ConsoleAuditLogger implements AuditLogger {
  async log(entry: AuditEntry): Promise<void> {
    console.log('🔍 AUDIT LOG:', {
      timestamp: entry.timestamp.toISOString(),
      userId: entry.userId,
      sessionId: entry.sessionId,
      action: entry.action,
      resource: entry.resource,
      userAgent: entry.userAgent,
      ipAddress: entry.ipAddress,
      metadata: entry.metadata
    });
    
    // En production, vous enverriez cela vers un service d'audit
    // comme LogFlare, DataDog, ou votre propre système de logs
  }

  async logLogin(userId: string, sessionId: string, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      userId,
      sessionId,
      action: 'LOGIN',
      resource: 'AUTH',
      metadata,
      timestamp: new Date()
    });
  }

  async logLogout(userId: string, sessionId: string, reason: string): Promise<void> {
    await this.log({
      userId,
      sessionId,
      action: 'LOGOUT',
      resource: 'AUTH',
      metadata: { reason },
      timestamp: new Date()
    });
  }

  async logFailedLogin(email: string, reason: string, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      action: 'LOGIN_FAILED',
      resource: 'AUTH',
      metadata: { email, reason, ...metadata },
      timestamp: new Date()
    });
  }
}