/**
 * Metrics Service
 * Servicio para gestión de métricas y datos de sensores
 */

import api from './api';
import type { 
  SensorData, 
  ProcessedMetrics, 
  MetricsFilters,
  MetricsStats 
} from '../types/metrics.types';
import type { PaginatedResponse } from '../types/api.types';

class MetricsService {
  private readonly SENSOR_PATH = '/sensor-data';
  private readonly METRICS_PATH = '/processed-metrics';

  /**
   * Obtener datos de sensores (paginado)
   */
  async getSensorData(params?: {
    page?: number;
    page_size?: number;
    device?: number;
    employee?: number;
    date_from?: string;
    date_to?: string;
  }): Promise<PaginatedResponse<SensorData>> {
    const response = await api.get<PaginatedResponse<SensorData>>(`${this.SENSOR_PATH}/`, { params });
    return response.data;
  }

  /**
   * Obtener métricas procesadas (paginado)
   */
  async getProcessedMetrics(filters?: MetricsFilters): Promise<PaginatedResponse<ProcessedMetrics>> {
    const response = await api.get<PaginatedResponse<ProcessedMetrics>>(`${this.METRICS_PATH}/`, {
      params: filters
    });
    return response.data;
  }

  /**
   * Obtener métrica procesada por ID
   */
  async getMetric(id: number): Promise<ProcessedMetrics> {
    const response = await api.get<ProcessedMetrics>(`${this.METRICS_PATH}/${id}/`);
    return response.data;
  }

  /**
   * Obtener métricas de un empleado
   */
  async getEmployeeMetrics(
    employeeId: number, 
    dateFrom?: string, 
    dateTo?: string
  ): Promise<ProcessedMetrics[]> {
    const response = await api.get<PaginatedResponse<ProcessedMetrics>>(`${this.METRICS_PATH}/`, {
      params: {
        employee: employeeId,
        date_from: dateFrom,
        date_to: dateTo,
        page_size: 1000
      }
    });
    return response.data.results;
  }

  /**
   * Obtener última métrica de un empleado
   */
  async getLatestEmployeeMetric(employeeId: number): Promise<ProcessedMetrics | null> {
    const response = await api.get<PaginatedResponse<ProcessedMetrics>>(`${this.METRICS_PATH}/`, {
      params: {
        employee: employeeId,
        page_size: 1,
        ordering: '-timestamp'
      }
    });
    return response.data.results[0] || null;
  }

  /**
   * Obtener estadísticas de métricas
   */
  async getMetricsStats(filters?: MetricsFilters): Promise<MetricsStats> {
    const response = await api.get<MetricsStats>(`${this.METRICS_PATH}/stats/`, {
      params: filters
    });
    return response.data;
  }

  /**
   * Obtener métricas por dispositivo
   */
  async getDeviceMetrics(
    deviceId: number,
    dateFrom?: string,
    dateTo?: string
  ): Promise<ProcessedMetrics[]> {
    const response = await api.get<PaginatedResponse<ProcessedMetrics>>(`${this.METRICS_PATH}/`, {
      params: {
        device: deviceId,
        date_from: dateFrom,
        date_to: dateTo,
        page_size: 1000
      }
    });
    return response.data.results;
  }

  /**
   * Obtener datos de sensores en tiempo real (últimos n registros)
   */
  async getRealtimeSensorData(limit: number = 50): Promise<SensorData[]> {
    const response = await api.get<PaginatedResponse<SensorData>>(`${this.SENSOR_PATH}/`, {
      params: {
        page_size: limit,
        ordering: '-timestamp'
      }
    });
    return response.data.results;
  }

  /**
   * Obtener tendencia de fatiga (datos históricos para gráficos)
   */
  async getFatigueTrend(
    employeeId: number,
    days: number = 7
  ): Promise<{ timestamp: string; fatigue_score: number }[]> {
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const response = await api.get<PaginatedResponse<ProcessedMetrics>>(`${this.METRICS_PATH}/`, {
      params: {
        employee: employeeId,
        date_from: dateFrom.toISOString(),
        date_to: dateTo.toISOString(),
        page_size: 1000,
        ordering: 'timestamp'
      }
    });

    return response.data.results.map(m => ({
      timestamp: m.timestamp,
      fatigue_score: m.fatigue_score
    }));
  }
}

export default new MetricsService();
