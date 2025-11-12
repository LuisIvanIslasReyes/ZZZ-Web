/**
 * Recommendation Types
 * Interfaces y tipos relacionados con recomendaciones de rutinas
 */

export type RecommendationType = 'break' | 'exercise' | 'hydration' | 'nutrition' | 'sleep' | 'posture' | 'breathing';

export const RecommendationType = {
  BREAK: 'break' as const,
  EXERCISE: 'exercise' as const,
  HYDRATION: 'hydration' as const,
  NUTRITION: 'nutrition' as const,
  SLEEP: 'sleep' as const,
  POSTURE: 'posture' as const,
  BREATHING: 'breathing' as const
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
  type: RecommendationType;
  title: string;
  description: string;
  duration_minutes: number;
  status: RecommendationStatus;
  scheduled_for?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
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
