/**
 * Break Service
 * Servicio para gestión de descansos programados
 */

import api from './api';
import type { 
  ScheduledBreak, 
  CreateBreakPayload, 
  ReviewBreakPayload, 
  UpdateBreakStatusPayload 
} from '../types/break.types';

const BASE_URL = '/scheduled-breaks';

export const breakService = {
  // ==================== ENDPOINTS EMPLEADO ====================

  /**
   * Programar un nuevo descanso
   */
  async scheduleBreak(payload: CreateBreakPayload): Promise<ScheduledBreak> {
    const response = await api.post<ScheduledBreak>(`${BASE_URL}/`, payload);
    return response.data;
  },

  /**
   * Obtener mis descansos programados
   */
  async getMyBreaks(): Promise<ScheduledBreak[]> {
    const response = await api.get<ScheduledBreak[]>(`${BASE_URL}/my-breaks/`);
    return response.data;
  },

  /**
   * Cancelar un descanso
   */
  async cancelBreak(breakId: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`${BASE_URL}/${breakId}/`);
    return response.data;
  },

  /**
   * Actualizar estado de un descanso (completado/cancelado)
   */
  async updateBreakStatus(breakId: number, payload: UpdateBreakStatusPayload): Promise<ScheduledBreak> {
    const response = await api.post<ScheduledBreak>(`${BASE_URL}/${breakId}/update-status/`, payload);
    return response.data;
  },

  // ==================== ENDPOINTS SUPERVISOR ====================

  /**
   * Ver descansos pendientes de aprobación
   */
  async getPendingBreaks(): Promise<ScheduledBreak[]> {
    const response = await api.get<ScheduledBreak[]>(`${BASE_URL}/pending/`);
    return response.data;
  },

  /**
   * Aprobar o rechazar un descanso
   */
  async reviewBreak(breakId: number, payload: ReviewBreakPayload): Promise<{ message: string; break: ScheduledBreak }> {
    const response = await api.post<{ message: string; break: ScheduledBreak }>(`${BASE_URL}/${breakId}/review/`, payload);
    return response.data;
  },

  /**
   * Ver todos los descansos de hoy
   */
  async getTodayBreaks(): Promise<ScheduledBreak[]> {
    const response = await api.get<ScheduledBreak[]>(`${BASE_URL}/today/`);
    return response.data;
  },

  /**
   * Ver descansos próximos (7 días)
   */
  async getUpcomingBreaks(): Promise<ScheduledBreak[]> {
    const response = await api.get<ScheduledBreak[]>(`${BASE_URL}/upcoming/`);
    return response.data;
  },

  /**
   * Ver historial de descansos aprobados
   */
  async getApprovedBreaks(): Promise<ScheduledBreak[]> {
    const response = await api.get<ScheduledBreak[]>(`${BASE_URL}/?status=approved`);
    return response.data;
  },

  /**
   * Ver historial de descansos rechazados
   */
  async getRejectedBreaks(): Promise<ScheduledBreak[]> {
    const response = await api.get<ScheduledBreak[]>(`${BASE_URL}/?status=rejected`);
    return response.data;
  },
};

export default breakService;
