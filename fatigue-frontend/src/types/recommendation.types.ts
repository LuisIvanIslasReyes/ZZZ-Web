/**
 * Recommendation Types
 * Interfaces y tipos relacionados con recomendaciones de rutinas
 */

export type RecommendationType = 'break' | 'exercise' | 'hydration' | 'nutrition' | 'sleep' | 'posture' | 'breathing' | 'task_redistribution' | 'shift_rotation';

export const RecommendationType = {
  BREAK: 'break' as const,
  EXERCISE: 'exercise' as const,
  HYDRATION: 'hydration' as const,
  NUTRITION: 'nutrition' as const,
  SLEEP: 'sleep' as const,
  POSTURE: 'posture' as const,
  BREATHING: 'breathing' as const,
  TASK_REDISTRIBUTION: 'task_redistribution' as const,
  SHIFT_ROTATION: 'shift_rotation' as const
};

export type RecommendationStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export const RecommendationStatus = {
  PENDING: 'pending' as const,
  IN_PROGRESS: 'in_progress' as const,
  COMPLETED: 'completed' as const,
  SKIPPED: 'skipped' as const
};

export interface RoutineRecommendation {
  id: number;
  employee: number; // ID del empleado
  employee_name?: string;
  alert?: number; // ID de FatigueAlert relacionada (opcional)
  recommendation_type: string; // 'break', 'task_redistribution', 'shift_rotation'
  description: string;
  priority: number; // 1-5
  is_applied: boolean;
  applied_at?: string;
  based_on_data?: {
    avg_fatigue?: number;
    max_fatigue?: number;
    high_fatigue_count?: number;
    analysis_days?: number;
    period_start?: string;
    period_end?: string;
  };
  created_at: string;
  updated_at: string;
  // Legacy fields for backward compatibility
  type?: RecommendationType;
  title?: string;
  duration_minutes?: number;
  status?: RecommendationStatus;
  scheduled_for?: string;
  completed_at?: string;
}

export interface CreateRecommendationData {
  employee: number;
  alert?: number;
  type: RecommendationType;
  title: string;
  description: string;
  duration_minutes: number;
  scheduled_for?: string;
}

export interface UpdateRecommendationData {
  status?: RecommendationStatus;
  scheduled_for?: string;
  completed_at?: string;
}

export interface RecommendationFilters {
  employee?: number;
  type?: RecommendationType;
  status?: RecommendationStatus;
  date_from?: string;
  date_to?: string;
}

export interface RecommendationStats {
  total: number;
  by_type: Record<RecommendationType, number>;
  by_status: {
    pending: number;
    in_progress: number;
    completed: number;
    skipped: number;
  };
  completion_rate: number;
  period: {
    start: string;
    end: string;
  };
}
