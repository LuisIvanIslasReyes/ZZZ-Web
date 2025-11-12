/**
 * Recommendation Service
 * Servicio para gestión de recomendaciones de rutinas
 */

import api from './api';
import type { 
  RoutineRecommendation, 
  CreateRecommendationData, 
  UpdateRecommendationData,
  RecommendationFilters,
  RecommendationStats 
} from '../types/recommendation.types';
import type { PaginatedResponse } from '../types/api.types';

class RecommendationService {
  private readonly BASE_PATH = '/recommendations';

  /**
   * Obtener todas las recomendaciones (paginado)
   */
  async getRecommendations(filters?: RecommendationFilters & {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<RoutineRecommendation>> {
    const response = await api.get<PaginatedResponse<RoutineRecommendation>>(`${this.BASE_PATH}/`, {
      params: filters
    });
    return response.data;
  }

  /**
   * Obtener recomendación por ID
   */
  async getRecommendation(id: number): Promise<RoutineRecommendation> {
    const response = await api.get<RoutineRecommendation>(`${this.BASE_PATH}/${id}/`);
    return response.data;
  }

  /**
   * Crear nueva recomendación
   */
  async createRecommendation(data: CreateRecommendationData): Promise<RoutineRecommendation> {
    const response = await api.post<RoutineRecommendation>(`${this.BASE_PATH}/`, data);
    return response.data;
  }

  /**
   * Actualizar recomendación
   */
  async updateRecommendation(
    id: number, 
    data: UpdateRecommendationData
  ): Promise<RoutineRecommendation> {
    const response = await api.patch<RoutineRecommendation>(`${this.BASE_PATH}/${id}/`, data);
    return response.data;
  }

  /**
   * Eliminar recomendación
   */
  async deleteRecommendation(id: number): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}/`);
  }

  /**
   * Marcar recomendación como completada
   */
  async completeRecommendation(id: number): Promise<RoutineRecommendation> {
    const response = await api.post<RoutineRecommendation>(`${this.BASE_PATH}/${id}/complete/`);
    return response.data;
  }

  /**
   * Marcar recomendación como omitida
   */
  async skipRecommendation(id: number): Promise<RoutineRecommendation> {
    const response = await api.post<RoutineRecommendation>(`${this.BASE_PATH}/${id}/skip/`);
    return response.data;
  }

  /**
   * Iniciar recomendación
   */
  async startRecommendation(id: number): Promise<RoutineRecommendation> {
    const response = await api.post<RoutineRecommendation>(`${this.BASE_PATH}/${id}/start/`);
    return response.data;
  }

  /**
   * Obtener recomendaciones de un empleado
   */
  async getEmployeeRecommendations(
    employeeId: number,
    status?: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<RoutineRecommendation[]> {
    const response = await api.get<PaginatedResponse<RoutineRecommendation>>(`${this.BASE_PATH}/`, {
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
   * Obtener recomendaciones pendientes
   */
  async getPendingRecommendations(employeeId?: number): Promise<RoutineRecommendation[]> {
    const response = await api.get<PaginatedResponse<RoutineRecommendation>>(`${this.BASE_PATH}/`, {
      params: {
        employee: employeeId,
        status: 'pending',
        page_size: 1000,
        ordering: 'scheduled_for'
      }
    });
    return response.data.results;
  }

  /**
   * Obtener recomendaciones del día
   */
  async getTodayRecommendations(employeeId?: number): Promise<RoutineRecommendation[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const response = await api.get<PaginatedResponse<RoutineRecommendation>>(`${this.BASE_PATH}/`, {
      params: {
        employee: employeeId,
        date_from: today.toISOString(),
        date_to: tomorrow.toISOString(),
        page_size: 1000,
        ordering: 'scheduled_for'
      }
    });
    return response.data.results;
  }

  /**
   * Obtener estadísticas de recomendaciones
   */
  async getRecommendationStats(
    employeeId?: number,
    dateFrom?: string,
    dateTo?: string
  ): Promise<RecommendationStats> {
    const response = await api.get<RecommendationStats>(`${this.BASE_PATH}/stats/`, {
      params: {
        employee: employeeId,
        date_from: dateFrom,
        date_to: dateTo
      }
    });
    return response.data;
  }

  /**
   * Generar recomendaciones automáticas basadas en alerta
   */
  async generateRecommendationsFromAlert(alertId: number): Promise<RoutineRecommendation[]> {
    const response = await api.post<RoutineRecommendation[]>(
      `${this.BASE_PATH}/generate-from-alert/`,
      { alert_id: alertId }
    );
    return response.data;
  }
}

export default new RecommendationService();
