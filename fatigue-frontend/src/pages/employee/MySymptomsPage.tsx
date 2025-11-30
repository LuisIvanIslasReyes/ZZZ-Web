/**
 * My Symptoms Page
 * Página para empleados: Ver y reportar síntomas
 */

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { symptomService } from '../../services';
import { LoadingSpinner, ReportSymptomModal, MedicalAlertModal } from '../../components/common';
import type { Symptom } from '../../types';

export function MySymptomsPage() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'reviewed'>('all');
  const [showMedicalAlert, setShowMedicalAlert] = useState(false);
  const [severeSymptomName, setSevereSymptomName] = useState('');

  useEffect(() => {
    loadSymptoms();
  }, []);

  const loadSymptoms = async () => {
    try {
      setIsLoading(true);
      const data = await symptomService.getMySymptoms();
      setSymptoms(data);
    } catch (error) {
      console.error('Error loading symptoms:', error);
      setSymptoms([]);
      toast.error('Error al cargar síntomas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSymptomReported = (reportedSymptom?: { type: string; severity: string }) => {
    loadSymptoms(); // Recargar la lista después de reportar
    // Notificar al MainLayout para actualizar el badge
    window.dispatchEvent(new CustomEvent('symptoms-updated'));
    
    // Si el síntoma es severo, mostrar alerta médica
    if (reportedSymptom && reportedSymptom.severity === 'severe') {
      setSevereSymptomName(reportedSymptom.type);
      setShowMedicalAlert(true);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'En Espera', className: 'bg-yellow-100 text-yellow-800' };
      case 'reviewed':
        return { label: 'Revisado', className: 'bg-green-100 text-green-800' };
      case 'dismissed':
        return { label: 'Descartado', className: 'bg-gray-100 text-gray-800' };
      default:
        return { label: status, className: 'bg-blue-100 text-blue-800' };
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
    return <LoadingSpinner size="lg" text="Cargando síntomas..." />;
  }

  // Estadísticas
  const pendingSymptoms = symptoms.filter(s => s.status === 'pending');
  const reviewedSymptoms = symptoms.filter(s => s.status === 'reviewed');
  const dismissedSymptoms = symptoms.filter(s => s.status === 'dismissed');
  
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
          <h1 className="text-3xl font-bold text-[#18314F]">Mis Síntomas</h1>
          <p className="text-gray-600 mt-1">Historial de síntomas reportados</p>
        </div>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center gap-2 bg-[#18314F] hover:bg-[#18314F]/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Reportar Síntoma
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Total</p>
              <p className="text-3xl font-bold text-[#18314F]">{stats.total}</p>
            </div>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">En Espera</p>
              <p className="text-3xl font-bold text-[#18314F]">{stats.pending}</p>
            </div>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#F59E0B">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Revisados</p>
              <p className="text-3xl font-bold text-[#18314F]">{stats.reviewed}</p>
            </div>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#22C55E">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Descartados</p>
              <p className="text-3xl font-bold text-[#18314F]">{stats.dismissed}</p>
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
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-[#18314F] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            activeFilter === 'pending'
              ? 'bg-[#18314F] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          En Espera
        </button>
        <button
          onClick={() => setActiveFilter('reviewed')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
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
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-2xl font-semibold text-[#18314F] mb-2">No hay síntomas</h3>
            <p className="text-gray-600">
              {activeFilter === 'pending' && 'No tienes síntomas pendientes de revisión'}
              {activeFilter === 'reviewed' && 'No tienes síntomas revisados'}
              {activeFilter === 'all' && 'No has reportado ningún síntoma aún'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredSymptoms.map((symptom) => {
              const statusBadge = getStatusBadge(symptom.status);
              const severityBadge = getSeverityBadge(symptom.severity);
              
              return (
                <div key={symptom.id} className={`p-6 hover:bg-gray-50 transition-colors ${severityBadge.className}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#18314F]">
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
                  </div>

                  {/* Notas del revisor */}
                  {symptom.reviewer_notes && (
                    <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <div className="flex items-start gap-2">
                        <svg width="20" height="20" className="text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-blue-900 mb-1">Notas del revisor:</p>
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

      {/* Report Symptom Modal */}
      <ReportSymptomModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={handleSymptomReported}
      />

      {/* Medical Alert Modal - Se muestra automáticamente para síntomas severos */}
      <MedicalAlertModal
        isOpen={showMedicalAlert}
        onClose={() => setShowMedicalAlert(false)}
        symptomName={severeSymptomName}
      />
    </div>
  );
}
