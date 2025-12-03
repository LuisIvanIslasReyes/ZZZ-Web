/**
 * Supervisor Team Alerts Page
 * Gestión de alertas del equipo
 * Diseño ZZZ Admin Style
 */

import { useState, useEffect } from 'react';
import { alertService } from '../../services';
import { LoadingSpinner } from '../../components/common';
import { AlertWorkflowModal } from '../../components/alerts';
import toast from 'react-hot-toast';
import type { FatigueAlert } from '../../types';

export function SupervisorTeamAlertsPage() {
  const [alerts, setAlerts] = useState<FatigueAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<FatigueAlert | null>(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setIsLoading(true);
      const data = await alertService.getRecentAlerts(168); // Última semana
      
      // Mapear campos del backend a formato del frontend
      const mappedAlerts = data.map(alert => ({
        ...alert,
        status: alert.is_resolved ? 'resolved' : alert.is_acknowledged ? 'acknowledged' : 'pending',
        fatigue_score: alert.fatigue_index || alert.fatigue_score || 0
      }));
      
      setAlerts(mappedAlerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast.error('Error al cargar alertas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageAlert = (alert: FatigueAlert) => {
    setSelectedAlert(alert);
    setIsWorkflowModalOpen(true);
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'Crítico';
      case 'high':
        return 'Alto';
      case 'medium':
      case 'moderate':
        return 'Moderado';
      case 'low':
        return 'Bajo';
      default:
        return 'Desconocido';
    }
  };

  const getAlertTypeLabel = (alertType: string) => {
    // Normalizar el tipo a minúsculas y con guiones bajos
    const normalizedType = alertType.toLowerCase().replace(/\s+/g, '_');
    
    switch (normalizedType) {
      case 'notification':
      case 'team_notification':
        return 'Notificación del Equipo';
      case 'symptom_report':
        return 'Reporte de Síntoma';
      case 'fatigue_low':
        return 'Fatiga Baja';
      case 'fatigue_medium':
      case 'fatigue_moderate':
        return 'Fatiga Moderada';
      case 'fatigue_high':
      case 'high_fatigue':
        return 'Fatiga Alta';
      case 'fatigue_critical':
        return 'Fatiga Crítica';
      case 'combined_fatigue_hr':
        return 'Fatiga y Ritmo Cardíaco';
      case 'heart_rate_very_high':
      case 'high_hr':
      case 'heart_rate_high':
        return 'Ritmo Cardíaco Alto';
      case 'symptom_reviewed':
        return 'Síntoma Revisado por Supervisor';
      case 'symptom_severe':
        return 'Síntoma Severo';
      case 'symptom_moderate':
        return 'Síntoma Moderado';
      case 'symptom_mild':
        return 'Síntoma Leve';
      case 'device_disconnected':
        return 'Dispositivo Desconectado';
      case 'device_battery_low':
        return 'Batería Baja';
      case 'break_required':
        return 'Descanso Requerido';
      case 'overtime_alert':
        return 'Alerta de Horas Extras';
      case 'low_spo2':
        return 'Oxigenación Baja';
      default:
        return normalizedType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#DC2626">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'high':
      case 'medium':
        return (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#F59E0B">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStatusBadge = (alert: FatigueAlert) => {
    if (alert.is_resolved) {
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Resuelta</span>;
    }
    if (alert.is_acknowledged) {
      return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Reconocida</span>;
    }
    return <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">Pendiente</span>;
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    return matchesSeverity && matchesStatus;
  });

  const today = new Date().toDateString();
  const criticalCount = alerts.filter(a => (a.severity === 'critical' || a.severity === 'high') && !a.is_resolved).length;
  const pendingCount = alerts.filter(a => !a.is_resolved && !a.is_acknowledged).length;
  const acknowledgedCount = alerts.filter(a => a.is_acknowledged && !a.is_resolved).length;
  const resolvedToday = alerts.filter(a => {
    if (!a.is_resolved) return false;
    const resolvedDate = a.resolved_at ? new Date(a.resolved_at) : new Date(a.timestamp || a.created_at);
    return resolvedDate.toDateString() === today;
  }).length;

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Cargando alertas..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#18314F] mb-1">Alertas</h1>
        <p className="text-lg text-[#18314F]/70">Gestión y seguimiento de alertas del equipo</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-semibold">Alertas Críticas</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#DC2626">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-red-600">{criticalCount}</span>
          <p className="text-sm text-gray-500 mt-1">Requieren atención inmediata</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-semibold">Pendientes</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#F59E0B">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-yellow-600">{pendingCount}</span>
          <p className="text-sm text-gray-500 mt-1">Por revisar</p>
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
          <p className="text-sm text-gray-500 mt-1">En proceso</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-semibold">Resueltas Hoy</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#22C55E">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-green-600">{resolvedToday}</span>
          <p className="text-sm text-gray-500 mt-1">Completadas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="font-semibold text-[#18314F] mb-2">Filtrar por Severidad</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterSeverity('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
                  filterSeverity === 'all' ? 'bg-[#18314F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilterSeverity('critical')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
                  filterSeverity === 'critical' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Críticas
              </button>
              <button
                onClick={() => setFilterSeverity('high')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
                  filterSeverity === 'high' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Altas
              </button>
              <button
                onClick={() => setFilterSeverity('medium')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
                  filterSeverity === 'medium' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Medias
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#18314F] mb-2">Filtrar por Estado</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
                  filterStatus === 'all' ? 'bg-[#18314F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos
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
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="mx-auto mb-4" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#18314F">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-[#18314F] mb-2">No hay alertas</h3>
            <p className="text-gray-500">No se encontraron alertas con los filtros seleccionados</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            // Limpiar emojis del mensaje
            const cleanMessage = (alert.message || '').replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|✅|📝|🔔|⚠️|❌|✔️/gu, '').trim();
            const isSymptomAlert = alert.alert_type?.startsWith('symptom_');
            
            return (
            <div key={alert.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 ${
              alert.severity === 'critical' ? 'border-l-red-500' :
              alert.severity === 'high' ? 'border-l-orange-500' :
              alert.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {!isSymptomAlert && getSeverityIcon(alert.severity)}
                    <h3 className="text-lg font-semibold text-[#18314F]">
                      {getAlertTypeLabel(alert.alert_type || 'unknown')}
                    </h3>
                    <span className={`text-sm font-semibold ${
                      alert.severity === 'critical' ? 'text-red-600' :
                      alert.severity === 'high' ? 'text-orange-600' :
                      alert.severity === 'medium' || alert.severity === 'moderate' ? 'text-yellow-600' : 'text-blue-600'
                    }`}>
                      {getSeverityLabel(alert.severity)}
                    </span>
                    {getStatusBadge(alert)}
                    {alert.alert_type === 'notification' && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                        Mensaje del Equipo
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3 whitespace-pre-line">{cleanMessage.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|✅|📝|🔔|⚠️|❌|✔️|📋/gu, '').trim()}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{alert.employee_name || `Empleado #${alert.employee}`}</span>
                    </div>
                    {alert.fatigue_score > 0 && (
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>Fatiga: {alert.fatigue_score.toFixed(1)}/100</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{new Date(alert.created_at || alert.timestamp).toLocaleString('es-ES')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4 min-w-[180px]">
                  {/* Alerta pendiente - Sin reconocer */}
                  {!alert.is_acknowledged && !alert.is_resolved && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-red-700 mb-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Requiere Acción
                      </div>
                      <button
                        onClick={() => handleManageAlert(alert)}
                        className="w-full bg-[#18314F] hover:bg-[#18314F]/90 text-white font-bold py-3.5 px-4 rounded-xl transition-all text-sm shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Gestionar
                      </button>
                    </div>
                  )}
                  
                  {/* Alerta reconocida pero no resuelta */}
                  {alert.is_acknowledged && !alert.is_resolved && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        En Seguimiento
                      </div>
                      <button
                        onClick={() => handleManageAlert(alert)}
                        className="w-full bg-[#18314F] hover:bg-[#18314F]/90 text-white font-bold py-3.5 px-4 rounded-xl transition-all text-sm shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Gestionar
                      </button>
                    </div>
                  )}
                  
                  {/* Alerta resuelta */}
                  {alert.is_resolved && (
                    <div className="text-center bg-green-50 rounded-xl p-4 border-2 border-green-200">
                      <div className="bg-green-500 rounded-full p-3 inline-block mb-2">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-green-700 font-bold">Resuelta</p>
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
