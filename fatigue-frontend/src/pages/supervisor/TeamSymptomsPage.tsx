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
      <div>
        <h1 className="text-3xl font-bold text-[#18314F] mb-1">Síntomas del Equipo</h1>
        <p className="text-gray-600">Gestión y seguimiento de síntomas del equipo</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-4xl font-bold text-gray-900 mb-1">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-4xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
          <div className="text-sm text-gray-600">Por revisar</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-4xl font-bold text-gray-900 mb-1">{stats.reviewed}</div>
          <div className="text-sm text-gray-600">Revisados</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-[#18314F] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'pending'
              ? 'bg-[#18314F] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setActiveFilter('reviewed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'reviewed'
              ? 'bg-[#18314F] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          Revisados
        </button>
      </div>

      {/* Symptoms List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredSymptoms.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm text-gray-600">
              {activeFilter === 'pending' && 'No hay síntomas pendientes de revisión'}
              {activeFilter === 'reviewed' && 'No hay síntomas revisados'}
              {activeFilter === 'all' && 'No hay síntomas reportados'}
            </p>
          </div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Síntoma</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-32">Severidad</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-32">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-28">Empleado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-44">Fecha y Hora</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-56">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {filteredSymptoms.map((symptom) => {
              const statusBadge = getStatusBadge(symptom);
              const severityBadge = getSeverityBadge(symptom.severity);
              
              const isReviewed = symptom.is_reviewed === true;
              
              return (
                <tr key={symptom.id} className={isReviewed ? 'bg-gray-50' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      {isReviewed && (
                        <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <div className="min-w-0">
                        <p className={`text-sm font-medium ${isReviewed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {symptom.symptom_type_display || symptom.symptom_type}
                        </p>
                        {symptom.description && (
                          <p className="text-xs text-gray-500 mt-1 break-words">{symptom.description}</p>
                        )}
                        {symptom.reviewer_notes && (
                          <p className="text-xs text-blue-600 mt-1 italic break-words">Nota: {symptom.reviewer_notes}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 ${severityBadge.className} rounded text-xs font-medium`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${severityBadge.dotColor}`}></span>
                      {severityBadge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 ${statusBadge.className} rounded text-xs font-medium`}>
                      {statusBadge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ID: {symptom.employee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {symptom.created_at ? (() => {
                      const date = new Date(symptom.created_at);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      const hours = String(date.getHours()).padStart(2, '0');
                      const minutes = String(date.getMinutes()).padStart(2, '0');
                      return `${year}-${month}-${day} ${hours}:${minutes}:00`;
                    })() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!symptom.is_reviewed ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReviewSymptom(symptom)}
                          className="text-[#18314F] hover:text-[#18314F]/80"
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
                          className="text-green-600 hover:text-green-800"
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
                          className="text-red-600 hover:text-red-800"
                        >
                          Descartar
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        {symptom.reviewed_at ? `Revisado ${new Date(symptom.reviewed_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}` : 'Completado'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
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
