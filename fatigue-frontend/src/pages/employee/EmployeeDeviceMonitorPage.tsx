/**
 * Employee Device Monitor Page
 * Monitoreo en tiempo real del dispositivo/simulador del empleado
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts';
import { simulatorService } from '../../services';
import { LoadingSpinner } from '../../components/common';
import type { SimulatorSession } from '../../types';
import type { SensorData as BaseSensorData } from '../../types/metrics.types';
import api from '../../services/api';

interface SensorData extends BaseSensorData {
  spo2?: number; // Saturación de oxígeno
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export function EmployeeDeviceMonitorPage() {
  const { user } = useAuth();
  const [simulator, setSimulator] = useState<SimulatorSession | null>(null);
  const [recentReadings, setRecentReadings] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 3;
  const [filterDate, setFilterDate] = useState('');
  const [filterActivity, setFilterActivity] = useState('all');

  useEffect(() => {
    setCurrentPage(1);
  }, [filterDate, filterActivity]);

  useEffect(() => {
    loadData();
  }, [currentPage, filterDate, filterActivity]);

  useEffect(() => {
    if (!autoRefresh || currentPage !== 1) return;

    const interval = setInterval(() => {
      loadData();
    }, 3000); // Actualizar cada 3 segundos

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadData = async () => {
    try {
      if (!isLoading) setIsLoading(false); // Solo mostrar loading en la primera carga
      
      // Obtener simuladores activos del empleado
      const activeSims = await simulatorService.getActive();
      const mySimulator = activeSims.find(sim => sim.employee === user?.id);
      setSimulator(mySimulator || null);

      // Obtener lecturas recientes de sensores del empleado
      if (user?.id) {
        try {
          const response = await api.get<PaginatedResponse<SensorData>>(
            '/sensor-data/',
            {
              params: {
                employee: user.id,
                ordering: '-timestamp',
                page: currentPage,
                page_size: pageSize
              }
            }
          );
          setRecentReadings(response.data.results || []);
          setTotalCount(response.data.count || 0);
          setTotalPages(Math.ceil((response.data.count || 0) / pageSize));
        } catch (error) {
          console.error('Error loading sensor readings:', error);
          setRecentReadings([]);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Cargando monitoreo..." />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-600 bg-green-100';
      case 'stopped':
        return 'text-gray-600 bg-gray-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getFatigueColor = (fatigue: number) => {
    if (fatigue >= 75) return 'text-red-600 bg-red-100';
    if (fatigue >= 50) return 'text-yellow-600 bg-yellow-100';
    if (fatigue >= 25) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#18314F] mb-1">
            Monitoreo de Dispositivo
          </h1>
          <p className="text-lg text-[#18314F]/70">
            Estado en tiempo real de tu dispositivo wearable
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
            <span className="text-sm font-medium text-gray-600">Auto-actualización</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoRefresh ? 'bg-[#18314F]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoRefresh ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            {autoRefresh && (
              <svg className="w-4 h-4 text-green-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
          </div>
          <button
            onClick={() => loadData()}
            className="bg-[#18314F] hover:bg-[#18314F]/90 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        </div>
      </div>

      {/* Estado del Dispositivo */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-[#18314F] mb-6 flex items-center gap-3">
          <svg className="w-6 h-6 text-[#18314F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Estado del Dispositivo
        </h2>

        {simulator ? (
          <div className="space-y-6">
            {/* Estado Principal - Diseño Simple */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <span className="text-gray-600">Estado:</span>
                  <span className="ml-3 inline-flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      simulator.status === 'running' ? 'bg-green-600' : 'bg-gray-400'
                    }`} />
                    <span className="font-semibold text-[#18314F]">{simulator.status_display}</span>
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">ID del Dispositivo:</span>
                  <span className="ml-3 font-mono font-semibold text-[#18314F]">{simulator.device_id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Tiempo Activo:</span>
                  <span className="ml-3 font-semibold text-[#18314F]">{formatDuration(simulator.duration_seconds)}</span>
                </div>
              </div>
            </div>

            {/* Métricas en Tiempo Real */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-gray-600">Nivel de Fatiga</div>
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className={`text-2xl font-bold px-3 py-1 rounded-lg inline-block ${getFatigueColor(simulator.current_fatigue)}`}>
                  {simulator.current_fatigue.toFixed(1)}%
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-gray-600">Perfil de Fatiga</div>
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-lg font-bold text-[#18314F]">
                  {simulator.fatigue_profile_display}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-gray-600">Actividad Actual</div>
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-lg font-bold text-[#18314F]">
                  {recentReadings.length > 0 ? (() => {
                    const latest = recentReadings[0];
                    const movementLevel = latest.movement_level;
                    if (movementLevel > 75) return 'Actividad Intensa';
                    if (movementLevel > 50) return 'Actividad Moderada';
                    if (movementLevel > 25) return 'Actividad Ligera';
                    return 'Reposo';
                  })() : simulator.activity_mode_display}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-gray-600">Mensajes Enviados</div>
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-[#18314F]">
                  {simulator.messages_sent}
                </div>
              </div>
            </div>

            {/* Información Adicional */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Iniciado:</span>
                  <span className="ml-2 font-medium text-[#18314F]">
                    {new Date(simulator.started_at).toLocaleString('es-ES')}
                  </span>
                </div>
                {simulator.stopped_at && (
                  <div>
                    <span className="text-gray-600">Detenido:</span>
                    <span className="ml-2 font-medium text-[#18314F]">
                      {new Date(simulator.stopped_at).toLocaleString('es-ES')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay dispositivo activo
            </h3>
            <p className="text-gray-500">
              Tu dispositivo no está enviando datos actualmente
            </p>
          </div>
        )}
      </div>

      {/* Lecturas Recientes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-[#18314F] mb-6 flex items-center gap-3">
          <svg className="w-6 h-6 text-[#18314F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Lecturas Recientes de Sensores
        </h2>

        {/* Filtros */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-[#18314F]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de Actividad
            </label>
            <select
              value={filterActivity}
              onChange={(e) => setFilterActivity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-[#18314F]"
            >
              <option value="all">Todos</option>
              <option value="rest">Reposo</option>
              <option value="light">Ligera</option>
              <option value="moderate">Moderada</option>
              <option value="high">Alta</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterDate('');
                setFilterActivity('all');
              }}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        {recentReadings.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
              <span>
                Mostrando {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalCount)} de {totalCount} lecturas
              </span>
              <span>Página {currentPage} de {totalPages}</span>
            </div>
            
            <div className="space-y-3">
              {recentReadings.filter(reading => {
                // Filtro por fecha
                if (filterDate) {
                  const readingDate = new Date(reading.timestamp).toISOString().split('T')[0];
                  if (readingDate !== filterDate) return false;
                }
                
                // Filtro por actividad
                if (filterActivity !== 'all') {
                  const movementLevel = reading.movement_level || 0;
                  let activityType = 'rest';
                  if (movementLevel > 75) activityType = 'high';
                  else if (movementLevel > 50) activityType = 'moderate';
                  else if (movementLevel > 25) activityType = 'light';
                  
                  if (activityType !== filterActivity) return false;
                }
                
                return true;
              }).map((reading, index) => {
              // Determinar nivel de actividad basado en movement_level
              let activityLevel = 'Reposo';
              let activityColor = 'bg-green-50 text-green-700 border-green-200';
              const movementLevel = reading.movement_level || 0;
              if (movementLevel > 75) {
                activityLevel = 'Alta';
                activityColor = 'bg-red-50 text-red-700 border-red-200';
              } else if (movementLevel > 50) {
                activityLevel = 'Moderada';
                activityColor = 'bg-orange-50 text-orange-700 border-orange-200';
              } else if (movementLevel > 25) {
                activityLevel = 'Ligera';
                activityColor = 'bg-blue-50 text-blue-700 border-blue-200';
              }
              
              const heartRateColor = (reading.heart_rate || 0) > 100 ? 'text-red-600' : 'text-gray-900';
              const spo2Color = (reading.spo2 || 0) < 95 ? 'text-red-600' : 'text-gray-900';
              
              return (
                <div 
                  key={reading.id} 
                  className="bg-gray-50 border border-gray-300 p-3"
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-300">
                    <span className="text-sm text-gray-700">
                      {formatTimestamp(reading.timestamp)}
                    </span>
                    <span className="text-xs text-gray-600">
                      {reading.device_name || `Dispositivo #${reading.device}`}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <div className="text-gray-600 mb-1">Frecuencia Cardíaca:</div>
                      <div className={`font-bold ${heartRateColor}`}>
                        {reading.heart_rate || 0} bpm
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-gray-600 mb-1">SpO2:</div>
                      <div className={`font-bold ${spo2Color}`}>
                        {reading.spo2 || 0}%
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-gray-600 mb-1">Actividad:</div>
                      <div className="font-bold text-gray-900">
                        {activityLevel} ({movementLevel.toFixed(0)}%)
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
            
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Primera
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-[#18314F] text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Última
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay lecturas disponibles
            </h3>
            <p className="text-gray-500">
              Aún no se han registrado datos de sensores
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
