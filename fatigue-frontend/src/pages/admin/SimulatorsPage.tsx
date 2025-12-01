/**
 * Página de gestión de simuladores ESP32
 * Panel de control para administradores
 */
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { simulatorService, deviceService } from '../../services';
import { Modal } from '../../components/common/Modal';
import type {
  SimulatorSession,
  EmployeeForSimulator,
  CreateSimulatorData,
  UpdateSimulatorConfigData,
  FATIGUE_PROFILES,
  ACTIVITY_MODES,
  Device,
} from '../../types';

export default function SimulatorsPage() {
  const [sessions, setSessions] = useState<SimulatorSession[]>([]);
  const [employees, setEmployees] = useState<EmployeeForSimulator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SimulatorSession | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Cargar datos
  useEffect(() => {
    loadData();
  }, []);

  // Auto-refresh cada 5 segundos
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadActiveSessions();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsData, employeesData] = await Promise.all([
        simulatorService.getAll(), // ✅ Cargar TODOS los simuladores, no solo activos
        simulatorService.getAvailableEmployees(),
      ]);
      // Asegurar que sessionsData sea siempre un array
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar datos de simuladores');
      setSessions([]);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const loadActiveSessions = async () => {
    try {
      const sessionsData = await simulatorService.getAll(); // ✅ Cargar TODOS, no solo activos
      // Asegurar que sessionsData sea siempre un array
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
    } catch (error) {
      console.error('Error refrescando sesiones:', error);
      setSessions([]);
    }
  };

  const handleStopSimulator = async (id: number) => {
    try {
      await simulatorService.stop(id);
      toast.success('Simulador detenido exitosamente');
      // Refrescar datos inmediatamente
      await loadData();
      // Segundo refetch para asegurar sincronización
      setTimeout(async () => {
        await loadActiveSessions();
      }, 500);
    } catch (error: unknown) {
      console.error('Error deteniendo simulador:', error);
      const errorMessage = (error as any)?.message || 'Error al detener simulador';
      toast.error(errorMessage);
      // Refrescar datos incluso si hay error para ver el estado actual
      await loadData();
    }
  };

  const handleStopAll = async () => {
    if (!confirm('¿Detener TODOS los simuladores activos?')) return;

    try {
      const result = await simulatorService.stopAll();
      toast.success(result.message);
      loadData();
    } catch (error) {
      console.error('Error deteniendo simuladores:', error);
      toast.error('Error al detener todos los simuladores');
    }
  };

  const handleRestartSimulator = async (id: number) => {
    try {
      await simulatorService.restart(id);
      toast.success('Simulador reiniciado exitosamente');
      // Refrescar datos inmediatamente
      await loadData();
      // Segundo refetch para asegurar sincronización
      setTimeout(async () => {
        await loadActiveSessions();
      }, 500);
    } catch (error: unknown) {
      console.error('Error reiniciando simulador:', error);
      const errorMessage = (error as any)?.message || 'Error al reiniciar simulador';
      toast.error(errorMessage);
      await loadData();
    }
  };

  const handleDeleteSimulator = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este simulador? Esta acción no se puede deshacer.')) return;

    try {
      await simulatorService.delete(id);
      toast.success('Simulador eliminado exitosamente');
      await loadData();
    } catch (error: unknown) {
      console.error('Error eliminando simulador:', error);
      const errorMessage = (error as any)?.message || 'Error al eliminar simulador';
      toast.error(errorMessage);
    }
  };

  const handleUpdateConfig = async (id: number, config: UpdateSimulatorConfigData) => {
    try {
      // Actualizar configuración en el backend
      await simulatorService.updateConfig(id, config);
      
      // Cerrar modal y mostrar feedback
      setShowConfigModal(false);
      toast.success('Configuración actualizada exitosamente');
      
      // ✅ REFETCH 1: Refrescar datos inmediatamente
      await loadData();
      
      // ✅ REFETCH 2: Segundo refetch después de 500ms para asegurar que el backend procesó todo
      setTimeout(async () => {
        await loadActiveSessions();
      }, 500);
      
      // ✅ REFETCH 3: Tercer refetch después de 2 segundos para capturar cambios en métricas
      setTimeout(async () => {
        await loadActiveSessions();
      }, 2000);
    } catch (error) {
      console.error('Error actualizando configuración:', error);
      toast.error('Error al actualizar configuración');
      // Refrescar para asegurar UI consistente
      await loadData();
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getFatigueColor = (fatigue: number) => {
    if (fatigue >= 85) return 'text-error';
    if (fatigue >= 70) return 'text-warning';
    if (fatigue >= 50) return 'text-info';
    return 'text-success';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Gestión de Simuladores</h1>
            <p className="text-gray-600">Control de simuladores ESP32 en tiempo real</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#18314F] hover:bg-[#18314F]/90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Simulador
          </button>
        </div>
      </div>

      {/* Stats Cards - Layout asimétrico */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Resumen en Tiempo Real</h3>
          <div className="flex items-center gap-4">
            {/* Toggle Auto-refresh elegante */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                autoRefresh ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
                  autoRefresh ? 'translate-x-4' : 'translate-x-1'
                }`} />
              </span>
              <span className={autoRefresh ? 'text-green-600' : 'text-gray-500'}>Auto-refresh</span>
            </button>
            {/* Botón Detener Todos - solo si hay sesiones */}
            {sessions.length > 0 && (
              <button
                onClick={handleStopAll}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Detener Todos
              </button>
            )}
          </div>
        </div>
        
        {/* Grid asimétrico: 2 grandes + 2 pequeños */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Simuladores Totales - Card grande */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 text-base font-medium">Total Simuladores</span>
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <div>
            <span className="text-4xl font-bold text-gray-900">
              {Array.isArray(sessions) ? sessions.filter(s => s.status === 'running').length : 0}
            </span>
            <span className="text-xl text-gray-400 ml-1">/ {Array.isArray(sessions) ? sessions.length : 0}</span>
          </div>
          <span className="text-sm text-gray-500 mt-2">Activos / Total</span>
        </div>

        {/* Empleados Disponibles - Card grande */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 text-base font-medium">Empleados Disponibles</span>
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span className="text-4xl font-bold text-gray-900">
            {employees.filter((e) => !e.has_active_simulator).length}
          </span>
          <span className="text-sm text-gray-500 mt-2">Sin simulador activo</span>
        </div>

        {/* Columna derecha: 2 cards pequeñas apiladas */}
        <div className="flex flex-col gap-4">
          {/* Mensajes Totales */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-sm font-medium">Mensajes MQTT</span>
              <div className="text-2xl font-bold text-gray-900">
                {Array.isArray(sessions) ? sessions.reduce((sum, s) => sum + (s.live_stats?.messages_sent || s.messages_sent), 0) : 0}
              </div>
            </div>
            <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>

          {/* Análisis ML */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-sm font-medium">Análisis ML</span>
              <div className="text-2xl font-bold text-green-600">Activo</div>
            </div>
            <svg className="w-7 h-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>
        </div>
      </div>

      {/* All Sessions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Todos los Simuladores</h2>
          <div className="flex gap-3">
            <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {Array.isArray(sessions) ? sessions.filter(s => s.status === 'running').length : 0} Activos
            </span>
            <span className="flex items-center gap-2 text-sm font-medium text-gray-400">
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              {Array.isArray(sessions) ? sessions.filter(s => s.status === 'stopped').length : 0} Detenidos
            </span>
          </div>
        </div>

        {!Array.isArray(sessions) || sessions.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
            <p className="text-gray-500 text-lg mb-2">No hay simuladores activos</p>
            <p className="text-gray-400 text-sm mb-4">Inicia uno para comenzar el monitoreo</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#18314F] hover:bg-[#18314F]/90 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Crear Primer Simulador
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sessions.map((session) => (
              <SimulatorCard
                key={session.id}
                session={session}
                onStop={handleStopSimulator}
                onRestart={handleRestartSimulator}
                onDelete={handleDeleteSimulator}
                onConfig={(s) => {
                  setSelectedSession(s);
                  setShowConfigModal(true);
                }}
                formatDuration={formatDuration}
                getFatigueColor={getFatigueColor}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateSimulatorModal
          employees={employees}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadData();
          }}
        />
      )}

      {/* Config Modal */}
      {showConfigModal && selectedSession && (
        <ConfigSimulatorModal
          session={selectedSession}
          onClose={() => {
            setShowConfigModal(false);
            setSelectedSession(null);
          }}
          onSave={(config) => handleUpdateConfig(selectedSession.id, config)}
        />
      )}
    </div>
  );
}

// Simulator Card Component
function SimulatorCard({
  session,
  onStop,
  onRestart,
  onDelete,
  onConfig,
  formatDuration,
  getFatigueColor,
}: {
  session: SimulatorSession;
  onStop: (id: number) => void;
  onRestart: (id: number) => void;
  onDelete: (id: number) => void;
  onConfig: (session: SimulatorSession) => void;
  formatDuration: (seconds: number) => string;
  getFatigueColor: (fatigue: number) => string;
}) {
  const stats = session.live_stats || {
    messages_sent: session.messages_sent,
    current_fatigue: session.current_fatigue,
    activity_mode: session.activity_mode,
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 rounded-full p-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </span>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{session.device_id}</h3>
            <p className="text-sm text-gray-600">{session.employee_name}</p>
          </div>
        </div>
        {session.status === 'running' ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 animate-pulse">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            ACTIVO
          </span>
        ) : session.status === 'stopped' ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
            DETENIDO
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            ERROR
          </span>
        )}
      </div>

      {/* Email */}
      <p className="text-xs text-gray-500 mb-4">{session.employee_email}</p>

      <div className="border-t border-gray-200 my-4"></div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Fatiga Actual</p>
          <div className={`text-3xl font-bold ${getFatigueColor(stats.current_fatigue)}`}>
            {stats.current_fatigue.toFixed(1)}%
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Perfil</p>
          <div className="font-semibold text-gray-700">{session.fatigue_profile_display}</div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Actividad</p>
          <div className="font-semibold text-gray-700">{session.activity_mode_display}</div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Mensajes</p>
          <div className="font-semibold text-gray-700">{stats.messages_sent}</div>
        </div>
      </div>

      {/* Duration */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Duración: {formatDuration(session.duration_seconds)}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => onConfig(session)}
            disabled={session.status !== 'running'}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              session.status === 'running'
                ? 'bg-[#18314F] hover:bg-[#18314F]/90 text-white cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Configurar
          </button>

          {/* Botón Detener/Reiniciar según estado */}
          {session.status === 'running' ? (
            <button
              onClick={() => onStop(session.id)}
              className="flex-1 px-4 py-2 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              Detener
            </button>
          ) : (
            <button
              onClick={() => onRestart(session.id)}
              disabled={session.status !== 'stopped'}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                session.status === 'stopped'
                  ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Reiniciar
            </button>
          )}
        </div>

        {/* Botón Eliminar */}
        <button
          onClick={() => onDelete(session.id)}
          className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Eliminar Simulador
        </button>
      </div>
    </div>
  );
}

// Create Simulator Modal
function CreateSimulatorModal({
  employees,
  onClose,
  onSuccess,
}: {
  employees: EmployeeForSimulator[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<CreateSimulatorData>({
    employee: 0,
    device_id: '',
    fatigue_profile: 'normal',
    activity_mode: 'light',
  });
  const [loading, setLoading] = useState(false);
  const [loadingDevice, setLoadingDevice] = useState(false);
  const [employeeDevice, setEmployeeDevice] = useState<Device | null>(null);
  const [showCreateDevice, setShowCreateDevice] = useState(false);
  const [newDeviceData, setNewDeviceData] = useState({
    device_id: '',
  });

  const availableEmployees = employees.filter((e) => !e.has_active_simulator);

  const handleEmployeeChange = async (employeeId: number) => {
    if (!employeeId) {
      setFormData({
        ...formData,
        employee: 0,
        device_id: '',
      });
      setEmployeeDevice(null);
      setShowCreateDevice(false);
      return;
    }

    setLoadingDevice(true);
    setEmployeeDevice(null);
    setShowCreateDevice(false);

    try {
      // Buscar dispositivo asignado al empleado
      const devices = await deviceService.getDevicesByEmployee(employeeId);
      
      if (devices && devices.length > 0) {
        // Empleado tiene dispositivo asignado
        const device = devices[0];
        setEmployeeDevice(device);
        setFormData({
          ...formData,
          employee: employeeId,
          device_id: device.device_identifier,
        });
        toast.success(`Dispositivo ${device.device_identifier} encontrado`);
      } else {
        // Empleado NO tiene dispositivo
        setFormData({
          ...formData,
          employee: employeeId,
          device_id: '',
        });
        setShowCreateDevice(true);
        setNewDeviceData({
          device_id: `ESP32-${String(employeeId).padStart(3, '0')}`,
        });
        toast('Este empleado no tiene dispositivo asignado', { icon: 'ℹ️' });
      }
    } catch (error) {
      console.error('Error buscando dispositivo:', error);
      // Si hay error, permitir crear dispositivo
      setFormData({
        ...formData,
        employee: employeeId,
        device_id: '',
      });
      setShowCreateDevice(true);
      setNewDeviceData({
        device_id: `ESP32-${String(employeeId).padStart(3, '0')}`,
      });
      toast.error('Error al buscar dispositivo del empleado');
    } finally {
      setLoadingDevice(false);
    }
  };

  const handleCreateDevice = async () => {
    if (!newDeviceData.device_id.trim()) {
      toast.error('Ingresa un Device ID');
      return;
    }

    setLoading(true);
    try {
      // Obtener el supervisor del empleado seleccionado
      const selectedEmployee = employees.find((e) => e.id === formData.employee);
      const supervisorId = selectedEmployee?.supervisor;

      if (!supervisorId) {
        toast.error('El empleado debe tener un supervisor asignado');
        setLoading(false);
        return;
      }

      const newDevice = await deviceService.createDevice({
        device_identifier: newDeviceData.device_id,
        employee: formData.employee,
        supervisor: supervisorId,
        is_active: true,
      });
      
      setEmployeeDevice(newDevice);
      setFormData({
        ...formData,
        device_id: newDevice.device_identifier,
      });
      setShowCreateDevice(false);
      toast.success('Dispositivo creado exitosamente');
    } catch (error: any) {
      console.error('Error creando dispositivo:', error);
      toast.error(error.response?.data?.device_id?.[0] || 'Error al crear dispositivo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employee) {
      toast.error('Selecciona un empleado');
      return;
    }
    if (!formData.device_id) {
      toast.error('El empleado necesita un dispositivo asignado');
      return;
    }

    setLoading(true);
    try {
      await simulatorService.create(formData);
      toast.success('Simulador iniciado exitosamente');
      onSuccess();
    } catch (error: any) {
      console.error('Error creando simulador:', error);
      toast.error(error.response?.data?.error || 'Error al iniciar simulador');
    } finally {
      setLoading(false);
    }
  };

  const fatigueProfiles: typeof FATIGUE_PROFILES = [
    { value: 'rested', label: 'Descansado (0-30%)', color: 'success' },
    { value: 'normal', label: 'Normal (30-50%)', color: 'info' },
    { value: 'tired', label: 'Cansado (50-70%)', color: 'warning' },
    { value: 'fatigued', label: 'Fatigado (70-85%)', color: 'error' },
    { value: 'critical', label: 'Crítico (85-100%)', color: 'error' },
  ];

  const activityModes: typeof ACTIVITY_MODES = [
    {
      value: 'resting',
      label: 'Reposo',
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v12z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6" />
        </svg>
      ),
    },
    {
      value: 'light',
      label: 'Actividad Ligera',
      icon: (
        <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      value: 'moderate',
      label: 'Actividad Moderada',
      icon: (
        <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      value: 'heavy',
      label: 'Actividad Intensa',
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.24 7.76a6 6 0 11-8.48 8.48" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2m8-10h2M2 12H4" />
        </svg>
      ),
    },
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Nuevo Simulador ESP32"
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="simulator-form"
            className="px-6 py-3 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={loading || !formData.device_id}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Iniciando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Iniciar Simulador
              </>
            )}
          </button>
        </>
      }
    >
      <form id="simulator-form" onSubmit={handleSubmit} className="space-y-5">
          {/* Empleado */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Empleado <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-700 font-medium focus:border-[#18314F] focus:ring-2 focus:ring-[#18314F]/20 focus:outline-none transition-all appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={formData.employee}
                onChange={(e) => handleEmployeeChange(Number(e.target.value))}
                required
                disabled={loading || loadingDevice}
              >
                <option value={0}>Seleccionar empleado...</option>
                {availableEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name} ({emp.email})
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
            <p className="mt-1.5 text-sm text-gray-500">
              {availableEmployees.length} empleado(s) disponible(s)
            </p>
          </div>

          {/* Loading Device */}
          {loadingDevice && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-800 font-medium">Buscando dispositivo del empleado...</span>
            </div>
          )}

          {/* Device Info - Cuando existe */}
          {employeeDevice && !showCreateDevice && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-green-800">Dispositivo encontrado</p>
                <p className="text-sm text-green-700">
                  {employeeDevice.device_identifier}
                  {employeeDevice.is_active ? ' - Estado: Activo' : ' - Estado: Inactivo'}
                </p>
              </div>
            </div>
          )}

          {/* Create Device Form - Cuando NO existe */}
          {showCreateDevice && formData.employee > 0 && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-5 space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h4 className="font-bold text-amber-800 mb-2">Este empleado no tiene dispositivo asignado</h4>
                  <p className="text-sm text-amber-700 mb-4">Crea un nuevo dispositivo para poder iniciar el simulador</p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Device ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-700 font-medium focus:border-[#18314F] focus:ring-2 focus:ring-[#18314F]/20 focus:outline-none transition-all"
                        value={newDeviceData.device_id}
                        onChange={(e) => setNewDeviceData({ ...newDeviceData, device_id: e.target.value })}
                        placeholder="ESP32-001"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateDevice}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#18314F] hover:bg-[#18314F]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Creando dispositivo...
                        </>
                      ) : (
                        <>
                          <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </span>
                          Crear Dispositivo
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Perfil de Fatiga */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Perfil de Fatiga <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-700 font-medium focus:border-[#18314F] focus:ring-2 focus:ring-[#18314F]/20 focus:outline-none transition-all appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={formData.fatigue_profile}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fatigue_profile: e.target.value as any,
                  })
                }
                disabled={loading}
              >
                {fatigueProfiles.map((profile) => (
                  <option key={profile.value} value={profile.value}>
                    {profile.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          {/* Modo de Actividad */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Modo de Actividad <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {activityModes.map((mode) => (
                <label
                  key={mode.value}
                  className={`cursor-pointer p-4 border-2 rounded-lg transition-all flex items-center gap-3 ${
                    formData.activity_mode === mode.value
                      ? 'border-[#18314F] bg-[#18314F]/5 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="activity_mode"
                    className="hidden"
                    value={mode.value}
                    checked={formData.activity_mode === mode.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        activity_mode: e.target.value as any,
                      })
                    }
                    disabled={loading}
                  />
                  <span>{mode.icon}</span>
                  <span className={`font-medium ${formData.activity_mode === mode.value ? 'text-[#18314F]' : 'text-gray-700'}`}>{mode.label}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
      </Modal>
  );
}

// Config Simulator Modal
function ConfigSimulatorModal({
  session,
  onClose,
  onSave,
}: {
  session: SimulatorSession;
  onClose: () => void;
  onSave: (config: UpdateSimulatorConfigData) => void;
}) {
  // Mapear el activity_mode del backend al formato que acepta el endpoint
  const mapActivityModeToBackend = (mode: string): 'rest' | 'light' | 'moderate' | 'intense' => {
    const mapping: Record<string, 'rest' | 'light' | 'moderate' | 'intense'> = {
      'resting': 'rest',
      'rest': 'rest',
      'light': 'light',
      'moderate': 'moderate',
      'heavy': 'intense',
      'intense': 'intense',
    };
    return mapping[mode] || 'light';
  };

  const [config, setConfig] = useState<UpdateSimulatorConfigData>({
    activity_mode: mapActivityModeToBackend(session.activity_mode),
    fatigue_level: session.current_fatigue,
  });

  const activityModes = [
    { value: 'rest' as const, label: 'Reposo' },
    { value: 'light' as const, label: 'Actividad Ligera' },
    { value: 'moderate' as const, label: 'Actividad Moderada' },
    { value: 'intense' as const, label: 'Actividad Intensa' },
  ];

  // Obtener color del slider según nivel de fatiga
  const getFatigueColor = (level: number) => {
    if (level <= 30) return '#22C55E'; // Verde
    if (level <= 60) return '#F59E0B'; // Amarillo/Naranja
    return '#EF4444'; // Rojo
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#18314F] text-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Configurar Simulador</h2>
                <p className="text-white/70 text-sm">{session.device_id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Activity Mode */}
          <div>
            <label className="block text-sm font-semibold text-[#18314F] mb-2">
              Modo de Actividad
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#18314F]/20 focus:border-[#18314F] transition-all"
                value={config.activity_mode}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    activity_mode: e.target.value as any,
                  })
                }
              >
                {activityModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Fatigue Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-[#18314F]">
                Nivel de Fatiga
              </label>
              <span 
                className="text-lg font-bold"
                style={{ color: getFatigueColor(config.fatigue_level ?? 0) }}
              >
                {config.fatigue_level?.toFixed(1)}%
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={config.fatigue_level}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    fatigue_level: Number(e.target.value),
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${getFatigueColor(config.fatigue_level ?? 0)} 0%, ${getFatigueColor(config.fatigue_level ?? 0)} ${config.fatigue_level}%, #E5E7EB ${config.fatigue_level}%, #E5E7EB 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0% (Descansado)</span>
              <span>50% (Normal)</span>
              <span>100% (Crítico)</span>
            </div>
          </div>

          {/* Fatigue Rate */}
          <div>
            <label className="block text-sm font-semibold text-[#18314F] mb-2">
              Tasa de Incremento
              <span className="text-gray-400 font-normal ml-1">(opcional)</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#18314F]/20 focus:border-[#18314F] transition-all"
              value={config.fatigue_rate || ''}
              onChange={(e) =>
                setConfig({
                  ...config,
                  fatigue_rate: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="0.5"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Incremento de fatiga por minuto
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(config)}
            className="px-5 py-2.5 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
