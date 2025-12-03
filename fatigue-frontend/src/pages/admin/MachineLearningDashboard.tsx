/**
 * Machine Learning Dashboard - Análisis Técnico
 * Dashboard completo con información detallada del modelo ML
 */

import { useState, useEffect, useCallback } from 'react';
import { mlService } from '../../services';
import type {
  MLModelInfo,
  MLStatistics,
  MLRetrainingStatus,
  MLPredictionHistory,
} from '../../types';
import { LoadingSpinner } from '../../components/common';

export function MachineLearningDashboard() {
  const [modelInfo, setModelInfo] = useState<MLModelInfo | null>(null);
  const [statistics, setStatistics] = useState<MLStatistics | null>(null);
  const [retrainingStatus, setRetrainingStatus] = useState<MLRetrainingStatus | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<MLPredictionHistory | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [activeTab, setActiveTab] = useState<'clustering' | 'features'>('clustering');
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los datos
  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [model, stats, retraining, history] = await Promise.all([
        mlService.getModelInfo(),
        mlService.getStatistics(),
        mlService.getRetrainingStatus(),
        mlService.getPredictionHistory(50),
      ]);

      setModelInfo(model);
      setStatistics(stats);
      setRetrainingStatus(retraining);
      setPredictionHistory(history);
    } catch (err) {
      console.error('Error cargando datos ML:', err);
      setError('Error al cargar los datos del modelo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Auto-refresh
    const interval1 = setInterval(() => {
      mlService.getModelInfo().then(setModelInfo);
    }, 30000); // 30s

    const interval2 = setInterval(() => {
      mlService.getStatistics().then(setStatistics);
    }, 60000); // 60s

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, [loadData]);

  // Manejar re-entrenamiento
  const handleRetrain = async () => {
    if (!window.confirm('¿Iniciar re-entrenamiento del modelo? (Tiempo estimado: 1-2 minutos)')) {
      return;
    }

    try {
      setRetraining(true);
      await mlService.startRetraining();

      // Polling hasta que cambie la fecha de entrenamiento
      const lastDate = modelInfo?.training.date;
      const pollInterval = setInterval(async () => {
        const newData = await mlService.getModelInfo();

        if (newData.training.date !== lastDate) {
          clearInterval(pollInterval);
          setRetraining(false);
          setModelInfo(newData);
          alert('✅ Modelo re-entrenado exitosamente');
          loadData(); // Recargar todo
        }
      }, 10000); // Cada 10 segundos

      // Timeout de seguridad (5 minutos)
      setTimeout(() => {
        clearInterval(pollInterval);
        setRetraining(false);
      }, 300000);
    } catch (err) {
      console.error('Error re-entrenando:', err);
      alert('❌ Error al iniciar re-entrenamiento');
      setRetraining(false);
    }
  };

  // Utilidades
  const getFatigueColor = (fatigue: number): string => {
    if (fatigue < 55) return 'text-green-700 bg-green-100 border-green-300';
    if (fatigue < 65) return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    return 'text-red-700 bg-red-100 border-red-300';
  };

  const getScoreQuality = (score: number): { text: string; color: string } => {
    if (score >= 0.8) return { text: 'Excelente', color: 'text-green-700 bg-green-100' };
    if (score >= 0.6) return { text: 'Bueno', color: 'text-yellow-700 bg-yellow-100' };
    return { text: 'Mejorable', color: 'text-red-700 bg-red-100' };
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('es-ES');
  };

  const getFeatureInfo = (featureName: string): { name: string; description: string } => {
    const featureMap: Record<string, { name: string; description: string }> = {
      'movement_variance': {
        name: 'Varianza del Movimiento',
        description: 'Mide la variabilidad en los patrones de movimiento del trabajador'
      },
      'activity_normalized': {
        name: 'Actividad Normalizada',
        description: 'Nivel de actividad física ajustado según parámetros estándar'
      },
      'spo2_variance': {
        name: 'Varianza de SpO2',
        description: 'Fluctuación en los niveles de saturación de oxígeno en sangre'
      },
      'hrv_sdnn': {
        name: 'HRV SDNN',
        description: 'Desviación estándar de intervalos entre latidos (variabilidad cardíaca)'
      },
      'desaturation_count': {
        name: 'Conteo de Desaturaciones',
        description: 'Número de eventos donde el SpO2 cae por debajo del nivel normal'
      },
      'activity_level': {
        name: 'Nivel de Actividad',
        description: 'Intensidad general de la actividad física registrada'
      },
      'hrv_rmssd': {
        name: 'HRV RMSSD',
        description: 'Raíz cuadrada media de diferencias sucesivas entre latidos'
      },
      'movement_entropy': {
        name: 'Entropía del Movimiento',
        description: 'Complejidad y predictibilidad de los patrones de movimiento'
      },
      'hrv_ratio': {
        name: 'Ratio de HRV',
        description: 'Proporción entre diferentes componentes de variabilidad cardíaca'
      },
      'hr_activity_ratio': {
        name: 'Ratio FC/Actividad',
        description: 'Relación entre frecuencia cardíaca y nivel de actividad física'
      }
    };

    return featureMap[featureName] || { 
      name: featureName, 
      description: 'Característica biométrica para análisis de fatiga' 
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Machine Learning - Análisis de Fatiga Laboral
        </h1>
        <p className="text-gray-600 text-base leading-relaxed">
          Sistema de detección predictiva de fatiga mediante análisis de métricas biométricas con algoritmos de clustering no supervisado
        </p>
      </div>

      {/* Información del Algoritmo */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Algoritmo K-Means Clustering</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">¿Qué es K-Means?</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              K-Means es un algoritmo de aprendizaje automático no supervisado que agrupa datos en <strong>clusters</strong> (grupos) 
              basándose en similitudes entre las características. En nuestro caso, agrupa empleados según patrones de fatiga 
              detectados en sus métricas biométricas.
            </p>
            
            <h3 className="font-semibold text-gray-900 mb-3">Proceso de Clustering</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Recopilación de métricas fisiológicas (HR, SpO2, movimiento)</li>
              <li>Normalización y preprocesamiento de datos</li>
              <li>Agrupación en clusters según similitudes</li>
              <li>Asignación de nivel de fatiga a cada cluster</li>
              <li>Predicción en tiempo real para nuevos datos</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Problema que Resuelve</h3>
            <div className="space-y-3">
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                <h4 className="font-semibold text-red-900 text-sm mb-1">Detección Tardía</h4>
                <p className="text-xs text-gray-700">
                  Los métodos tradicionales detectan fatiga cuando ya ha causado accidentes o afectado productividad
                </p>
              </div>
              
              <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                <h4 className="font-semibold text-orange-900 text-sm mb-1">Subjetividad</h4>
                <p className="text-xs text-gray-700">
                  Evaluaciones basadas en percepciones personales sin datos objetivos
                </p>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                <h4 className="font-semibold text-green-900 text-sm mb-1">Nuestra Solución</h4>
                <p className="text-xs text-gray-700">
                  Predicción automática y objetiva basada en datos biométricos en tiempo real, 
                  permitiendo intervención preventiva antes de incidentes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Card 1: Modelo Actual */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Información del Modelo</h2>
            {modelInfo?.model_exists && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                ACTIVO
              </span>
            )}
          </div>

          {modelInfo?.model_exists ? (
            <div className="space-y-4">
              {/* Tipo de Modelo */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1 font-semibold">ALGORITMO</p>
                <p className="text-lg font-bold text-blue-900">
                  {modelInfo.training.algorithm || modelInfo.ml_service.type || 'K-Means Clustering'}
                </p>
              </div>

              {/* Métricas Clave */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Features</p>
                  <p className="text-xl font-bold text-gray-900">
                    {modelInfo.ml_service.features_count}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Muestras</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatNumber(modelInfo.training.samples)}
                  </p>
                </div>
              </div>

              {/* Info adicional */}
              <div className="text-center pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Tamaño del modelo: <span className="font-semibold">{modelInfo.model_size_mb.toFixed(2)} MB</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-gray-600 font-semibold">Modelo no entrenado</p>
              <p className="text-sm text-gray-500 mt-2">
                Inicia el entrenamiento para comenzar
              </p>
            </div>
          )}
        </div>

        {/* Card 2: Estadísticas */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Estadísticas de Predicción</h2>

          {statistics && (
            <div className="space-y-4">
              {/* Total Predicciones */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1 font-semibold">PREDICCIONES TOTALES</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatNumber(statistics.predictions.total)}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="text-gray-600">Últimas 24h:</span>
                  <span className="font-bold text-blue-700">
                    {formatNumber(statistics.predictions.last_24h)}
                  </span>
                </div>
              </div>

              {/* Promedio de Fatiga */}
              <div className={`p-4 rounded-lg border-2 ${getFatigueColor(statistics.predictions.average_fatigue)}`}>
                <p className="text-xs font-semibold mb-2">PROMEDIO FATIGA</p>
                <p className="text-2xl font-bold">
                  {statistics.predictions.average_fatigue.toFixed(1)}%
                </p>
              </div>

              {/* Distribución */}
              <div className="border border-gray-200 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Distribución por Nivel
                </p>
                <div className="space-y-3">
                  {/* Normal */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 font-medium">Normal (&lt;55%)</span>
                      <span className="font-bold text-green-700">
                        {statistics.fatigue_distribution.normal}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(statistics.fatigue_distribution.normal / statistics.predictions.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Moderado */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 font-medium">Moderado (55-65%)</span>
                      <span className="font-bold text-yellow-700">
                        {statistics.fatigue_distribution.moderate}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(statistics.fatigue_distribution.moderate / statistics.predictions.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Alto */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 font-medium">Alto (&gt;65%)</span>
                      <span className="font-bold text-red-700">
                        {statistics.fatigue_distribution.high}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(statistics.fatigue_distribution.high / statistics.predictions.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card 3: Re-entrenamiento */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Re-entrenamiento del Modelo</h2>

          {retrainingStatus && (
            <div className="space-y-4">
              {/* Estado */}
              <div className="border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-700 font-medium">Estado:</span>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      retrainingStatus.status === 'ready'
                        ? 'bg-green-100 text-green-700'
                        : retrainingStatus.status === 'training'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {retrainingStatus.status === 'ready' ? 'LISTO' : 
                     retrainingStatus.status === 'training' ? 'ENTRENANDO' : 'ERROR'}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Último:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(retrainingStatus.last_training).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Próximo:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(retrainingStatus.next_scheduled).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Datos Disponibles */}
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-3 font-semibold">DATOS DISPONIBLES</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-2xl font-bold text-purple-900">
                    {formatNumber(retrainingStatus.available_metrics)}
                  </span>
                  <span className="text-sm text-gray-600 mb-1">
                    / {formatNumber(retrainingStatus.min_required)} requeridos
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      retrainingStatus.can_retrain ? 'bg-purple-600' : 'bg-gray-400'
                    }`}
                    style={{
                      width: `${Math.min((retrainingStatus.available_metrics / retrainingStatus.min_required) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Botón Re-entrenar */}
              <button
                onClick={handleRetrain}
                disabled={!retrainingStatus.can_retrain || retraining}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                  retrainingStatus.can_retrain && !retraining
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {retraining ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ENTRENANDO...
                  </span>
                ) : (
                  'INICIAR RE-ENTRENAMIENTO'
                )}
              </button>

              {!retrainingStatus.can_retrain && (
                <p className="text-xs text-center text-gray-500">
                  Se necesitan más datos para re-entrenar el modelo
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features del Modelo */}
      {modelInfo?.ml_service.features && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Características del Modelo</h2>
            <span className="text-base font-bold text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
              {modelInfo.ml_service.features_count} Features
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {modelInfo.ml_service.features.map((feature, index) => {
              const featureInfo = getFeatureInfo(feature);
              
              return (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 hover:border-[#18314F] hover:shadow-lg transition-all group"
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <div className="w-14 h-14 bg-[#18314F] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-2xl font-bold text-white">{index + 1}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                        {featureInfo.name}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 flex-1 leading-relaxed">
                      {featureInfo.description}
                    </p>
                    
                    <code className="text-xs font-mono text-gray-500 bg-white px-3 py-2 rounded-lg border border-gray-300 block truncate">
                      {feature}
                    </code>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visualizaciones del Modelo */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Análisis Visual del Modelo</h2>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-semibold text-sm transition-colors ${
              activeTab === 'clustering'
                ? 'border-b-2 border-[#18314F] text-[#18314F]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('clustering')}
          >
            Análisis de Clustering
          </button>
          <button
            className={`px-4 py-2 font-semibold text-sm transition-colors ${
              activeTab === 'features'
                ? 'border-b-2 border-[#18314F] text-[#18314F]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('features')}
          >
            Feature Engineering
          </button>
        </div>

        {/* Contenido */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          {activeTab === 'clustering' ? (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Visualización del Clustering K-Means</h3>
              <p className="text-sm text-gray-700 mb-4">
                Análisis completo del modelo incluyendo: Elbow Method (determinación del número óptimo de clusters), 
                Silhouette Score (calidad de la agrupación), reducción dimensional con PCA y t-SNE, 
                y distribución de los clusters identificados.
              </p>
              <div className="bg-white p-4 rounded-lg border border-gray-300">
                <img
                  src="/clustering_analysis.png"
                  alt="Análisis de clustering K-Means - Elbow Method, Silhouette Score, PCA, t-SNE"
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'http://localhost:8000/media/ml_visualizations/clustering_analysis.png';
                  }}
                />
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Correlación de Características</h3>
              <p className="text-sm text-gray-700 mb-4">
                Matriz de correlación que muestra las relaciones entre las 10 características biométricas utilizadas 
                en el modelo. Permite identificar variables altamente correlacionadas y entender mejor las relaciones 
                entre diferentes métricas fisiológicas.
              </p>
              <div className="bg-white p-4 rounded-lg border border-gray-300">
                <img
                  src="/feature_engineering.png"
                  alt="Matriz de correlación de características biométricas"
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'http://localhost:8000/media/ml_visualizations/feature_engineering.png';
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Historial de Predicciones */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Historial de Predicciones</h2>

        {predictionHistory && predictionHistory.predictions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Fecha/Hora
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Dispositivo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    HR Prom.
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    SpO2 Prom.
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Índice Fatiga
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Clasificación
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {predictionHistory.predictions.map((prediction) => (
                  <tr key={prediction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(prediction.timestamp)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-900">
                      {prediction.device}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {prediction.employee}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">
                      {prediction.hr_avg.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">
                      {prediction.spo2_avg.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-bold text-gray-900">
                      {prediction.fatigue_index.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          prediction.classification === 'normal'
                            ? 'bg-green-100 text-green-700'
                            : prediction.classification === 'moderate'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {prediction.classification === 'normal' ? 'NORMAL' :
                         prediction.classification === 'moderate' ? 'MODERADO' : 'ALTO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-semibold">No hay predicciones disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
}
