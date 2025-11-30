/**
 * Supervisor Dashboard Service
 * Servicio para endpoints del dashboard del supervisor
 */

import api from './api';

// ==================== INTERFACES ====================

export interface TeamStats {
  total_employees: number;
  employees_with_device: number;
  active_alerts: number;
  avg_fatigue: number;
  employees_at_risk: number;
  team_status: 'stable' | 'attention' | 'critical';
}

export interface FatigueTrendData {
  date: string;
  avg_fatigue: number;
  max_fatigue: number;
  min_fatigue: number;
}

export interface FatigueTrends {
  period: string;
  start_date: string;
  end_date: string;
  data: FatigueTrendData[];
}

export interface EmployeeRiskInfo {
  id: number;
  name: string;
  email: string;
  fatigue: number;
  timestamp: string;
}

export interface RiskCategory {
  count: number;
  percentage: number;
  employees: EmployeeRiskInfo[];
}

export interface RiskDistribution {
  total_employees: number;
  employees_monitored: number;
  distribution: {
    normal: RiskCategory;
    attention: RiskCategory;
    high_risk: RiskCategory;
  };
}

export interface ActivityVsFatigueData {
  date: string;
  activity_level: number;
  fatigue_level: number;
}

export interface ActivityVsFatigue {
  period: string;
  data: ActivityVsFatigueData[];
}

export interface WorkingHoursData {
  date: string;
  active_hours: number;
  recommended_hours: number;
  difference: number;
}

export interface WorkingHours {
  period: string;
  data: WorkingHoursData[];
}

export interface BreaksSummary {
  total: {
    pending: number;
    approved: number;
    rejected: number;
    completed: number;
  };
  today: {
    approved: number;
    completed: number;
  };
  pending_requires_action: boolean;
}

export interface AlertsTimelineData {
  date: string;
  total_alerts: number;
  high_priority: number;
  medium_priority: number;
  low_priority: number;
}

export interface AlertsTimeline {
  period: string;
  data: AlertsTimelineData[];
}

// ==================== SERVICE ====================

const BASE_URL = '/supervisor';

export const supervisorDashboardService = {
  /**
   * Obtener estadísticas generales del equipo
   */
  async getTeamStats(): Promise<TeamStats> {
    const response = await api.get<TeamStats>(`${BASE_URL}/team-stats/`);
    return response.data;
  },

  /**
   * Obtener tendencia de fatiga del equipo
   * @param days - Número de días a consultar (default: 7)
   */
  async getFatigueTrends(days: number = 7): Promise<FatigueTrends> {
    const response = await api.get<FatigueTrends>(`${BASE_URL}/fatigue-trends/`, {
      params: { days }
    });
    return response.data;
  },

  /**
   * Obtener distribución de empleados por nivel de riesgo
   */
  async getRiskDistribution(): Promise<RiskDistribution> {
    const response = await api.get<RiskDistribution>(`${BASE_URL}/risk-distribution/`);
    return response.data;
  },

  /**
   * Obtener datos de actividad vs fatiga
   * @param days - Número de días a consultar (default: 7)
   */
  async getActivityVsFatigue(days: number = 7): Promise<ActivityVsFatigue> {
    const response = await api.get<ActivityVsFatigue>(`${BASE_URL}/activity-vs-fatigue/`, {
      params: { days }
    });
    return response.data;
  },

  /**
   * Obtener horas de trabajo del equipo
   * @param days - Número de días a consultar (default: 7)
   */
  async getWorkingHours(days: number = 7): Promise<WorkingHours> {
    const response = await api.get<WorkingHours>(`${BASE_URL}/working-hours/`, {
      params: { days }
    });
    return response.data;
  },

  /**
   * Obtener resumen de descansos
   */
  async getBreaksSummary(): Promise<BreaksSummary> {
    const response = await api.get<BreaksSummary>(`${BASE_URL}/breaks-summary/`);
    return response.data;
  },

  /**
   * Obtener línea de tiempo de alertas
   * @param days - Número de días a consultar (default: 7)
   */
  async getAlertsTimeline(days: number = 7): Promise<AlertsTimeline> {
    const response = await api.get<AlertsTimeline>(`${BASE_URL}/alerts-timeline/`, {
      params: { days }
    });
    return response.data;
  },
};

export default supervisorDashboardService;
