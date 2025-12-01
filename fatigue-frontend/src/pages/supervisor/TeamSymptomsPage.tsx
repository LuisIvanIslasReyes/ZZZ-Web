/**
 * Team Symptoms Page
 * Página para supervisores: Ver y revisar síntomas del equipo
 */

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { symptomService } from '../../services';
import { LoadingSpinner, Modal } from '../../components/common';
import type { Symptom } from '../../types';

export function TeamSymptomsPage() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'reviewed'>('all');
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'reviewed' | 'dismissed'>('reviewed');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadSymptoms();
  }, []);

  const loadSymptoms = async () => {
    try {
      setIsLoading(true);
      const data = await symptomService.getTeamSymptoms();
      setSymptoms(data);
      
      // Emit event with actual pending count from loaded data (usar is_reviewed)
      const pendingCount = data.filter((s: Symptom) => !s.is_reviewed).length;
      window.dispatchEvent(new CustomEvent('symptoms-count-updated', { detail: { count: pendingCount } }));
    } catch (error) {
      console.error('Error loading symptoms:', error);
      setSymptoms([]);
      toast.error('Error al cargar síntomas del equipo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSymptom = (symptom: Symptom) => {
    setSelectedSymptom(symptom);
    setReviewNotes('');
    setReviewStatus('reviewed');
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedSymptom) return;

    try {
      setIsSubmitting(true);
      
      // Revisar el síntoma - El backend automáticamente crea una alerta para el empleado
      await symptomService.reviewSymptom(selectedSymptom.id, {
        status: reviewStatus,
        reviewer_notes: reviewNotes
      });
      
      toast.success('Síntoma revisado exitosamente. El empleado ha sido notificado.');
      setIsReviewModalOpen(false);
      loadSymptoms();
      
      // Notify MainLayout to update the badge counter
      window.dispatchEvent(new CustomEvent('symptoms-updated'));
    } catch (error) {
      console.error('Error reviewing symptom:', error);
      toast.error('Error al revisar síntoma');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (symptom: Symptom) => {
    if (!symptom.is_reviewed) {
      return { label: 'En Espera', className: 'bg-yellow-100 text-yellow-800' };
    }
    
    switch (symptom.status) {
      case 'reviewed':
        return { label: 'Revisado', className: 'bg-green-100 text-green-800' };
      case 'dismissed':
        return { label: 'Descartado', className: 'bg-gray-100 text-gray-800' };
      default:
        return { label: 'Revisado', className: 'bg-green-100 text-green-800' };
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low':
      case 'mild':
        return { label: 'Leve', className: 'bg-green-100 text-green-700', dotColor: 'bg-green-500' };
      case 'medium':
      case 'moderate':
        return { label: 'Moderado', className: 'bg-yellow-100 text-yellow-700', dotColor: 'bg-yellow-500' };
      case 'high':
      case 'severe':
        return { label: 'Severo', className: 'bg-red-100 text-red-700', dotColor: 'bg-red-500' };
      default:
        return { label: 'Desconocido', className: 'bg-gray-100 text-gray-700', dotColor: 'bg-gray-500' };
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Cargando síntomas del equipo..." />;
  }

  // Estadísticas (usar is_reviewed del backend como fuente de verdad)
  const pendingSymptoms = symptoms.filter(s => !s.is_reviewed);
  // Revisados: is_reviewed = true Y (status = 'reviewed' O status no definido/pending)
  const reviewedSymptoms = symptoms.filter(s => s.is_reviewed && s.status !== 'dismissed');
  const dismissedSymptoms = symptoms.filter(s => s.is_reviewed && s.status === 'dismissed');
  
  const stats = {
    total: symptoms.length,
    pending: pendingSymptoms.length,
    reviewed: reviewedSymptoms.length,
    dismissed: dismissedSymptoms.length
  };

  // Filtrar síntomas según el filtro activo
  let filteredSymptoms = symptoms;
  if (activeFilter === 'pending') {
    filteredSymptoms = pendingSymptoms;
  } else if (activeFilter === 'reviewed') {
    // Mostrar todos los que ya fueron revisados (reviewed + dismissed)
    filteredSymptoms = symptoms.filter(s => s.is_reviewed);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-[#18314F] mb-1">Síntomas del Equipo</h1>
          <p className="text-lg text-[#18314F]/70">Revisa y gestiona los síntomas reportados por tu equipo</p>
        </div>
        {stats.pending > 0 && (
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold animate-pulse">
            {stats.pending} pendiente{stats.pending !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 rounded-xl p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Total</p>
              <p className="text-2xl font-bold text-[#18314F]">{stats.total}</p>
            </div>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">En Espera</p>
              <p className="text-2xl font-bold text-[#18314F]">{stats.pending}</p>
            </div>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#F59E0B">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Revisados</p>
              <p className="text-2xl font-bold text-[#18314F]">{stats.reviewed}</p>
            </div>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#22C55E">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 border-l-4 border-l-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Descartados</p>
              <p className="text-2xl font-bold text-[#18314F]">{stats.dismissed}</p>
            </div>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6B7280">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-[#18314F] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeFilter === 'pending'
              ? 'bg-[#18314F] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
          }`}
        >
          En Espera {stats.pending > 0 && <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">{stats.pending}</span>}
        </button>
        <button
          onClick={() => setActiveFilter('reviewed')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeFilter === 'reviewed'
              ? 'bg-[#18314F] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
          }`}
        >
          Revisados
        </button>
      </div>

      {/* Symptoms List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredSymptoms.length === 0 ? (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-2xl font-semibold text-[#18314F] mb-2">No hay síntomas</h3>
            <p className="text-gray-600">
              {activeFilter === 'pending' && 'No hay síntomas pendientes de revisión'}
              {activeFilter === 'reviewed' && 'No hay síntomas revisados'}
              {activeFilter === 'all' && 'Tu equipo no ha reportado síntomas'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredSymptoms.map((symptom) => {
              const statusBadge = getStatusBadge(symptom);
              const severityBadge = getSeverityBadge(symptom.severity);
              
              const isReviewed = symptom.is_reviewed === true;
              
              return (
                <div key={symptom.id} className={`p-4 transition-colors ${isReviewed ? 'bg-gray-50/50' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center justify-between gap-4">
                    {/* Contenido principal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {isReviewed && (
                          <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        <h3 className={`font-semibold ${isReviewed ? 'text-gray-500 line-through' : 'text-[#18314F]'}`}>
                          {symptom.symptom_type_display || symptom.symptom_type}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${severityBadge.className} rounded text-xs font-medium`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${severityBadge.dotColor}`}></span>
                          {severityBadge.label}
                        </span>
                        <span className={`px-2 py-0.5 ${statusBadge.className} rounded text-xs font-medium`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      {symptom.description && (
                        <p className={`text-sm mb-1.5 ${isReviewed ? 'text-gray-400' : 'text-gray-600'}`}>{symptom.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          ID: {symptom.employee}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(symptom.reported_at).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    {!symptom.is_reviewed && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleReviewSymptom(symptom)}
                          className="bg-[#18314F] hover:bg-[#18314F]/90 text-white font-medium py-1.5 px-3 rounded-lg transition-colors text-sm"
                        >
                          Revisar
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await symptomService.reviewSymptom(symptom.id, {
                                status: 'reviewed',
                                reviewer_notes: 'Revisado y atendido'
                              });
                              toast.success('Síntoma marcado como atendido');
                              await loadSymptoms();
                              window.dispatchEvent(new CustomEvent('symptoms-updated'));
                            } catch (error) {
                              console.error('Error al marcar síntoma:', error);
                              toast.error('Error al marcar síntoma');
                            }
                          }}
                          className="bg-[#18314F] hover:bg-[#18314F]/90 text-white font-medium py-1.5 px-3 rounded-lg transition-colors text-sm"
                        >
                          Atendido
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await symptomService.reviewSymptom(symptom.id, {
                                status: 'dismissed',
                                reviewer_notes: 'No requiere atención'
                              });
                              toast.success('Síntoma descartado');
                              await loadSymptoms();
                              window.dispatchEvent(new CustomEvent('symptoms-updated'));
                            } catch (error) {
                              console.error('Error al descartar síntoma:', error);
                              toast.error('Error al descartar síntoma');
                            }
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-3 rounded-lg transition-colors text-sm"
                        >
                          Descartar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Notas del revisor */}
                  {symptom.reviewer_notes && (
                    <div className="mt-3 bg-[#18314F]/5 border-l-2 border-[#18314F] p-3 rounded-r">
                      <p className="text-xs font-medium text-[#18314F] mb-0.5">Notas de revisión:</p>
                      <p className="text-sm text-gray-600">{symptom.reviewer_notes}</p>
                      {symptom.reviewed_at && (
                        <p className="text-xs text-gray-400 mt-1">
                          Revisado el {new Date(symptom.reviewed_at).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Revisar Síntoma"
      >
        <div className="space-y-4">
          {selectedSymptom && (
            <>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-[#18314F] mb-2">
                  {selectedSymptom.symptom_type_display || selectedSymptom.symptom_type}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{selectedSymptom.description}</p>
                <p className="text-xs text-gray-500">
                  Reportado el {new Date(selectedSymptom.reported_at).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado de revisión
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setReviewStatus('reviewed')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      reviewStatus === 'reviewed'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Revisado
                  </button>
                  <button
                    onClick={() => setReviewStatus('dismissed')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      reviewStatus === 'dismissed'
                        ? 'bg-gray-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Descartar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notas de revisión
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#18314F] focus:ring-2 focus:ring-[#18314F]/20 transition-all"
                  placeholder="Escribe tus observaciones sobre este síntoma..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="flex-1 py-3 px-4 bg-[#18314F] hover:bg-[#18314F]/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Revisión'}
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
