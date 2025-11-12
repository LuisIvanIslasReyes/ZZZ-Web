/**
 * Dashboard Service
 * Servicio para datos consolidados del dashboard
 */

import api from './api';
import type { 
  DashboardStats, 
  EmployeeMetricsSummary,
  TimeSeriesDataPoint 
} from '../types/api.types';

class DashboardService {
  private readonly BASE_PATH = '/dashboard';

  /**
   * Obtener estadísticas generales del dashboard
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>(`${this.BASE_PATH}/stats/`);
    return response.data;
  }

  /**
   * Obtener resumen de métricas de empleados
   */
  async getEmployeeMetricsSummary(params?: {
    department?: string;
    risk_level?: string;
    limit?: number;
  }): Promise<EmployeeMetricsSummary[]> {
    const response = await api.get<EmployeeMetricsSummary[]>(
      `${this.BASE_PATH}/employee-metrics-summary/`,
      { params }
    );
    return response.data;
  }

  /**
   * Obtener empleados de alto riesgo
   */
  async getHighRiskEmployees(): Promise<EmployeeMetricsSummary[]> {
    const response = await api.get<EmployeeMetricsSummary[]>(
      `${this.BASE_PATH}/employee-metrics-summary/`,
      {
        params: {
          risk_level: 'high,critical',
          limit: 100
        }
      }
    );
    return response.data;
  }

  /**
   * Obtener datos de serie temporal para gráficos
   */
  async getTimeSeriesData(params: {
    metric: 'fatigue' | 'heart_rate' | 'temperature' | 'alerts';
    employee_id?: number;
    department?: string;
    date_from?: string;
    date_to?: string;
    interval?: 'hour' | 'day' | 'week';
  }): Promise<TimeSeriesDataPoint[]> {
    const response = await api.get<TimeSeriesDataPoint[]>(
      `${this.BASE_PATH}/time-series/`,
      { params }
    );
    return response.data;
  }

  /**
   * Obtener tendencia de fatiga agregada
   */
  async getFatigueTrendAggregated(
    days: number = 7,
    department?: string
  ): Promise<TimeSeriesDataPoint[]> {
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    return this.getTimeSeriesData({
      metric: 'fatigue',
      department,
      date_from: dateFrom.toISOString(),
      date_to: dateTo.toISOString(),
      interval: 'day'
    });
  }

  /**
   * Obtener distribución de alertas por severidad
   */
  async getAlertDistribution(dateFrom?: string, dateTo?: string): Promise<{
    severity: string;
    count: number;
  }[]> {
    const response = await api.get(`${this.BASE_PATH}/alert-distribution/`, {
      params: {
        date_from: dateFrom,
        date_to: dateTo
      }
    });
    return response.data;
  }

  /**
   * Obtener actividad reciente (alertas y recomendaciones recientes)
   */
  async getRecentActivity(limit: number = 10): Promise<{
    alerts: Array<{
      id: number;
      employee_name: string;
      severity: string;
      message: string;
      created_at: string;
    }>;
    recommendations: Array<{
      id: number;
      employee_name: string;
      type: string;
      title: string;
      created_at: string;
    }>;
  }> {
    const response = await api.get(`${this.BASE_PATH}/recent-activity/`, {
      params: { limit }
    });
    return response.data;
  }

  /**
   * Obtener comparativa de departamentos
   */
  async getDepartmentComparison(): Promise<{
    department: string;
    avg_fatigue_score: number;
    total_alerts: number;
    employee_count: number;
  }[]> {
    const response = await api.get(`${this.BASE_PATH}/department-comparison/`);
    return response.data;
  }

  /**
   * Obtener estadísticas de dispositivos
   */
  async getDeviceStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    maintenance: number;
    low_battery: number;
    battery_distribution: { range: string; count: number }[];
  }> {
    const response = await api.get(`${this.BASE_PATH}/device-stats/`);
    return response.data;
  }

  /**
   * Exportar reporte en PDF
   */
  async exportReport(params: {
    type: 'daily' | 'weekly' | 'monthly';
    date_from: string;
    date_to: string;
    employee_id?: number;
    department?: string;
  }): Promise<Blob> {
    const response = await api.get(`${this.BASE_PATH}/export-report/`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  }
}

export default new DashboardService();
