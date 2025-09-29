import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export const useSession = () => {
  const { user, sessionId, lastActivity, isAuthenticated, refreshSession } = useAuth();
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | null>(null);

  // Calculer le temps restant avant expiration (exemple)
  useEffect(() => {
    if (!isAuthenticated || !lastActivity) return;

    const checkExpiry = () => {
      const lastActivityTime = new Date(lastActivity).getTime();
      const now = Date.now();
      const sessionTimeout = 30 * 60 * 1000; // 30 minutes
      const remaining = sessionTimeout - (now - lastActivityTime);
      
      setTimeUntilExpiry(Math.max(0, remaining));
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, lastActivity]);

  // Auto-refresh si nécessaire
  useEffect(() => {
    if (timeUntilExpiry !== null && timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
      // Refresh 5 minutes avant expiration
      refreshSession();
    }
  }, [timeUntilExpiry, refreshSession]);

  return {
    user,
    sessionId,
    lastActivity,
    timeUntilExpiry,
    isSessionActive: timeUntilExpiry !== null && timeUntilExpiry > 0,
  };
};