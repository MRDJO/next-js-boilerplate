'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { AuthController, AuthControllerDependencies } from '../../controllers/AuthController';
import { setAuthController } from '../../hooks/useAuth';
interface AuthProviderProps {
  children: ReactNode;
  dependencies: AuthControllerDependencies;
}

const AuthContext = createContext<AuthController | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, dependencies }) => {
  const controller = new AuthController(dependencies);

  useEffect(() => {
    setAuthController(controller);
  }, [controller]);

  return (
    <AuthContext.Provider value={controller}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};