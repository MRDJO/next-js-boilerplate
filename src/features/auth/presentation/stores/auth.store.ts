import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface AuthState {
  // État authentification
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  user: UserDTO | null;
  sessionId: string | null;
  lastActivity: string | null;

  loginAttempts: number;
  lastLoginError: string | null;

  // Actions
  setUser: (user: UserDTO, sessionId: string) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setLoginError: (error: string | null) => void;
  incrementLoginAttempts: () => void;
  resetLoginAttempts: () => void;
  updateLastActivity: () => void;
  logout: () => void;
  reset: () => void;
}

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  user: null,
  sessionId: null,
  lastActivity: null,
  loginAttempts: 0,
  lastLoginError: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user: UserDTO, sessionId: string) => {
        set({
          user,
          sessionId,
          isAuthenticated: true,
          isLoading: false,
          lastActivity: new Date().toISOString(),
          loginAttempts: 0,
          lastLoginError: null,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setInitialized: (initialized: boolean) => {
        set({ isInitialized: initialized });
      },

      setLoginError: (error: string | null) => {
        set({ lastLoginError: error, isLoading: false });
      },

      incrementLoginAttempts: () => {
        set({ loginAttempts: get().loginAttempts + 1 });
      },

      resetLoginAttempts: () => {
        set({ loginAttempts: 0 });
      },

      updateLastActivity: () => {
        if (get().isAuthenticated) {
          set({ lastActivity: new Date().toISOString() });
        }
      },

      logout: () => {
        set({
          ...initialState,
          isInitialized: true, // Garde l'état initialisé
        });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'auth-store',
      // Persist seulement les données non-sensibles
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sessionId: state.sessionId,
        lastActivity: state.lastActivity,
        // PAS les tokens ou données sensibles !
      }),
    }
  )
);