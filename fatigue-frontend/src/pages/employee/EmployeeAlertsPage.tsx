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
    switch (alertType) {
      case 'notification':
        return '📢 Notificación de tu Supervisor';
      case 'high_fatigue':
      case 'fatigue_high':
        return '⚠️ Nivel Alto de Fatiga';
      case 'fatigue_critical':
        return '🚨 Fatiga Crítica';
      case 'fatigue_medium':
      case 'fatigue_moderate':
        return '⚠️ Fatiga Moderada';
      case 'combined_fatigue_hr':
        return '🔴 Fatiga y Ritmo Cardíaco Combinados';
      case 'heart_rate_very_high':
        return '❤️ Ritmo Cardíaco Muy Alto';
      case 'low_spo2':
        return '🫁 Oxigenación Baja';
      case 'high_hr':
        return '❤️ Ritmo Cardíaco Elevado';
      case 'symptom_severe':
        return '🩺 Síntoma Severo Detectado';
      case 'symptom_moderate':
        return '🩺 Síntoma Moderado';
      case 'symptom_mild':
        return '🩺 Síntoma Leve';
      case 'device_disconnected':
        return '📱 Dispositivo Desconectado';
      case 'device_battery_low':
        return '🔋 Batería Baja del Dispositivo';
      case 'break_required':
        return '☕ Es Hora de un Descanso';
      case 'overtime_alert':
        return '⏰ Exceso de Horas de Trabajo';
      default:
        return alertType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">✓ Resuelta</span>;
    }
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">⚠ Pendiente</span>;
      case 'acknowledged':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">👁 Reconocida</span>;
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
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Críticas</span>
            <span className="bg-red-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#DC2626">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
          </div>
          <span className={`text-4xl font-bold ${criticalCount > 0 ? 'text-red-600' : 'text-[#18314F]'}`}>
            {criticalCount}
          </span>
          <p className="text-sm text-gray-500 mt-1">Requieren atención</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Pendientes</span>
            <span className="bg-yellow-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#F59E0B">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <span className="text-4xl font-bold text-yellow-600">{pendingCount}</span>
          <p className="text-sm text-gray-500 mt-1">Sin revisar</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Reconocidas</span>
            <span className="bg-blue-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </span>
          </div>
          <span className="text-4xl font-bold text-blue-600">{acknowledgedCount}</span>
          <p className="text-sm text-gray-500 mt-1">En seguimiento</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Resueltas</span>
            <span className="bg-green-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#22C55E">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <span className="text-4xl font-bold text-green-600">{resolvedCount}</span>
          <p className="text-sm text-gray-500 mt-1">Completadas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-[#18314F] mb-4">Filtrar alertas</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
              filterStatus === 'all' ? 'bg-[#18314F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
              filterStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilterStatus('acknowledged')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
              filterStatus === 'acknowledged' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Reconocidas
          </button>
          <button
            onClick={() => setFilterStatus('resolved')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
              filterStatus === 'resolved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Resueltas
          </button>
          <button
            onClick={() => setFilterStatus('unresolved')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
              filterStatus === 'unresolved' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sin Resolver
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <svg className="mx-auto mb-4" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#18314F">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-semibold text-[#18314F] mb-2">¡Todo bien!</h3>
            <p className="text-gray-500">No tienes alertas con los filtros seleccionados</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isNotification = alert.alert_type === 'notification';
            
            return (
              <div 
                key={alert.id} 
                className={`rounded-2xl shadow-lg p-6 border-l-8 transition-all hover:shadow-xl ${
                  isNotification 
                    ? 'border-indigo-600 bg-gradient-to-r from-indigo-50 via-purple-50 to-white shadow-indigo-200/50' 
                    : alert.severity === 'critical' || alert.severity === 'high' 
                    ? 'border-red-500 bg-white' 
                    : alert.severity === 'medium' 
                    ? 'border-yellow-500 bg-white' 
                    : 'border-blue-500 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {isNotification && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-md">
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-bold text-sm">Mensaje de tu Supervisor</span>
                        </div>
                        {alert.title && (
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded-full text-xs font-semibold">
                            {alert.title}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      {!isNotification && getSeverityIcon(alert.severity)}
                      <h3 className={`text-xl font-semibold ${isNotification ? 'text-indigo-900' : 'text-[#18314F]'}`}>
                        {getAlertTypeLabel(alert.alert_type || 'unknown')}
                      </h3>
                      {getStatusBadge(alert.status || 'pending')}
                    </div>
                    
                    {isNotification ? (
                      <div className="bg-white rounded-xl p-4 border-2 border-indigo-200 shadow-sm mb-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#4F46E5">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-indigo-900 font-medium text-base leading-relaxed whitespace-pre-line">
                              {alert.message}
                            </p>
                            {alert.supervisor_name && (
                              <p className="text-indigo-600 text-sm mt-2 font-medium">
                                — {alert.supervisor_name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 mb-4 text-base leading-relaxed whitespace-pre-line">
                        {alert.message}
                      </p>
                    )}
                    
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
                    {/* Alerta no resuelta - Vista de empleado */}
                    {!alert.is_resolved && alert.status !== 'resolved' && (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-orange-700 mb-2 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Pendiente de Supervisión
                        </div>
                        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 text-center">
                          <svg className="w-12 h-12 mx-auto text-orange-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <p className="text-sm font-bold text-orange-900 mb-1">⏳ En Espera</p>
                          <p className="text-xs text-orange-700 leading-relaxed">
                            Tu supervisor será notificado y gestionará esta alerta
                          </p>
                        </div>
                        {alert.recommendations && (
                          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3">
                            <p className="text-xs font-semibold text-blue-900 mb-1">💡 Recomendación:</p>
                            <p className="text-xs text-blue-700">{alert.recommendations}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Estado: Resuelta */}
                    {(alert.is_resolved || alert.status === 'resolved') && (
                      <div className="text-center bg-green-50 rounded-xl p-4 border-2 border-green-200">
                        <div className="bg-green-500 rounded-full p-3 inline-block mb-2">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm text-green-700 font-bold">✓ Resuelta</p>
                        <p className="text-xs text-green-600 mt-1">
                          {alert.resolved_at && new Date(alert.resolved_at).toLocaleDateString('es-ES')}
                        </p>
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
