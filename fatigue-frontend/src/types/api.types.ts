/**
 * API Types
 * Interfaces genéricas para respuestas de API y manejo de errores
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
  code?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh: string;
}

// Dashboard Types
export interface DashboardStats {
  total_employees: number;
  active_devices: number;
  pending_alerts: number;
  avg_fatigue_score: number;
  alerts_today: number;
  high_risk_employees: number;
}

export interface EmployeeMetricsSummary {
  employee_id: number;
  employee_name: string;
  department?: string;
  latest_fatigue_score: number;
  avg_fatigue_score_7d: number;
  total_alerts_7d: number;
  last_reading: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}
