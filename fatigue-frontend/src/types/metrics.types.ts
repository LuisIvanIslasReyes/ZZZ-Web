/**
 * Metrics Types
 * Interfaces y tipos relacionados con métricas y datos de sensores
 */

export interface SensorData {
  id: number;
  device: number; // ID del dispositivo
  device_name?: string; // Nombre del dispositivo (incluido en respuestas expandidas)
  employee?: number; // ID del empleado
  employee_name?: string; // Nombre del empleado
  heart_rate: number;
  body_temperature: number;
  movement_level: number;
  timestamp: string;
  created_at: string;
}

export interface ProcessedMetrics {
  id: number;
  sensor_data: number; // ID de SensorData relacionado
  device: number; // ID del dispositivo
  device_name?: string;
  employee: number; // ID del empleado
  employee_name?: string;
  heart_rate_variability: number;
  stress_index: number;
  fatigue_score: number;
  activity_level: number;
  recommendation?: string;
  timestamp: string;
  created_at: string;
}

export interface MetricsFilters {
  employee?: number;
  device?: number;
  date_from?: string;
  date_to?: string;
  min_fatigue_score?: number;
  max_fatigue_score?: number;
}

export interface MetricsStats {
  avg_heart_rate: number;
  avg_temperature: number;
  avg_fatigue_score: number;
  avg_stress_index: number;
  total_readings: number;
  period: {
    start: string;
    end: string;
  };
}
