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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#18314F] mb-2">Mis Síntomas</h1>
          <p className="text-lg text-[#18314F]/70">Monitorea tu salud y bienestar</p>
        </div>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-6 py-3 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">Síntomas reportados</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">En Espera</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-gray-500 mt-1">Pendientes de revisión</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Revisados</p>
              <p className="text-3xl font-bold text-green-600">{stats.reviewed}</p>
              <p className="text-xs text-gray-500 mt-1">Atendidos correctamente</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Descartados</p>
              <p className="text-3xl font-bold text-gray-600">{stats.dismissed}</p>
              <p className="text-xs text-gray-500 mt-1">Sin acción requerida</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#18314F] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos ({symptoms.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              activeFilter === 'pending'
                ? 'bg-[#18314F] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            En Espera ({stats.pending})
          </button>
          <button
            onClick={() => setActiveFilter('reviewed')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              activeFilter === 'reviewed'
                ? 'bg-[#18314F] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Revisados ({stats.reviewed + stats.dismissed})
          </button>
        </div>
      </div>

      {/* Symptoms Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          {filteredSymptoms.length === 0 ? (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-2xl font-semibold text-[#18314F] mb-2">No hay síntomas</h3>
              <p className="text-gray-600 mb-4">
                {activeFilter === 'pending' && 'No tienes síntomas pendientes de revisión'}
                {activeFilter === 'reviewed' && 'No tienes síntomas revisados'}
                {activeFilter === 'all' && 'No has reportado ningún síntoma aún'}
              </p>
              {activeFilter === 'all' && (
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-6 py-3 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-lg font-semibold transition-colors"
                >
                  Reportar mi primer síntoma
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Síntoma</th>
                    <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Severidad</th>
                    <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Fecha de Reporte</th>
                    <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Estado</th>
                    <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSymptoms.map((symptom) => {
                    const statusBadge = getStatusBadge(symptom.status);
                    const severityBadge = getSeverityBadge(symptom.severity);
                    
                    return (
                      <tr key={symptom.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-1 h-12 rounded ${
                              symptom.severity === 'severe' || symptom.severity === 'high' ? 'bg-red-500' :
                              symptom.severity === 'moderate' || symptom.severity === 'medium' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`} />
                            <div>
                              <div className="font-semibold text-[#18314F]">
                                {symptom.symptom_type_display || symptom.symptom_type}
                              </div>
                              {symptom.description && (
                                <div className="text-sm text-gray-600 mt-1 max-w-xs">
                                  {symptom.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-sm font-medium ${
                            symptom.severity === 'severe' || symptom.severity === 'high' 
                              ? 'text-red-600' :
                            symptom.severity === 'moderate' || symptom.severity === 'medium' 
                              ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {severityBadge.label}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <div className="font-medium text-[#18314F]">
                                {symptom.created_at ? new Date(symptom.created_at).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                }) : 'Fecha no disponible'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {symptom.created_at ? new Date(symptom.created_at).toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : '--:--'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${statusBadge.className}`}>
                            {symptom.status === 'pending' && (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            {symptom.status === 'reviewed' && (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            {symptom.status === 'dismissed' && (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {symptom.reviewer_notes ? (
                            <div className="max-w-xs">
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-blue-900 mb-1">Nota del revisor</p>
                                    <p className="text-xs text-blue-800 leading-relaxed">{symptom.reviewer_notes}</p>
                                    {symptom.reviewed_at && (
                                      <p className="text-xs text-blue-600 mt-2">
                                        {new Date(symptom.reviewed_at).toLocaleDateString('es-ES', {
                                          day: '2-digit',
                                          month: 'short',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Sin notas</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
