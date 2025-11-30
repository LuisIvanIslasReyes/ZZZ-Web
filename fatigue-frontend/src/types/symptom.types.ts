/**
 * Symptom Types
 * Tipos para reportes de síntomas
 */

export type SymptomType = 
  | 'fatigue'
  | 'headache'
  | 'dizziness'
  | 'nausea'
  | 'muscle_pain'
  | 'eye_strain'
  | 'stress'
  | 'difficulty_concentrating'
  | 'shortness_of_breath'
  | 'other';

export type SymptomSeverity = 'mild' | 'moderate' | 'severe';

export interface SymptomReportData {
  symptom_type: SymptomType;
  severity: SymptomSeverity;
  description?: string;
}

export interface SymptomReport extends SymptomReportData {
  id: number;
  employee: number;
  created_at: string;
}

// Labels en español para mostrar en la UI
export const SYMPTOM_TYPE_LABELS: Record<SymptomType, string> = {
  fatigue: 'Fatiga / Cansancio',
  headache: 'Dolor de cabeza',
  dizziness: 'Mareo',
  nausea: 'Náuseas',
  muscle_pain: 'Dolor muscular',
  eye_strain: 'Fatiga visual',
  stress: 'Estrés',
  difficulty_concentrating: 'Dificultad para concentrarse',
  shortness_of_breath: 'Dificultad para respirar',
  other: 'Otro',
};

export const SYMPTOM_SEVERITY_LABELS: Record<SymptomSeverity, string> = {
  mild: 'Leve',
  moderate: 'Moderado',
  severe: 'Severo',
};

// Arrays para iterar en selects
export const SYMPTOM_TYPES: { value: SymptomType; label: string }[] = [
  { value: 'fatigue', label: 'Fatiga / Cansancio' },
  { value: 'headache', label: 'Dolor de cabeza' },
  { value: 'dizziness', label: 'Mareo' },
  { value: 'nausea', label: 'Náuseas' },
  { value: 'muscle_pain', label: 'Dolor muscular' },
  { value: 'eye_strain', label: 'Fatiga visual' },
  { value: 'stress', label: 'Estrés' },
  { value: 'difficulty_concentrating', label: 'Dificultad para concentrarse' },
  { value: 'shortness_of_breath', label: 'Dificultad para respirar' },
  { value: 'other', label: 'Otro' },
];

export const SYMPTOM_SEVERITIES: { value: SymptomSeverity; label: string }[] = [
  { value: 'mild', label: 'Leve' },
  { value: 'moderate', label: 'Moderado' },
  { value: 'severe', label: 'Severo' },
];
