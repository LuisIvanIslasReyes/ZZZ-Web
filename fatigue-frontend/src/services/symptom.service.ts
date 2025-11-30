/**
 * Symptom Report Service
 * Servicio para reportes de síntomas de empleados
 */

import api from './api';
import type { SymptomReport, SymptomReportData } from '../types/symptom.types';

export const symptomService = {
  async reportSymptom(data: SymptomReportData): Promise<SymptomReport> {
    const response = await api.post('/symptom-reports/', data);
    return response.data;
  },
};
