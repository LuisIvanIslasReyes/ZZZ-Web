/**
 * Employee Alerts Page
 * Vista de alertas y notificaciones del empleado
 * Diseño ZZZ Admin Style
 */

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { alertService } from '../../services';
import { LoadingSpinner } from '../../components/common';
import { AlertWorkflowModal } from '../../components/alerts';
import type { FatigueAlert, AlertStatus } from '../../types';

export function EmployeeAlertsPage() {
  const [alerts, setAlerts] = useState<FatigueAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<FatigueAlert | null>(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setIsLoading(true);
      // Obtener alertas de los últimos 30 días
      const data = await alertService.getRecentAlerts(720);
      
      // Mapear campos del backend a formato del frontend
      const mappedAlerts = data.map(alert => ({
        ...alert,
        status: (alert.is_resolved ? 'resolved' : 'pending') as AlertStatus,
        fatigue_score: alert.fatigue_index || alert.fatigue_score || 0
      }));
      
      setAlerts(mappedAlerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast.error('Error al cargar las alertas');
    } finally {
      setIsLoading(false);
    }
  };

  const getAlertTypeLabel = (alertType: string) => {
    // Normalizar el tipo a minúsculas y con guiones bajos
    const normalizedType = alertType.toLowerCase().replace(/\s+/g, '_');
    
    switch (normalizedType) {
      case 'notification':
      case 'team_notification':
        return 'Notificación de tu Supervisor';
      case 'high_fatigue':
      case 'fatigue_high':
        return 'Nivel Alto de Fatiga';
      case 'fatigue_critical':
        return 'Fatiga Crítica';
      case 'fatigue_medium':
      case 'fatigue_moderate':
        return 'Fatiga Moderada';
      case 'combined_fatigue_hr':
        return 'Fatiga y Ritmo Cardíaco';
      case 'heart_rate_very_high':
        return 'Ritmo Cardíaco Muy Alto';
      case 'low_spo2':
        return 'Oxigenación Baja';
      case 'high_hr':
        return 'Ritmo Cardíaco Elevado';
      case 'symptom_report':
        return 'Reporte de Síntoma';
      case 'symptom_reviewed':
        return 'Síntoma Revisado por Supervisor';
      case 'symptom_severe':
        return 'Síntoma Severo Detectado';
      case 'symptom_moderate':
        return 'Síntoma Moderado';
      case 'symptom_mild':
        return 'Síntoma Leve';
      case 'device_disconnected':
        return 'Dispositivo Desconectado';
      case 'device_battery_low':
        return 'Batería Baja del Dispositivo';
      case 'break_required':
        return 'Es Hora de un Descanso';
      case 'overtime_alert':
        return 'Exceso de Horas de Trabajo';
      default:
        return normalizedType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#DC2626">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'medium':
        return (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#F59E0B">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStatusBadge = (status: string, isResolved?: boolean) => {
    if (isResolved || status === 'resolved') {
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Resuelta</span>;
    }
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Pendiente</span>;
      case 'acknowledged':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Reconocida</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'resolved') return alert.status === 'resolved';
    if (filterStatus === 'unresolved') return alert.status !== 'resolved';
    return alert.status === filterStatus;
  });

  const pendingCount = alerts.filter(a => a.status === 'pending').length;
  const acknowledgedCount = alerts.filter(a => a.status === 'acknowledged').length;
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;
  const criticalCount = alerts.filter(a => a.status !== 'resolved' && (a.severity === 'critical' || a.severity === 'high')).length;

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Cargando alertas..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#18314F] mb-1">Mis Alertas y Notificaciones</h1>
        <p className="text-lg text-[#18314F]/70">Revisa las alertas de salud y notificaciones de tu supervisor</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-semibold">Críticas</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#DC2626">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span className={`text-3xl font-bold ${criticalCount > 0 ? 'text-red-600' : 'text-[#18314F]'}`}>
            {criticalCount}
          </span>
          <p className="text-sm text-gray-500 mt-1">Requieren atención</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-semibold">Pendientes</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#F59E0B">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-yellow-600">{pendingCount}</span>
          <p className="text-sm text-gray-500 mt-1">Sin revisar</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-semibold">Reconocidas</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-blue-600">{acknowledgedCount}</span>
          <p className="text-sm text-gray-500 mt-1">En seguimiento</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-semibold">Resueltas</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#22C55E">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-green-600">{resolvedCount}</span>
          <p className="text-sm text-gray-500 mt-1">Completadas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-[#18314F] mb-4">Filtrar alertas</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              filterStatus === 'all' ? 'bg-[#18314F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              filterStatus === 'pending' ? 'bg-[#18314F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilterStatus('acknowledged')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              filterStatus === 'acknowledged' ? 'bg-[#18314F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Reconocidas
          </button>
          <button
            onClick={() => setFilterStatus('resolved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              filterStatus === 'resolved' ? 'bg-[#18314F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Resueltas
          </button>
          <button
            onClick={() => setFilterStatus('unresolved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              filterStatus === 'unresolved' ? 'bg-[#18314F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sin Resolver
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="mx-auto mb-4" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#18314F">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-semibold text-[#18314F] mb-2">¡Todo bien!</h3>
            <p className="text-gray-500">No tienes alertas con los filtros seleccionados</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isSymptomAlert = alert.alert_type?.startsWith('symptom_');
            const isNotification = alert.alert_type === 'notification';

            // Limpiar mensaje y extraer comentarios del supervisor
            let cleanMessage = (alert.message || '').replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|\u2705|\ud83d\udcdd|\ud83d\udd14|\u26a0\ufe0f|\u274c|\u2714\ufe0f|\ud83d\udccb/gu, '').trim();
            let supervisorComments = '';
            
            // Extraer comentarios del supervisor si existen (con o sin emoji)
            const commentsMatch = cleanMessage.match(/Comentarios del supervisor:\s*(.+?)(?:\n|$)/is);
            if (commentsMatch) {
              supervisorComments = commentsMatch[1].trim();
              // Remover "Comentarios del supervisor:" y todo lo que le sigue del mensaje principal
              cleanMessage = cleanMessage.replace(/Comentarios del supervisor:[\s\S]*/i, '').trim();
            }

            // Universal card style for all alerts, with special blue for symptom alerts
            return (
              <div
                key={alert.id}
                className={`rounded-xl shadow-md border border-gray-200 p-6 border-l-4 transition-all hover:shadow-lg
                  ${isSymptomAlert
                    ? 'border-l-[#18314F] bg-white'
                    : isNotification
                    ? 'border-l-indigo-600 bg-gradient-to-r from-indigo-50 via-purple-50 to-white'
                    : alert.severity === 'critical' || alert.severity === 'high'
                    ? 'border-l-red-500 bg-white'
                    : alert.severity === 'medium'
                    ? 'border-l-yellow-500 bg-white'
                    : 'border-l-blue-500 bg-white'}
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Header: Icon + Title + Status */}
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      {!isSymptomAlert && !isNotification && getSeverityIcon(alert.severity)}
                      <h3 className={`text-xl font-semibold ${isSymptomAlert ? 'text-[#18314F]' : isNotification ? 'text-indigo-900' : 'text-[#18314F]'}`}>
                        {getAlertTypeLabel(alert.alert_type || 'unknown')}
                      </h3>
                      <span className={`text-sm font-semibold ${
                        alert.severity === 'critical' || alert.severity === 'high' ? 'text-red-600' :
                        alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`}>
                        {alert.severity === 'critical' ? 'Crítico' :
                         alert.severity === 'high' ? 'Alto' :
                         alert.severity === 'medium' ? 'Moderado' : 'Bajo'}
                      </span>
                      {!isSymptomAlert && getStatusBadge(alert.status || 'pending')}
                    </div>

                    {/* Message */}
                    <p className={`mb-2 text-base leading-relaxed whitespace-pre-line ${isSymptomAlert ? 'text-[#18314F] font-medium' : 'text-gray-700'}`}>
                      {cleanMessage}
                    </p>

                    {/* Comentarios del supervisor - Debajo del mensaje para alertas de síntomas */}
                    {isSymptomAlert && supervisorComments && (
                      <div className="mb-4 mt-2">
                        <p className="text-sm font-bold text-gray-900">
                          Comentarios del supervisor: <span className="font-normal text-gray-700">{supervisorComments}</span>
                        </p>
                      </div>
                    )}

                    {/* Date and Fatigue Score */}
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{new Date(alert.created_at || new Date()).toLocaleString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                      {!isNotification && alert.fatigue_score && alert.fatigue_score > 0 && (
                        <div className="flex items-center gap-2">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span>Índice de fatiga: {alert.fatigue_score.toFixed(1)}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[200px]">
                    {/* Estado: Resuelta - Esquina superior derecha para síntomas */}
                    {isSymptomAlert && (alert.is_resolved || alert.status === 'resolved') && (
                      <div className="flex items-center justify-end gap-2 text-green-600">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <div className="text-right">
                          <p className="text-base font-bold">Resuelta</p>
                          {alert.resolved_at && (
                            <p className="text-sm text-green-500">
                              {new Date(alert.resolved_at).toLocaleDateString('es-ES')}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Alerta no resuelta - Vista de empleado */}
                    {!alert.is_resolved && alert.status !== 'resolved' && !isSymptomAlert && (
                      <div className="space-y-3">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                          <p className="text-sm font-bold text-orange-800 mb-1">En Espera</p>
                          <p className="text-xs text-orange-600 leading-relaxed">
                            Tu supervisor será notificado y gestionará esta alerta
                          </p>
                        </div>
                        {alert.recommendations && (
                          <div className="bg-[#18314F]/5 border border-[#18314F]/20 rounded-lg p-3">
                            <p className="text-xs font-semibold text-[#18314F] mb-1">Recomendación:</p>
                            <p className="text-xs text-gray-700">{alert.recommendations}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Estado: Resuelta - Para alertas no relacionadas con síntomas */}
                    {!isSymptomAlert && (alert.is_resolved || alert.status === 'resolved') && (
                      <div className="flex items-center gap-2 text-green-600">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <p className="text-sm font-bold">Resuelta</p>
                          {alert.resolved_at && (
                            <p className="text-xs text-green-500">
                              {new Date(alert.resolved_at).toLocaleDateString('es-ES')}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Alert Workflow Modal */}
      <AlertWorkflowModal
        isOpen={isWorkflowModalOpen}
        onClose={() => {
          setIsWorkflowModalOpen(false);
          setSelectedAlert(null);
        }}
        alert={selectedAlert}
        onUpdate={loadAlerts}
      />
    </div>
  );
}
