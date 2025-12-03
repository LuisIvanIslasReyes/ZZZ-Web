/**
 * Admin Users Service
 * Servicio para gestión de usuarios administradores
 * Solo accesible por superusuarios
 */

import api from './api';
import type { AdminUser, CreateAdminUserData, UpdateAdminUserData } from '../types';

const ADMIN_USERS_BASE_URL = '/admin/admin-users/';

/**
 * Obtener lista de usuarios administradores
 */
export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await api.get<AdminUser[]>(ADMIN_USERS_BASE_URL);
  return response.data;
}

/**
 * Obtener detalles de un usuario administrador
 */
export async function getAdminUser(id: number): Promise<AdminUser> {
  const response = await api.get<AdminUser>(`${ADMIN_USERS_BASE_URL}${id}/`);
  return response.data;
}

/**
 * Crear nuevo usuario administrador
 */
export async function createAdminUser(data: CreateAdminUserData): Promise<AdminUser> {
  const response = await api.post<AdminUser>(ADMIN_USERS_BASE_URL, data);
  return response.data;
}

/**
 * Actualizar usuario administrador
 */
export async function updateAdminUser(id: number, data: UpdateAdminUserData): Promise<AdminUser> {
  const response = await api.put<AdminUser>(`${ADMIN_USERS_BASE_URL}${id}/`, data);
  return response.data;
}

/**
 * Eliminar usuario administrador
 */
export async function deleteAdminUser(id: number): Promise<void> {
  await api.delete(`${ADMIN_USERS_BASE_URL}${id}/`);
}

// Exportar como objeto por defecto
const adminUsersService = {
  getAdminUsers,
  getAdminUser,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
};

export default adminUsersService;
