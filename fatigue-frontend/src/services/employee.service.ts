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
    const response = await api.get<Employee[]>('/supervisor/employees/');
    return response.data;
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
