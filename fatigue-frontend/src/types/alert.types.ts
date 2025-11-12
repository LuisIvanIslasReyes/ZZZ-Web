/**
 * Alert Types
 * Interfaces y tipos relacionados con alertas de fatiga
 */

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export const AlertSeverity = {
  LOW: 'low' as const,
  MEDIUM: 'medium' as const,
  HIGH: 'high' as const,
  CRITICAL: 'critical' as const
};

export type AlertStatus = 'pending' | 'acknowledged' | 'resolved' | 'dismissed';

export const AlertStatus = {
  PENDING: 'pending' as const,
  ACKNOWLEDGED: 'acknowledged' as const,
  RESOLVED: 'resolved' as const,
  DISMISSED: 'dismissed' as const
};

export interface FatigueAlert {
  id: number;
  employee: number; // ID del empleado
  employee_name?: string; // Nombre del empleado
  device: number; // ID del dispositivo
  device_name?: string;
  metrics: number; // ID de ProcessedMetrics relacionado
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  alert_type?: string; // Tipo de alerta (high_fatigue, critical_fatigue, etc)
  fatigue_score: number;
  heart_rate?: number;
  temperature?: number;
  spo2?: number; // Saturación de oxígeno
  recommendations?: string; // Recomendaciones
  acknowledged_by?: number; // ID del usuario que reconoció
  acknowledged_at?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAlertData {
  employee: number;
  device: number;
  metrics: number;
  severity: AlertSeverity;
  message: string;
  fatigue_score: number;
  heart_rate?: number;
  temperature?: number;
}

export interface UpdateAlertData {
  status?: AlertStatus;
  acknowledged_by?: number;
}

export interface AlertFilters {
  employee?: number;
  severity?: AlertSeverity;
  status?: AlertStatus;
  date_from?: string;
  date_to?: string;
}

export interface AlertStats {
  total: number;
  by_severity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  by_status: {
    pending: number;
    acknowledged: number;
    resolved: number;
    dismissed: number;
  };
  period: {
    start: string;
    end: string;
  };
}
