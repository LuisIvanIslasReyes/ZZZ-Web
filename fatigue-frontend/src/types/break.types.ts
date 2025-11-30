/**
 * Break Types
 * Tipos para el sistema de descansos programados
 */

// Tipos de descanso disponibles
export type BreakType = 'coffee' | 'lunch' | 'rest' | 'medical' | 'personal' | 'stretch';

// Estados de un descanso
export type BreakStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

// Duraciones disponibles en minutos
export type BreakDuration = 15 | 30 | 45 | 60 | 90 | 120;

// Interface principal de un descanso programado
export interface ScheduledBreak {
  id: number;
  employee: number;
  employee_name: string;
  break_type: BreakType;
  break_type_display: string;
  scheduled_date: string; // YYYY-MM-DD
  scheduled_time: string; // HH:MM:SS
  duration_minutes: BreakDuration;
  duration_display: string;
  status: BreakStatus;
  status_display: string;
  reason?: string;
  reviewer_notes?: string;
  reviewed_by?: number;
  reviewed_by_name?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

// Payload para crear un descanso
export interface CreateBreakPayload {
  break_type: BreakType;
  scheduled_date: string; // YYYY-MM-DD
  scheduled_time: string; // HH:MM:SS
  duration_minutes: BreakDuration;
  reason?: string;
}

// Payload para revisar un descanso (supervisor)
export interface ReviewBreakPayload {
  status: 'approved' | 'rejected';
  reviewer_notes?: string;
}

// Payload para actualizar estado (empleado)
export interface UpdateBreakStatusPayload {
  status: 'completed' | 'cancelled';
}

// Constantes con labels en español
export const BREAK_TYPES: { value: BreakType; label: string; icon: string }[] = [
  { value: 'coffee', label: 'Café/Snack', icon: 'coffee' },
  { value: 'lunch', label: 'Almuerzo', icon: 'utensils' },
  { value: 'rest', label: 'Descanso general', icon: 'moon' },
  { value: 'medical', label: 'Médico', icon: 'medical' },
  { value: 'personal', label: 'Personal', icon: 'user' },
  { value: 'stretch', label: 'Estiramiento/Ejercicio', icon: 'stretch' },
];

export const BREAK_DURATIONS: { value: BreakDuration; label: string }[] = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1 hora 30 minutos' },
  { value: 120, label: '2 horas' },
];

export const BREAK_STATUSES: { value: BreakStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pendiente', color: 'yellow' },
  { value: 'approved', label: 'Aprobado', color: 'green' },
  { value: 'rejected', label: 'Rechazado', color: 'red' },
  { value: 'completed', label: 'Completado', color: 'blue' },
  { value: 'cancelled', label: 'Cancelado', color: 'gray' },
];
