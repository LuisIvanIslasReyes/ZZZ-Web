/**
 * Alert Service
 * Servicio para gestión de alertas de fatiga
 */

import api from './api';
import type { 
  FatigueAlert, 
  CreateAlertData, 
  UpdateAlertData,
  AlertFilters,
  AlertStats 
} from '../types/alert.types';
import type { PaginatedResponse } from '../types/api.types';

class AlertService {
  private readonly BASE_PATH = '/alerts';

  /**
   * Obtener todas las alertas (paginado)
   */
  async getAlerts(filters?: AlertFilters & {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<FatigueAlert>> {
    const response = await api.get<PaginatedResponse<FatigueAlert>>(`${this.BASE_PATH}/`, {
      params: filters
    });
    return response.data;
  }

  /**
   * Obtener alerta por ID
   */
  async getAlert(id: number): Promise<FatigueAlert> {
    const response = await api.get<FatigueAlert>(`${this.BASE_PATH}/${id}/`);
    return response.data;
  }

  /**
   * Crear nueva alerta
   */
  async createAlert(alertData: CreateAlertData): Promise<FatigueAlert> {
    const response = await api.post<FatigueAlert>(`${this.BASE_PATH}/`, alertData);
    return response.data;
  }

  /**
   * Actualizar alerta
   */
  async updateAlert(id: number, alertData: UpdateAlertData): Promise<FatigueAlert> {
    const response = await api.patch<FatigueAlert>(`${this.BASE_PATH}/${id}/`, alertData);
    return response.data;
  }

  /**
   * Eliminar alerta
   */
  async deleteAlert(id: number): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}/`);
  }

  /**
   * Reconocer alerta
   */
  async acknowledgeAlert(id: number, userId?: number): Promise<FatigueAlert> {
    const response = await api.post<FatigueAlert>(`${this.BASE_PATH}/${id}/acknowledge/`, 
      userId ? { acknowledged_by: userId } : {}
    );
    return response.data;
  }

  /**
   * Resolver alerta
   */
  async resolveAlert(id: number): Promise<FatigueAlert> {
    const response = await api.post<FatigueAlert>(`${this.BASE_PATH}/${id}/resolve/`);
    return response.data;
  }

  /**
   * Descartar alerta
   */
  async dismissAlert(id: number): Promise<FatigueAlert> {
    const response = await api.post<FatigueAlert>(`${this.BASE_PATH}/${id}/dismiss/`);
    return response.data;
  }

  /**
   * Obtener alertas pendientes
   */
  async getPendingAlerts(): Promise<FatigueAlert[]> {
    const response = await api.get<PaginatedResponse<FatigueAlert>>(`${this.BASE_PATH}/`, {
      params: {
        status: 'pending',
        page_size: 1000,
        ordering: '-created_at'
      }
    });
    return response.data.results;
  }

  /**
   * Obtener alertas críticas
   */
  async getCriticalAlerts(): Promise<FatigueAlert[]> {
    const response = await api.get<PaginatedResponse<FatigueAlert>>(`${this.BASE_PATH}/`, {
      params: {
        severity: 'critical',
        status: 'pending',
        page_size: 1000,
        ordering: '-created_at'
      }
    });
    return response.data.results;
  }

  /**
   * Obtener alertas de un empleado
   */
  async getEmployeeAlerts(
    employeeId: number,
    status?: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<FatigueAlert[]> {
    const response = await api.get<PaginatedResponse<FatigueAlert>>(`${this.BASE_PATH}/`, {
      params: {
        employee: employeeId,
        status,
        date_from: dateFrom,
        date_to: dateTo,
        page_size: 1000,
        ordering: '-created_at'
      }
    });
    return response.data.results;
  }

  /**
   * Obtener estadísticas de alertas
   */
  async getAlertStats(dateFrom?: string, dateTo?: string): Promise<AlertStats> {
    const response = await api.get<AlertStats>(`${this.BASE_PATH}/stats/`, {
      params: {
        date_from: dateFrom,
        date_to: dateTo
      }
    });
    return response.data;
  }

  /**
   * Obtener conteo de alertas pendientes
   */
  async getPendingAlertsCount(): Promise<number> {
    const response = await api.get<PaginatedResponse<FatigueAlert>>(`${this.BASE_PATH}/`, {
      params: {
        status: 'pending',
        page_size: 1
      }
    });
    return response.data.count;
  }

  /**
   * Obtener todas las alertas (sin paginación)
   */
  async getAllAlerts(): Promise<FatigueAlert[]> {
    const response = await api.get<FatigueAlert[] | PaginatedResponse<FatigueAlert>>(`${this.BASE_PATH}/`, {
      params: {
        page_size: 1000,
        ordering: '-created_at'
      }
    });
    // Manejar respuesta paginada o array directo
    if (Array.isArray(response.data)) {
      return response.data;
    } else if ('results' in response.data) {
      return response.data.results;
    }
    return [];
  }

  /**
   * Obtener alertas recientes (últimas 24 horas)
   */
  async getRecentAlerts(hours: number = 24): Promise<FatigueAlert[]> {
    const dateFrom = new Date();
    dateFrom.setHours(dateFrom.getHours() - hours);

    const response = await api.get<PaginatedResponse<FatigueAlert>>(`${this.BASE_PATH}/`, {
      params: {
        date_from: dateFrom.toISOString(),
        page_size: 1000,
        ordering: '-created_at'
      }
    });
    return response.data.results || [];
  }
}

export default new AlertService();
