/**
 * Supervisor Service
 * Servicios para gestionar supervisores/cuentas de empresa
 */

import api from './api';

export interface Supervisor {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  company: number | null;
  company_name: string | null;
  employee_count: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateSupervisorData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  company: number;
  is_active?: boolean;
  role?: 'supervisor';
}

export interface UpdateSupervisorData {
  email?: string;
  first_name?: string;
  last_name?: string;
  company?: number;
  is_active?: boolean;
}

class SupervisorService {
  /**
   * Obtener lista de supervisores
   */
  async getSupervisors(): Promise<Supervisor[]> {
    try {
      const response = await api.get<Supervisor[] | { results: Supervisor[] }>('/auth/admin/supervisors/');
      // Manejar tanto respuesta directa como paginada
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      return data;
    } catch (error) {
      console.error('Error fetching supervisors:', error);
      throw error;
    }
  }

  /**
   * Obtener un supervisor por ID
   */
  async getSupervisorById(id: number): Promise<Supervisor> {
    try {
      const response = await api.get<Supervisor>(`/auth/admin/supervisors/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching supervisor ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear un supervisor
   */
  async createSupervisor(data: CreateSupervisorData): Promise<Supervisor> {
    try {
      const response = await api.post<Supervisor>('/auth/admin/supervisors/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating supervisor:', error);
      throw error;
    }
  }

  /**
   * Actualizar un supervisor
   */
  async updateSupervisor(id: number, data: UpdateSupervisorData): Promise<Supervisor> {
    try {
      const response = await api.patch<Supervisor>(`/auth/admin/supervisors/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating supervisor ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar/desactivar un supervisor
   */
  async deleteSupervisor(id: number): Promise<void> {
    try {
      await api.delete(`/auth/admin/supervisors/${id}/`);
    } catch (error) {
      console.error(`Error deleting supervisor ${id}:`, error);
      throw error;
    }
  }

  /**
   * Activar/desactivar un supervisor
   */
  async toggleSupervisorStatus(id: number, isActive: boolean): Promise<Supervisor> {
    return this.updateSupervisor(id, { is_active: isActive });
  }
}

export const supervisorService = new SupervisorService();
export default supervisorService;
