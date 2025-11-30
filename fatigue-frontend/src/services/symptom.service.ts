/**
 * Symptom Report Service
 * Servicio para reportes de síntomas de empleados
 */

import api from './api';
import type { SymptomReport, SymptomReportData, Symptom } from '../types/symptom.types';

export const symptomService = {
  async reportSymptom(data: SymptomReportData): Promise<SymptomReport> {
    const response = await api.post('/symptom-reports/', data);
    return response.data;
  },

  async getMySymptoms(): Promise<Symptom[]> {
    const response = await api.get('/symptom-reports/');
    // El backend devuelve una respuesta paginada con results
    return response.data.results || [];
  },

  async getTeamSymptoms(): Promise<Symptom[]> {
    // Para supervisores, el mismo endpoint devuelve los síntomas de su equipo
    const response = await api.get('/symptom-reports/');
    // El backend devuelve una respuesta paginada con results
    return response.data.results || [];
  },

  async reviewSymptom(symptomId: number, data: { status: string; reviewer_notes: string }): Promise<Symptom> {
    // Usar el endpoint específico de review que actualiza is_reviewed
    const response = await api.post(`/symptom-reports/${symptomId}/review/`, { 
      notes: data.reviewer_notes 
    });
    return response.data.report || response.data;
  },

  async getPendingCount(): Promise<{ count: number; by_severity: { severe: number; moderate: number; mild: number } }> {
    const response = await api.get('/symptom-reports/pending-count/');
    return response.data;
  },

  async getRecentlyReviewed(): Promise<{ count: number; reports: Symptom[] }> {
    const response = await api.get('/symptom-reports/recently-reviewed/');
    return response.data;
  },
};
