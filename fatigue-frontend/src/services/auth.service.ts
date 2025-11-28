/**
 * Authentication Service
 * Servicio para manejo de autenticación y gestión de tokens
 */

import api from './api';
import type { LoginRequest, LoginResponse, RefreshTokenResponse } from '../types/api.types';
import type { User } from '../types/user.types';

class AuthService {
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // El backend espera 'email' y 'password' directamente
    const loginData = {
      email: credentials.email,
      password: credentials.password
    };
    
    const response = await api.post<LoginResponse>('/auth/login/', loginData);
    
    if (response.data.access && response.data.refresh) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.clearTokens();
    }
  }

  /**
   * Refrescar token de acceso
   */
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<RefreshTokenResponse>('/auth/refresh/', {
      refresh: refreshToken,
    });

    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }
    }

    return response.data.access;
  }

  /**
   * Obtener usuario actual desde localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
      return null;
    }

    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }

  /**
   * Obtener usuario actual desde el servidor
   */
  async fetchCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me/');
    
    localStorage.setItem('user', JSON.stringify(response.data));
    
    return response.data;
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    
    return Boolean(token && user);
  }

  /**
   * Obtener token de acceso
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Obtener token de refresh
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Limpiar tokens y datos de usuario
   */
  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  }

  /**
   * Solicitar restablecimiento de contraseña
   */
  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/password-reset/', { email });
  }

  /**
   * Confirmar restablecimiento de contraseña
   */
  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/password-reset/confirm/', {
      token,
      new_password: newPassword,
    });
  }
}

export default new AuthService();
