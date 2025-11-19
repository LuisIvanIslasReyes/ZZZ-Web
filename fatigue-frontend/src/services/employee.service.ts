/**
 * Employee Service
 * Servicio para gestión de empleados
 */

import api from './api';
import type { Employee, CreateEmployeeData, UpdateEmployeeData } from '../types';

class EmployeeService {
  /**
   * Obtener todos los empleados
   */
  async getAllEmployees(): Promise<Employee[]> {
    try {
      console.log('🔍 Fetching employees from API...');
      const response = await api.get<Employee[] | { results: Employee[] }>('/supervisor/employees/');
      console.log('✅ API Response:', response);
      console.log('📊 Response Data:', response.data);
      console.log('📦 Data type:', typeof response.data);
      console.log('🔢 Is Array?', Array.isArray(response.data));
      
      // Manejar respuesta paginada o array directo
      let data: Employee[];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data && 'results' in response.data) {
        // Respuesta paginada
        console.log('📄 Paginated response detected');
        data = response.data.results;
      } else {
        console.warn('⚠️ Unexpected response format');
        data = [];
      }
      
      console.log('✨ Returning employees:', data.length, 'items');
      return data;
    } catch (error: any) {
      console.error('❌ Error fetching employees:', error);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      throw error;
    }
  }

  /**
   * Obtener un empleado por ID
   */
  async getEmployeeById(id: number): Promise<Employee> {
    const response = await api.get<Employee>(`/supervisor/employees/${id}/`);
    return response.data;
  }

  /**
   * Crear un nuevo empleado
   */
  async createEmployee(data: CreateEmployeeData): Promise<Employee> {
    const response = await api.post<Employee>('/supervisor/employees/', data);
    return response.data;
  }

  /**
   * Actualizar un empleado
   */
  async updateEmployee(id: number, data: UpdateEmployeeData): Promise<Employee> {
    const response = await api.patch<Employee>(`/supervisor/employees/${id}/`, data);
    return response.data;
  }

  /**
   * Eliminar un empleado
   */
  async deleteEmployee(id: number): Promise<void> {
    await api.delete(`/supervisor/employees/${id}/`);
  }

  /**
   * Activar/Desactivar un empleado
   */
  async toggleEmployeeStatus(id: number, isActive: boolean): Promise<Employee> {
    const response = await api.patch<Employee>(`/supervisor/employees/${id}/`, {
      is_active: isActive,
    });
    return response.data;
  }
}

export const employeeService = new EmployeeService();
