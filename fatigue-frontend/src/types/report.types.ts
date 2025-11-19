/**
 * Report Types
 * Tipos para reportes del sistema
 */

export interface ReportPeriod {
  start_date: string;
  end_date: string;
  days?: number;
}

export interface EmployeeReportStats {
  avg_fatigue: number;
  max_fatigue: number;
  min_fatigue: number;
  avg_spo2: number;
  avg_hr: number;
  total_readings: number;
}

export interface AlertStats {
  total: number;
  critical: number;
  high: number;
  resolved: number;
  pending: number;
}

export interface RecommendationStats {
  total: number;
  applied: number;
  rejected: number;
  pending: number;
}

export interface DailyMetric {
  date: string;
  avg_fatigue: number;
  avg_spo2: number;
  avg_hr: number;
  readings: number;
}

export interface EmployeeReport {
  employee: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  period: ReportPeriod;
  metrics_stats: EmployeeReportStats;
  alerts_stats: AlertStats;
  recommendations_stats: RecommendationStats;
  daily_metrics: DailyMetric[];
}

export interface TeamReportEmployee {
  id: number;
  name: string;
  email: string;
  avg_fatigue: number;
  total_alerts: number;
  critical_alerts: number;
  status: 'good' | 'warning' | 'critical';
}

export interface TeamReport {
  supervisor: {
    id: number;
    name: string;
    email: string;
  };
  period: ReportPeriod;
  team_size: number;
  total_alerts: number;
  critical_alerts: number;
  avg_fatigue: number;
  employees: TeamReportEmployee[];
}

export interface ExecutiveSummary {
  period: ReportPeriod;
  total_employees: number;
  active_devices: number;
  total_alerts: number;
  critical_alerts: number;
  avg_fatigue: number;
  high_risk_employees: number;
  recommendations_applied: number;
  top_concerns: string[];
}

export type ReportType = 'daily' | 'weekly' | 'monthly' | 'custom';
export type ReportFormat = 'json' | 'csv' | 'pdf';

export interface ReportRequest {
  type: ReportType;
  start_date?: string;
  end_date?: string;
  employee_id?: number;
  format?: ReportFormat;
}
