/**
 * Tipos para gestión de simuladores ESP32
 */

export interface SimulatorSession {
  id: number;
  employee: number;
  employee_name: string;
  employee_email: string;
  device_id: string;
  status: 'running' | 'stopped' | 'error';
  status_display: string;
  fatigue_profile: 'rested' | 'normal' | 'tired' | 'fatigued' | 'critical';
  fatigue_profile_display: string;
  activity_mode: 'resting' | 'light' | 'moderate' | 'heavy';
  activity_mode_display: string;
  current_fatigue: number;
  messages_sent: number;
  started_at: string;
  stopped_at: string | null;
  duration_seconds: number;
  live_stats?: SimulatorLiveStats;
}

export interface SimulatorSessionDetail extends SimulatorSession {
  base_heart_rate: number;
  base_spo2: number;
  initial_fatigue: number;
  fatigue_rate: number;
  mqtt_broker: string;
  mqtt_port: number;
  publish_interval: number;
  created_by: number | null;
  created_by_name?: string;
  error_message: string | null;
  updated_at: string;
  config: SimulatorConfig;
}

export interface SimulatorConfig {
  device_id: string;
  employee_id: number;
  fatigue_profile: string;
  activity_mode: string;
  base_heart_rate: number;
  base_spo2: number;
  initial_fatigue: number;
  fatigue_rate: number;
  mqtt_broker: string;
  mqtt_port: number;
  publish_interval: number;
}

export interface CreateSimulatorData {
  employee: number;
  device_id: string;
  fatigue_profile: 'rested' | 'normal' | 'tired' | 'fatigued' | 'critical';
  activity_mode: 'resting' | 'light' | 'moderate' | 'heavy';
  base_heart_rate?: number;
  base_spo2?: number;
  initial_fatigue?: number;
  fatigue_rate?: number;
  mqtt_broker?: string;
  mqtt_port?: number;
  publish_interval?: number;
}

export interface UpdateSimulatorConfigData {
  activity_mode?: 'rest' | 'light' | 'moderate' | 'intense';
  fatigue_level?: number;
  fatigue_rate?: number;
}

export interface SimulatorLiveStats {
  device_id: string;
  running: boolean;
  messages_sent: number;
  current_fatigue: number;
  activity_mode: string;
}

export interface EmployeeForSimulator {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  supervisor: number | null;
  supervisor_name: string | null;
  has_active_simulator: boolean;
  device_id: string;
}

export interface SimulatorStats {
  total_sessions: number;
  running: number;
  stopped: number;
  errors: number;
  active_in_memory: number;
  live_stats: SimulatorLiveStats[];
}

export const FATIGUE_PROFILES = [
  { value: 'rested', label: 'Descansado (0-30%)', color: 'success' },
  { value: 'normal', label: 'Normal (30-50%)', color: 'info' },
  { value: 'tired', label: 'Cansado (50-70%)', color: 'warning' },
  { value: 'fatigued', label: 'Fatigado (70-85%)', color: 'error' },
  { value: 'critical', label: 'Crítico (85-100%)', color: 'error' },
] as const;

export const ACTIVITY_MODES = [
  { value: 'resting', label: 'Reposo', icon: '😴' },
  { value: 'light', label: 'Actividad Ligera', icon: '🚶' },
  { value: 'moderate', label: 'Actividad Moderada', icon: '🏃' },
  { value: 'heavy', label: 'Actividad Intensa', icon: '💪' },
] as const;
