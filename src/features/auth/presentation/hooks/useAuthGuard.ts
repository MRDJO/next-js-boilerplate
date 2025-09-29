import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

export const useAuthGuard = (redirectTo: string = '/auth/login') => {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isInitialized, redirectTo, router]);

  return {
    isAuthenticated,
    isInitialized,
    isLoading: !isInitialized,
  };
};
