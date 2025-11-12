/**
 * Authentication Context
 * Context global para manejo de autenticación y estado de usuario
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services';
import type { User, LoginRequest } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar autenticación al cargar la app
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        
        if (currentUser && authService.isAuthenticated()) {
          // Verificar token con el servidor
          const freshUser = await authService.fetchCurrentUser();
          setUser(freshUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        authService.clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user as User);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const freshUser = await authService.fetchCurrentUser();
      setUser(freshUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      authService.clearTokens();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
