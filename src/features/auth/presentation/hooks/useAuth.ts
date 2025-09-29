import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { AuthController } from '../controllers/AuthController';
import { LoginFormData, RegisterFormData } from '../schemas/form-schemas';

let authController: AuthController;

export const setAuthController = (controller: AuthController) => {
  authController = controller;
};

export const useAuth = () => {
  const {
    isAuthenticated,
    isLoading,
    isInitialized,
    user,
    sessionId,
    lastActivity,
    loginAttempts,
    lastLoginError,
    updateLastActivity,
  } = useAuthStore();

  // Initialiser la session au premier chargement
  useEffect(() => {
    if (!isInitialized && authController) {
      authController.validateSession();
    }
  }, [isInitialized]);

  // Mettre à jour l'activité périodiquement
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      updateLastActivity();
    }, 60000); // Toutes les minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, updateLastActivity]);

  const login = useCallback(async (formData: LoginFormData) => {
    if (!authController) {
      throw new Error('AuthController not initialized');
    }
    return await authController.login(formData);
  }, []);

  const register = useCallback(async (formData: RegisterFormData) => {
    if (!authController) {
      throw new Error('AuthController not initialized');
    }
    return await authController.register(formData);
  }, []);

  const logout = useCallback(async () => {
    if (!authController) {
      throw new Error('AuthController not initialized');
    }
    await authController.logout();
  }, []);

  const refreshSession = useCallback(async () => {
    if (!authController) {
      return false;
    }
    return await authController.refreshTokens();
  }, []);

  return {
    // État
    isAuthenticated,
    isLoading,
    isInitialized,
    user,
    sessionId,
    lastActivity,
    loginAttempts,
    lastLoginError,
    
    // Actions
    login,
    register,
    logout,
    refreshSession,
    
    // Utilitaires
    canRetryLogin: loginAttempts < 5,
    needsRefresh: false, // Sera calculé si nécessaire
  };
};