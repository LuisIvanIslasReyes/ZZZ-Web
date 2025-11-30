/**
 * Employee Recommendations Page
 * Recomendaciones personalizadas para el empleado
 * Diseño ZZZ Admin Style
 */

import { useEffect, useState } from 'react';
import recommendationService from '../../services/recommendation.service';
import type { RoutineRecommendation } from '../../types/recommendation.types';

export function EmployeeRecommendationsPage() {
  const [recommendations, setRecommendations] = useState<RoutineRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending'>('pending');

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await recommendationService.getMyRecommendations(
          filter === 'pending' ? true : undefined
        );
        setRecommendations(data);
      } catch (err) {
        console.error('Error loading recommendations:', err);
        const error = err as { response?: { data?: { detail?: string } } };
        setError(error.response?.data?.detail || 'Error al cargar las recomendaciones');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [filter]);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'break': 'Descanso',
      'task_redistribution': 'Redistribución de Tareas',
      'shift_rotation': 'Rotación de Turnos'
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'break':
        return (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'task_redistribution':
        return (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'shift_rotation':
        return (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority === 5) return 'bg-red-100 text-red-700 border-red-200';
    if (priority === 4) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (priority === 3) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (priority === 2) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority === 5) return 'Urgente';
    if (priority === 4) return 'Alta';
    if (priority === 3) return 'Media';
    if (priority === 2) return 'Baja';
    return 'Muy Baja';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#18314F] mb-2">Mis Recomendaciones</h1>
        <p className="text-lg text-[#18314F]/70">Recomendaciones personalizadas para mejorar tu bienestar</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              filter === 'pending'
                ? 'bg-[#18314F] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-[#18314F] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center h-[200px]">
            <div className="text-center">
              <div className="loading loading-spinner loading-lg text-[#18314F]"></div>
              <p className="mt-4 text-gray-500">Cargando recomendaciones...</p>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
            <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl font-medium text-center">
              {filter === 'pending' 
                ? '¡Excelente! No tienes recomendaciones pendientes'
                : 'No hay recomendaciones disponibles'}
            </p>
            <p className="text-sm mt-2">
              {filter === 'pending'
                ? 'Mantén un buen desempeño para evitar nuevas recomendaciones'
                : 'Las recomendaciones aparecerán aquí cuando estén disponibles'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[#18314F]">{getTypeIcon(recommendation.recommendation_type)}</span>
                    <div>
                      <h3 className="text-xl font-bold text-[#18314F]">
                        {getTypeLabel(recommendation.recommendation_type)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(recommendation.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                      Prioridad: {getPriorityLabel(recommendation.priority)}
                    </span>
                    {recommendation.is_applied && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        ✓ Aplicada
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                    {recommendation.description}
                  </div>
                </div>

                {/* Stats from based_on_data */}
                {recommendation.based_on_data && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {recommendation.based_on_data.avg_fatigue && (
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-blue-600 font-medium">Fatiga Promedio</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {recommendation.based_on_data.avg_fatigue.toFixed(1)}
                        </p>
                      </div>
                    )}
                    {recommendation.based_on_data.max_fatigue && (
                      <div className="bg-red-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-red-600 font-medium">Fatiga Máxima</p>
                        <p className="text-2xl font-bold text-red-700">
                          {recommendation.based_on_data.max_fatigue.toFixed(1)}
                        </p>
                      </div>
                    )}
                    {recommendation.based_on_data.high_fatigue_count && (
                      <div className="bg-orange-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-orange-600 font-medium">Episodios Altos</p>
                        <p className="text-2xl font-bold text-orange-700">
                          {recommendation.based_on_data.high_fatigue_count}
                        </p>
                      </div>
                    )}
                    {recommendation.based_on_data.analysis_days && (
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-purple-600 font-medium">Días Analizados</p>
                        <p className="text-2xl font-bold text-purple-700">
                          {recommendation.based_on_data.analysis_days}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Applied info */}
                {recommendation.is_applied && recommendation.applied_at && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      ✓ Aplicada el {new Date(recommendation.applied_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
