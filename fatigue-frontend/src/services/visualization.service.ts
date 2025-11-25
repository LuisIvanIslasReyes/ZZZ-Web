/**
 * Visualization Service
 * Servicio para consumir endpoints de visualización y gráficas
 */

import api from './api';

export interface FatigueTrendDataPoint {
  date: string;
  hour?: number;
  avg_fatigue_index: number;
  max_fatigue_index: number;
  min_fatigue_index: number;
  avg_spo2: number;
  avg_heart_rate: number;
  total_readings: number;
  employees_monitored: number;
  alerts_generated: number;
}

export interface HourlyDistributionPoint {
  hour: number;
  avg_fatigue_index: number;
  total_readings: number;
}

export interface WeeklyDistributionPoint {
  day: number;
  day_name: string;
  avg_fatigue_index: number;
  total_readings: number;
}

export interface FatigueLevelDistribution {
  level: string;
  count: number;
  percentage: number;
}

export interface AlertHistoryPoint {
  date: string;
  total_alerts: number;
  high_severity: number;
  medium_severity: number;
  low_severity: number;
}

class VisualizationService {
  private readonly BASE_PATH = '/visualizations';

  /**
   * Obtener tendencias de fatiga en el tiempo
   */
  async getFatigueTrends(params?: {
    days?: number;
    interval?: 'hour' | 'day';
    employee_id?: number;
  }): Promise<FatigueTrendDataPoint[]> {
    const response = await api.get<FatigueTrendDataPoint[]>(
      `${this.BASE_PATH}/fatigue_trends/`,
      { params }
    );
    return response.data;
  }

  /**
   * Obtener distribución de fatiga por hora del día
   */
  async getHourlyDistribution(params?: {
    days?: number;
    employee_id?: number;
  }): Promise<HourlyDistributionPoint[]> {
    const response = await api.get<HourlyDistributionPoint[]>(
      `${this.BASE_PATH}/hourly_distribution/`,
      { params }
    );
    return response.data;
  }

  /**
   * Obtener distribución de fatiga por día de la semana
   */
  async getWeeklyDistribution(params?: {
    weeks?: number;
    employee_id?: number;
  }): Promise<WeeklyDistributionPoint[]> {
    const response = await api.get<WeeklyDistributionPoint[]>(
      `${this.BASE_PATH}/weekly_distribution/`,
      { params }
    );
    return response.data;
  }

  /**
   * Obtener distribución de niveles de fatiga
   */
  async getFatigueLevels(params?: {
    days?: number;
    employee_id?: number;
  }): Promise<FatigueLevelDistribution[]> {
    const response = await api.get<FatigueLevelDistribution[]>(
      `${this.BASE_PATH}/fatigue_levels/`,
      { params }
    );
    return response.data;
  }

  /**
   * Obtener historial de alertas
   */
  async getAlertHistory(params?: {
    days?: number;
    interval?: 'day' | 'week';
  }): Promise<AlertHistoryPoint[]> {
    const response = await api.get<AlertHistoryPoint[]>(
      `${this.BASE_PATH}/alert_history/`,
      { params }
    );
    return response.data;
  }

  /**
   * Obtener datos de heatmap de fatiga
   */
  async getHeatmapData(params?: {
    weeks?: number;
    employee_id?: number;
  }): Promise<any> {
    const response = await api.get(
      `${this.BASE_PATH}/heatmap_data/`,
      { params }
    );
    return response.data;
  }
}

export const visualizationService = new VisualizationService();
export default visualizationService;
