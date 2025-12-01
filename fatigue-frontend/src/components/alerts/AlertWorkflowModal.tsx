/**
 * Alert Workflow Modal Component
 * Modal especializado para gestionar el flujo completo de alertas
 * con transiciones de estado, notas y acciones - Enterprise UI Design
 */

import { useState } from 'react';
import toast from 'react-hot-toast';
import { alertService } from '../../services';
import type { FatigueAlert, AlertStatus } from '../../types';

interface AlertWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: FatigueAlert | null;
  onUpdate: () => void;
}

export function AlertWorkflowModal({
  isOpen,
  onClose,
  alert,
  onUpdate,
}: AlertWorkflowModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAction, setSelectedAction] = useState<AlertStatus | null>(null);

  if (!isOpen || !alert) return null;

  const handleAction = async (action: 'acknowledge' | 'resolve') => {
    try {
      setIsProcessing(true);
      
      if (action === 'acknowledge') {
        await alertService.acknowledgeAlert(alert.id);
        toast.success('Alerta reconocida exitosamente');
      } else if (action === 'resolve') {
        await alertService.resolveAlert(alert.id);
        toast.success('Alerta resuelta exitosamente');
      }
      
      onUpdate();
      onClose();
      setSelectedAction(null);
    } catch (error: any) {
      console.error('Error processing alert action:', error);
      const errorMsg = error?.response?.data?.error || error?.message || 'Error al procesar la acción';
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const getSeverityInfo = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { label: 'Crítica', color: '#DC2626', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
      case 'high':
        return { label: 'Alta', color: '#F59E0B', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
      case 'medium':
        return { label: 'Media', color: '#EAB308', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
      default:
        return { label: 'Baja', color: '#3B82F6', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pendiente', color: 'text-yellow-700', bgColor: 'bg-yellow-100' };
      case 'acknowledged':
        return { label: 'Reconocida', color: 'text-blue-700', bgColor: 'bg-blue-100' };
      case 'resolved':
        return { label: 'Resuelta', color: 'text-green-700', bgColor: 'bg-green-100' };
      case 'dismissed':
        return { label: 'Descartada', color: 'text-gray-700', bgColor: 'bg-gray-100' };
      default:
        return { label: status, color: 'text-gray-700', bgColor: 'bg-gray-100' };
    }
  };

  const severityInfo = getSeverityInfo(alert.severity);
  const statusInfo = getStatusInfo(alert.status);

  // Determinar acciones disponibles según el estado actual
  const availableActions = (() => {
    const actions = [];
    
    if (!alert.is_acknowledged && !alert.is_resolved) {
      actions.push({
        key: 'acknowledge',
        label: 'Reconocer Alerta',
        description: 'Marcar como vista y en seguimiento',
        color: '#3B82F6',
        nextStatus: 'acknowledged',
      });
    }
    
    if (!alert.is_resolved) {
      actions.push({
        key: 'resolve',
        label: 'Resolver Alerta',
        description: 'Marcar como resuelta - problema atendido',
        color: '#22C55E',
        nextStatus: 'resolved',
      });
    }

    return actions;
  })();

  // Formatear el score de fatiga
  const formatFatigueScore = (score: number) => {
    return Number(score).toFixed(1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#18314F] text-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Gestión de Alerta #{alert.id}</h2>
                <p className="text-white/70 text-sm">Revisa y gestiona esta alerta</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
              disabled={isProcessing}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Alert Info Card */}
          <div className={`${severityInfo.bgColor} ${severityInfo.borderColor} border rounded-xl p-5`}>
            <div className="flex items-start gap-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${severityInfo.color}20` }}
              >
                <svg className="w-5 h-5" style={{ color: severityInfo.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h3 className="text-lg font-bold" style={{ color: severityInfo.color }}>
                    Alerta de Severidad {severityInfo.label}
                  </h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{alert.message}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(alert.created_at).toLocaleString('es-ES')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Employee & Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Empleado</div>
              <div className="text-lg font-bold text-[#18314F]">
                {alert.employee_name || `ID: ${alert.employee}`}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Score de Fatiga</div>
              <div className="flex items-baseline gap-1">
                <span 
                  className="text-2xl font-bold"
                  style={{ 
                    color: alert.fatigue_score >= 70 ? '#DC2626' : 
                           alert.fatigue_score >= 50 ? '#F59E0B' : '#22C55E' 
                  }}
                >
                  {formatFatigueScore(alert.fatigue_score)}
                </span>
                <span className="text-sm text-gray-400">/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div 
                  className="h-1.5 rounded-full transition-all"
                  style={{ 
                    width: `${Math.min(alert.fatigue_score, 100)}%`,
                    backgroundColor: alert.fatigue_score >= 70 ? '#DC2626' : 
                                     alert.fatigue_score >= 50 ? '#F59E0B' : '#22C55E'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          {(alert.heart_rate || alert.spo2 || alert.temperature) && (
            <div className="grid grid-cols-3 gap-3">
              {alert.heart_rate && (
                <div className="bg-red-50 rounded-xl p-3 text-center">
                  <svg className="w-5 h-5 mx-auto text-red-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <div className="text-xl font-bold text-red-600">{alert.heart_rate}</div>
                  <div className="text-xs text-gray-500">bpm</div>
                </div>
              )}
              {alert.spo2 && (
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <svg className="w-5 h-5 mx-auto text-blue-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <div className="text-xl font-bold text-blue-600">{alert.spo2}%</div>
                  <div className="text-xs text-gray-500">SpO2</div>
                </div>
              )}
              {alert.temperature && (
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <svg className="w-5 h-5 mx-auto text-orange-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div className="text-xl font-bold text-orange-600">{alert.temperature}°C</div>
                  <div className="text-xs text-gray-500">Temp.</div>
                </div>
              )}
            </div>
          )}

          {/* Workflow Actions */}
          {availableActions.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-[#18314F] mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Flujo de Gestión - Selecciona una Acción
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {availableActions.map((action) => (
                  <button
                    key={action.key}
                    onClick={() => setSelectedAction(action.nextStatus as AlertStatus)}
                    className={`
                      p-4 rounded-xl border-2 transition-all text-left
                      ${selectedAction === action.nextStatus 
                        ? 'border-[#18314F] bg-[#18314F]/5 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                    disabled={isProcessing}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: action.color }}
                      >
                        {action.key === 'acknowledge' ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#18314F] text-sm">{action.label}</h4>
                        <p className="text-xs text-gray-500">{action.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No actions message */}
          {availableActions.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <svg className="w-12 h-12 text-green-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-green-800 mb-1">Alerta procesada</h3>
              <p className="text-sm text-green-600">No hay acciones adicionales disponibles.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            disabled={isProcessing}
          >
            Cancelar
          </button>
          
          {selectedAction && (
            <button
              onClick={() => {
                const action = availableActions.find(a => a.nextStatus === selectedAction);
                if (action) {
                  handleAction(action.key as 'acknowledge' | 'resolve');
                }
              }}
              className="px-5 py-2.5 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirmar Acción
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
