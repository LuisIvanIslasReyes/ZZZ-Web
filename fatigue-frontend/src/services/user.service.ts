/**
 * User Service
 * Servicio para gestión de usuarios
 */

import api from './api';
import type { User, CreateUserData, UpdateUserData, ChangePasswordData } from '../types/user.types';
import type { PaginatedResponse } from '../types/api.types';

class UserService {
  private readonly BASE_PATH = '/users';

  /**
   * Obtener todos los usuarios (paginado)
   */
  async getUsers(params?: {
    page?: number;
    page_size?: number;
    role?: string;
    is_active?: boolean;
    search?: string;
  }): Promise<PaginatedResponse<User>> {
    const response = await api.get<PaginatedResponse<User>>(`${this.BASE_PATH}/`, { params });
    return response.data;
  }

  /**
   * Obtener usuario por ID
   */
  async getUser(id: number): Promise<User> {
    const response = await api.get<User>(`${this.BASE_PATH}/${id}/`);
    return response.data;
  }

  /**
   * Crear nuevo usuario
   */
  async createUser(userData: CreateUserData): Promise<User> {
    const response = await api.post<User>(`${this.BASE_PATH}/`, userData);
    return response.data;
  }

  /**
   * Actualizar usuario
   */
  async updateUser(id: number, userData: UpdateUserData): Promise<User> {
    const response = await api.patch<User>(`${this.BASE_PATH}/${id}/`, userData);
    return response.data;
  }

  /**
   * Eliminar usuario
   */
  async deleteUser(id: number): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}/`);
  }

  /**
   * Cambiar contraseña de usuario
   */
  async changeUserPassword(id: number, passwordData: ChangePasswordData): Promise<void> {
    await api.post(`${this.BASE_PATH}/${id}/change-password/`, passwordData);
  }

  /**
   * Activar/Desactivar usuario
   */
  async toggleUserStatus(id: number, isActive: boolean): Promise<User> {
    const response = await api.patch<User>(`${this.BASE_PATH}/${id}/`, { is_active: isActive });
    return response.data;
  }

  /**
   * Obtener empleados por departamento
   */
  async getUsersByDepartment(department: string): Promise<User[]> {
    const response = await api.get<PaginatedResponse<User>>(`${this.BASE_PATH}/`, {
      params: { department, page_size: 1000 }
    });
    return response.data.results;
  }

  /**
   * Obtener empleados por rol
   */
  async getUsersByRole(role: string): Promise<User[]> {
    const response = await api.get<PaginatedResponse<User>>(`${this.BASE_PATH}/`, {
      params: { role, page_size: 1000 }
    });
    return response.data.results;
  }
}

export default new UserService();
