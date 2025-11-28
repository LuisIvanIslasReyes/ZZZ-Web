/**
 * Alert Workflow Modal Component
 * Modal especializado para gestionar el flujo completo de alertas
 * con transiciones de estado, notas y acciones
 */

import { useState } from 'react';
import { Modal } from '../common';
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
  const [actionNote, setActionNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAction, setSelectedAction] = useState<AlertStatus | null>(null);

  if (!alert) return null;

  const handleAction = async (action: 'acknowledge' | 'resolve') => {
    try {
      setIsProcessing(true);
      
      if (action === 'acknowledge') {
        await alertService.acknowledgeAlert(alert.id);
        toast.success('✓ Alerta reconocida exitosamente');
      } else if (action === 'resolve') {
        await alertService.resolveAlert(alert.id);
        toast.success('✓ Alerta resuelta exitosamente');
      }
      
      onUpdate();
      onClose();
      setActionNote('');
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
        return {
          label: 'Crítica',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-300',
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
      case 'high':
        return {
          label: 'Alta',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          borderColor: 'border-orange-300',
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        };
      case 'medium':
        return {
          label: 'Media',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-300',
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
      default:
        return {
          label: 'Baja',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-300',
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pendiente',
          color: 'text-yellow-700',
          bgColor: 'bg-yellow-100',
          icon: '⏳',
        };
      case 'acknowledged':
        return {
          label: 'Reconocida',
          color: 'text-blue-700',
          bgColor: 'bg-blue-100',
          icon: '👀',
        };
      case 'resolved':
        return {
          label: 'Resuelta',
          color: 'text-green-700',
          bgColor: 'bg-green-100',
          icon: '✅',
        };
      case 'dismissed':
        return {
          label: 'Descartada',
          color: 'text-gray-700',
          bgColor: 'bg-gray-100',
          icon: '❌',
        };
      default:
        return {
          label: status,
          color: 'text-gray-700',
          bgColor: 'bg-gray-100',
          icon: '•',
        };
    }
  };

  const severityInfo = getSeverityInfo(alert.severity);
  const statusInfo = getStatusInfo(alert.status);

  // Determinar acciones disponibles según el estado actual
  const availableActions = (() => {
    const actions = [];
    
    // Si no está reconocida, permitir reconocer
    if (!alert.is_acknowledged && !alert.is_resolved) {
      actions.push({
        key: 'acknowledge',
        label: 'Reconocer Alerta',
        description: 'Marcar como vista y en seguimiento',
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ),
        color: 'bg-blue-500 hover:bg-blue-600',
        nextStatus: 'acknowledged',
      });
    }
    
    // Permitir resolver si no está resuelta (puede estar reconocida o no)
    if (!alert.is_resolved) {
      actions.push({
        key: 'resolve',
        label: 'Resolver Alerta',
        description: 'Marcar como resuelta - problema atendido',
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
        color: 'bg-green-500 hover:bg-green-600',
        nextStatus: 'resolved',
      });
    }

    return actions;
  })();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isProcessing) {
          onClose();
          setActionNote('');
          setSelectedAction(null);
        }
      }}
      title={`Gestión de Alerta #${alert.id}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Alert Header with Severity */}
        <div className={`${severityInfo.bgColor} ${severityInfo.borderColor} border-2 rounded-xl p-6`}>
          <div className="flex items-start gap-4">
            <div className={`${severityInfo.color} p-3 rounded-full ${severityInfo.bgColor}`}>
              {severityInfo.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={`text-xl font-bold ${severityInfo.color}`}>
                  Alerta de Severidad {severityInfo.label}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}>
                  {statusInfo.icon} {statusInfo.label}
                </span>
              </div>
              <p className="text-gray-700 text-lg font-medium mb-3">{alert.message}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>📅 {new Date(alert.created_at).toLocaleString('es-ES')}</span>
                {alert.acknowledged_at && (
                  <span>👁️ Reconocida: {new Date(alert.acknowledged_at).toLocaleString('es-ES')}</span>
                )}
                {alert.resolved_at && (
                  <span>✅ Resuelta: {new Date(alert.resolved_at).toLocaleString('es-ES')}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Employee & Metrics Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">Empleado</div>
            <div className="text-lg font-bold text-[#18314F]">
              {alert.employee_name || `#${alert.employee}`}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">Score de Fatiga</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-red-600">{alert.fatigue_score}</div>
              <div className="text-sm text-gray-500">/100</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${
                  alert.fatigue_score >= 80 ? 'bg-red-500' :
                  alert.fatigue_score >= 60 ? 'bg-orange-500' :
                  alert.fatigue_score >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${alert.fatigue_score}%` }}
              />
            </div>
          </div>

          {alert.heart_rate && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Frecuencia Cardíaca</div>
              <div className="text-2xl font-bold text-red-500">
                {alert.heart_rate}
              </div>
              <div className="text-xs text-gray-500">bpm</div>
            </div>
          )}

          {alert.spo2 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Saturación SpO2</div>
              <div className="text-2xl font-bold text-blue-500">
                {alert.spo2}%
              </div>
            </div>
          )}

          {alert.temperature && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Temperatura</div>
              <div className="text-2xl font-bold text-orange-500">
                {alert.temperature}°C
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        {alert.recommendations && (
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Recomendaciones del Sistema</h4>
                <p className="text-sm text-blue-800">{alert.recommendations}</p>
              </div>
            </div>
          </div>
        )}

        {/* Workflow Section - Only show if there are available actions */}
        {availableActions.length > 0 && (
          <>
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-[#18314F] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Flujo de Gestión - Selecciona una Acción
              </h3>

              {/* Visual Workflow */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {availableActions.map((action) => (
                  <button
                    key={action.key}
                    onClick={() => setSelectedAction(action.nextStatus as AlertStatus)}
                    className={`
                      relative p-5 rounded-xl border-2 transition-all text-left
                      ${selectedAction === action.nextStatus 
                        ? 'border-[#18314F] bg-blue-50 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }
                    `}
                    disabled={isProcessing}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`${action.color} text-white p-3 rounded-lg transition-transform ${
                        selectedAction === action.nextStatus ? 'scale-110' : ''
                      }`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[#18314F] mb-1">{action.label}</h4>
                        <p className="text-sm text-gray-600">{action.description}</p>
                        {selectedAction === action.nextStatus && (
                          <div className="mt-2 text-xs font-semibold text-blue-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Acción Seleccionada
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Action Note */}
              {selectedAction && (
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-300">
                  <label className="block mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Notas adicionales (Opcional)
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      Documenta la acción tomada o cualquier observación relevante
                    </span>
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent resize-none"
                    placeholder="Ej: Se contactó al empleado y se recomendó tomar un descanso de 15 minutos..."
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    rows={3}
                    disabled={isProcessing}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => {
                  onClose();
                  setActionNote('');
                  setSelectedAction(null);
                }}
                className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
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
                  className={`
                    px-8 py-2.5 text-white rounded-lg font-semibold transition-all
                    flex items-center gap-2 shadow-lg hover:shadow-xl
                    ${isProcessing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : availableActions.find(a => a.nextStatus === selectedAction)?.color || 'bg-blue-500 hover:bg-blue-600'
                    }
                  `}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirmar Acción
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}

        {/* No actions available message */}
        {availableActions.length === 0 && (
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 text-center">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-green-900 mb-2">
              Esta alerta ya ha sido procesada
            </h3>
            <p className="text-sm text-green-700">
              No hay acciones adicionales disponibles para esta alerta.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
