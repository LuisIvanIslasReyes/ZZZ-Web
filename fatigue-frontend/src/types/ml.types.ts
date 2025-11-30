/**
 * Machine Learning Types
 * Tipos para el sistema de Machine Learning
 */

export interface MLModelInfo {
  model_exists: boolean;
  model_size_mb: number;
  ml_service: {
    type: string;
    features_count: number;
    features: string[];
  };
  training: {
    samples: number;
    date: string;
    algorithm?: string;
  };
  quality_metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1_score?: number;
  };
}

export interface MLStatistics {
  predictions: {
    total: number;
    last_24h: number;
    average_fatigue: number;
  };
  fatigue_distribution: {
    normal: number;
    moderate: number;
    high: number;
  };
}

export interface MLRetrainingStatus {
  last_training: string;
  next_scheduled: string;
  available_metrics: number;
  min_required: number;
  can_retrain: boolean;
  status: 'ready' | 'training' | 'error';
}

export interface MLPrediction {
  id: number;
  timestamp: string;
  device: string;
  employee: string;
  fatigue_index: number;
  hr_avg: number;
  spo2_avg: number;
  classification: 'normal' | 'moderate' | 'high';
}

export interface MLPredictionHistory {
  count: number;
  predictions: MLPrediction[];
}

export interface MLRetrainingRequest {
  force?: boolean;
}

export interface MLRetrainingResponse {
  status: 'started' | 'error';
  message: string;
  estimated_time?: string;
}
