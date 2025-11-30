/**
 * Machine Learning Service
 * Servicio para endpoints de Machine Learning
 */

import api from './api';
import type {
  MLModelInfo,
  MLStatistics,
  MLRetrainingStatus,
  MLPredictionHistory,
  MLRetrainingRequest,
  MLRetrainingResponse,
} from '../types/ml.types';

/**
 * Obtener información del modelo
 */
export const getModelInfo = async (): Promise<MLModelInfo> => {
  const response = await api.get<MLModelInfo>('/ml/model-info/');
  return response.data;
};

/**
 * Obtener estadísticas de predicciones
 */
export const getStatistics = async (): Promise<MLStatistics> => {
  const response = await api.get<MLStatistics>('/ml/statistics/');
  return response.data;
};

/**
 * Obtener estado de re-entrenamiento
 */
export const getRetrainingStatus = async (): Promise<MLRetrainingStatus> => {
  const response = await api.get<MLRetrainingStatus>('/ml/retraining/');
  return response.data;
};

/**
 * Iniciar re-entrenamiento del modelo
 */
export const startRetraining = async (
  request: MLRetrainingRequest = {}
): Promise<MLRetrainingResponse> => {
  const response = await api.post<MLRetrainingResponse>('/ml/retraining/', request);
  return response.data;
};

/**
 * Obtener historial de predicciones
 */
export const getPredictionHistory = async (
  limit: number = 50
): Promise<MLPredictionHistory> => {
  const response = await api.get<MLPredictionHistory>(
    `/ml/predictions/history/?limit=${limit}`
  );
  return response.data;
};

const mlService = {
  getModelInfo,
  getStatistics,
  getRetrainingStatus,
  startRetraining,
  getPredictionHistory,
};

export default mlService;
