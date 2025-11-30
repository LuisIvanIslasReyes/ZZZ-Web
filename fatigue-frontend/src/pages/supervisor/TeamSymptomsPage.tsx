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
      await symptomService.reviewSymptom(selectedSymptom.id, {
        status: reviewStatus,
        reviewer_notes: reviewNotes
      });
      toast.success('Síntoma revisado exitosamente');
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
        return { label: 'Leve', className: 'bg-green-100 text-green-800 border-l-4 border-green-500' };
      case 'medium':
      case 'moderate':
        return { label: 'Moderado', className: 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500' };
      case 'high':
      case 'severe':
        return { label: 'Severo', className: 'bg-red-100 text-red-800 border-l-4 border-red-500' };
      default:
        return { label: 'Desconocido', className: 'bg-blue-100 text-blue-800 border-l-4 border-blue-500' };
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Cargando síntomas del equipo..." />;
  }

  // Estadísticas (usar is_reviewed del backend como fuente de verdad)
  const pendingSymptoms = symptoms.filter(s => !s.is_reviewed);
  const reviewedSymptoms = symptoms.filter(s => s.is_reviewed && s.status === 'reviewed');
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
    filteredSymptoms = [...reviewedSymptoms, ...dismissedSymptoms];
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#18314F]">Síntomas del Equipo</h1>
          <p className="text-gray-600 mt-1">Revisa y gestiona los síntomas reportados por tu equipo</p>
        </div>
        {stats.pending > 0 && (
          <div className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold animate-pulse">
            {stats.pending} pendiente{stats.pending !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-3xl font-bold text-[#18314F]">{stats.total}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">En Espera</p>
              <p className="text-3xl font-bold text-[#18314F]">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Revisados</p>
              <p className="text-3xl font-bold text-[#18314F]">{stats.reviewed}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Descartados</p>
              <p className="text-3xl font-bold text-[#18314F]">{stats.dismissed}</p>
            </div>
            <div className="bg-gray-100 rounded-full p-3">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-6 py-2 rounded-xl font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-[#18314F] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-6 py-2 rounded-xl font-medium transition-all ${
            activeFilter === 'pending'
              ? 'bg-[#18314F] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          En Espera {stats.pending > 0 && <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">{stats.pending}</span>}
        </button>
        <button
          onClick={() => setActiveFilter('reviewed')}
          className={`px-6 py-2 rounded-xl font-medium transition-all ${
            activeFilter === 'reviewed'
              ? 'bg-[#18314F] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          Revisados
        </button>
      </div>

      {/* Symptoms List */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
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
          <div className="divide-y divide-gray-200">
            {filteredSymptoms.map((symptom) => {
              const statusBadge = getStatusBadge(symptom);
              const severityBadge = getSeverityBadge(symptom.severity);
              
              const isReviewed = symptom.is_reviewed === true;
              
              return (
                <div key={symptom.id} className={`p-6 transition-colors ${severityBadge.className} ${isReviewed ? 'opacity-60 bg-gray-50' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {isReviewed && (
                          <span className="text-2xl">✓</span>
                        )}
                        <h3 className={`text-lg font-semibold ${isReviewed ? 'text-gray-600 line-through' : 'text-[#18314F]'}`}>
                          {symptom.symptom_type_display || symptom.symptom_type}
                        </h3>
                        <span className={`inline-block px-3 py-1 ${severityBadge.className} rounded-full text-xs font-semibold`}>
                          {severityBadge.label}
                        </span>
                        <span className={`inline-block px-3 py-1 ${statusBadge.className} rounded-full text-xs font-semibold`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      {symptom.description && (
                        <p className="text-gray-600 mb-3">{symptom.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Empleado ID: {symptom.employee}
                        </div>
                        <div className="flex items-center gap-1">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(symptom.reported_at).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>

                    {!symptom.is_reviewed && (
                      <div className="ml-4 flex flex-col gap-2">
                        <button
                          onClick={() => handleReviewSymptom(symptom)}
                          className="bg-[#18314F] hover:bg-[#18314F]/90 text-white font-medium py-2 px-4 rounded-xl transition-colors whitespace-nowrap"
                        >
                          ✏️ Revisar
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
                          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl transition-colors whitespace-nowrap text-sm"
                        >
                          ✅ Atendido
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
                          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-xl transition-colors whitespace-nowrap text-sm"
                        >
                          🚫 Descartar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Notas del revisor */}
                  {symptom.reviewer_notes && (
                    <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <div className="flex items-start gap-2">
                        <svg width="20" height="20" className="text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-blue-900 mb-1">Notas de revisión:</p>
                          <p className="text-sm text-blue-800">{symptom.reviewer_notes}</p>
                          {symptom.reviewed_at && (
                            <p className="text-xs text-blue-600 mt-2">
                              Revisado el {new Date(symptom.reviewed_at).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                        </div>
                      </div>
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
              <div className="bg-gray-50 p-4 rounded-xl">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de revisión
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setReviewStatus('reviewed')}
                    className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                      reviewStatus === 'reviewed'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ✓ Revisado
                  </button>
                  <button
                    onClick={() => setReviewStatus('dismissed')}
                    className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                      reviewStatus === 'dismissed'
                        ? 'bg-gray-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ✕ Descartar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas de revisión
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#18314F] focus:border-transparent"
                  placeholder="Escribe tus observaciones sobre este síntoma..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="flex-1 py-3 px-4 bg-[#18314F] hover:bg-[#18314F]/90 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
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
