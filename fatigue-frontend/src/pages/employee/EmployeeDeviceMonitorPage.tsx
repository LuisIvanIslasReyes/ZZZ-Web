/**
 * Employee Device Monitor Page
 * Monitoreo en tiempo real del dispositivo/simulador del empleado
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts';
import { simulatorService } from '../../services';
import { LoadingSpinner } from '../../components/common';
import type { SimulatorSession } from '../../types';
import api from '../../services/api';

interface SensorReading {
  id: number;
  timestamp: string;
  heart_rate: number;
  spo2: number;
  accel_x: number;
  accel_y: number;
  accel_z: number;
  device_id: string;
  device_name: string;
  created_at: string;
}

interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export function EmployeeDeviceMonitorPage() {
  const { user } = useAuth();
  const [simulator, setSimulator] = useState<SimulatorSession | null>(null);
  const [recentReadings, setRecentReadings] = useState<SensorReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

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
          const response = await api.get<ApiResponse<SensorReading> | SensorReading[]>(
            `/sensor-data/?ordering=-timestamp`
          );
          // Manejar respuesta paginada o array directo
          const data = Array.isArray(response.data) 
            ? response.data.slice(0, 10) 
            : response.data.results.slice(0, 10);
          setRecentReadings(data);
        } catch (error) {
          console.error('Error loading sensor readings:', error);
          setRecentReadings([]); // Establecer array vacío en caso de error
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
            {/* Estado Principal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-sm text-gray-600 mb-2">Estado</div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold ${getStatusColor(simulator.status)}`}>
                  <span className="w-3 h-3 rounded-full bg-current animate-pulse" />
                  {simulator.status_display}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-sm text-gray-600 mb-2">ID del Dispositivo</div>
                <div className="text-2xl font-bold text-[#18314F] font-mono">
                  {simulator.device_id}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-sm text-gray-600 mb-2">Tiempo Activo</div>
                <div className="text-2xl font-bold text-[#18314F]">
                  {formatDuration(simulator.duration_seconds)}
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
                    const accelMagnitude = Math.sqrt(
                      Math.pow(latest.accel_x, 2) + 
                      Math.pow(latest.accel_y, 2) + 
                      Math.pow(latest.accel_z, 2)
                    );
                    if (accelMagnitude > 15) return 'Actividad Intensa';
                    if (accelMagnitude > 10) return 'Actividad Moderada';
                    if (accelMagnitude > 5) return 'Actividad Ligera';
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

        {recentReadings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hora</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dispositivo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Frecuencia Cardíaca</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">SpO2</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aceleración</th>
                </tr>
              </thead>
              <tbody>
                {recentReadings.map((reading, index) => {
                  // Calcular magnitud de aceleración
                  const accelMagnitude = Math.sqrt(
                    Math.pow(reading.accel_x, 2) + 
                    Math.pow(reading.accel_y, 2) + 
                    Math.pow(reading.accel_z, 2)
                  );
                  
                  // Determinar nivel de actividad basado en aceleración
                  let activityLevel = 'Reposo';
                  let activityColor = 'bg-gray-100 text-gray-800';
                  if (accelMagnitude > 15) {
                    activityLevel = 'Alta';
                    activityColor = 'bg-red-100 text-red-800';
                  } else if (accelMagnitude > 10) {
                    activityLevel = 'Moderada';
                    activityColor = 'bg-orange-100 text-orange-800';
                  } else if (accelMagnitude > 5) {
                    activityLevel = 'Ligera';
                    activityColor = 'bg-green-100 text-green-800';
                  }
                  
                  return (
                    <tr
                      key={reading.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === 0 ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {formatTimestamp(reading.timestamp)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-mono font-medium">
                          {reading.device_id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          {reading.heart_rate} bpm
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                          {reading.spo2}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${activityColor.replace('bg-', 'text-').replace('-100', '-700')}`}>
                            {activityLevel}
                          </span>
                          <span className="text-xs text-gray-400">|</span>
                          <span className="text-xs text-gray-500 font-mono">
                            {accelMagnitude.toFixed(1)} m/s²
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
