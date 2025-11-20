/**
 * Employee Dashboard Page
 * Dashboard personal para empleados - Métricas individuales
 * Diseño ZZZ Admin Style
 */

import { useState, useEffect } from 'react';
import { dashboardService } from '../../services';
import { LoadingSpinner } from '../../components/common';
import type { DashboardStats } from '../../types';

export function EmployeeDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const data = await dashboardService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Cargando dashboard..." />;
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se pudieron cargar los datos</p>
      </div>
    );
  }

  // Simular datos personales del empleado
  const myFatigueLevel = stats.avg_fatigue_score;
  const myRiskLevel = myFatigueLevel > 70 ? 'Alto' : myFatigueLevel > 50 ? 'Medio' : 'Bajo';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#18314F] mb-1">Mi Dashboard Personal</h1>
        <p className="text-lg text-[#18314F]/70">Monitoreo de tu salud y bienestar</p>
      </div>

      {/* Alert Banner - Si hay nivel alto de fatiga */}
      {myFatigueLevel > 70 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-xl flex items-start gap-4">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#F59E0B">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <h3 className="font-bold text-[#18314F] mb-1">Nivel de fatiga elevado</h3>
            <p className="text-sm text-gray-600">
              Te recomendamos tomar un descanso y consultar las recomendaciones personalizadas.
            </p>
          </div>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-xl transition-colors text-sm">
            Ver Recomendaciones
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Mi Nivel de Fatiga Actual */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Mi Nivel de Fatiga Actual</span>
            <span className={`rounded-full p-2 ${
              myFatigueLevel > 70 ? 'bg-red-100' : myFatigueLevel > 50 ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-[#18314F]">{myFatigueLevel}%</span>
            <span className={`font-semibold text-sm ${
              myFatigueLevel > 70 ? 'text-red-600' : myFatigueLevel > 50 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {myFatigueLevel > 70 ? 'Nivel alto' : myFatigueLevel > 50 ? 'Nivel medio' : 'Nivel normal'}
            </span>
          </div>
        </div>

        {/* Nivel de Riesgo */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Nivel de Riesgo</span>
            <span className={`rounded-full p-2 ${
              myRiskLevel === 'Alto' ? 'bg-red-100' : myRiskLevel === 'Medio' ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-bold ${
              myRiskLevel === 'Alto' ? 'text-red-600' : myRiskLevel === 'Medio' ? 'text-yellow-600' : 'text-[#18314F]'
            }`}>{myRiskLevel}</span>
            <span className="font-semibold text-sm text-gray-600">
              {myRiskLevel === 'Alto' ? 'Requiere atención' : 'Bajo control'}
            </span>
          </div>
        </div>

        {/* Alertas Activas */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Alertas Activas</span>
            <span className={`rounded-full p-2 ${stats.pending_alerts > 0 ? 'bg-yellow-100' : 'bg-green-100'}`}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-[#18314F]">{stats.pending_alerts}</span>
            <span className={`font-semibold text-sm ${stats.pending_alerts > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
              {stats.pending_alerts > 0 ? 'Revisar alertas' : 'Sin alertas'}
            </span>
          </div>
        </div>

        {/* Horas de Descanso Hoy */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Horas de Descanso Hoy</span>
            <span className="bg-blue-100 rounded-full p-2">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-[#18314F]">7.5h</span>
            <span className="font-semibold text-sm text-blue-600">Recomendado: 8h</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mi Historial de Fatiga */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#18314F">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <span className="text-lg font-semibold text-[#18314F]">Mi Historial de Fatiga</span>
          </div>
          <p className="text-sm text-[#18314F]/70 mb-4">Últimos 7 días</p>
          <div className="flex items-center justify-center h-[220px] text-gray-400">
            <p>Los datos del historial de fatiga estarán disponibles próximamente</p>
          </div>
          <div className="flex gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#18314F]"></span>Mi Nivel de Fatiga</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#8B5CF6]"></span>Promedio del Equipo</div>
          </div>
        </div>

        {/* Estado de Salud Integral */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#18314F">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16M12 4v16" />
            </svg>
            <span className="text-lg font-semibold text-[#18314F]">Estado de Salud Integral</span>
          </div>
          <p className="text-sm text-[#18314F]/70 mb-4">Indicadores principales</p>
          <div className="flex items-center justify-center h-[220px] text-gray-400">
            <p>Los datos de salud integral estarán disponibles próximamente</p>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Semanal */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#18314F">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v18h18" />
            </svg>
            <span className="text-lg font-semibold text-[#18314F]">Mi Actividad Semanal</span>
          </div>
          <p className="text-sm text-[#18314F]/70 mb-4">Horas de trabajo vs descanso</p>
          <div className="flex items-center justify-center h-[220px] text-gray-400">
            <p>Los datos de actividad semanal estarán disponibles próximamente</p>
          </div>
          <div className="flex gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#18314F]"></span>Horas Trabajadas</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#22C55E]"></span>Horas de Descanso</div>
          </div>
        </div>

        {/* Progreso Semanal */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#18314F">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-lg font-semibold text-[#18314F]">Progreso de Bienestar</span>
          </div>
          <p className="text-sm text-[#18314F]/70 mb-4">Comparación semanal</p>
          <div className="flex items-center justify-center h-[220px] text-gray-400">
            <p>Los datos de progreso de bienestar estarán disponibles próximamente</p>
          </div>
        </div>
      </div>

      {/* Recomendaciones Personalizadas */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#18314F">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-xl font-semibold text-[#18314F]">Recomendaciones Personalizadas</span>
          </div>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">3 nuevas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recomendación 1 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💤</div>
              <div className="flex-1">
                <h3 className="font-bold text-[#18314F] mb-2">Mejorar Descanso</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Intenta dormir al menos 8 horas por noche. Tu promedio actual es de 7.2 horas.
                </p>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  Alta prioridad
                </span>
              </div>
            </div>
          </div>

          {/* Recomendación 2 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🧘</div>
              <div className="flex-1">
                <h3 className="font-bold text-[#18314F] mb-2">Pausas Activas</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Toma descansos de 5 minutos cada hora. Realiza estiramientos suaves.
                </p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  Recomendado
                </span>
              </div>
            </div>
          </div>

          {/* Recomendación 3 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💧</div>
              <div className="flex-1">
                <h3 className="font-bold text-[#18314F] mb-2">Hidratación</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Mantén una botella de agua cerca. Meta: 2 litros al día.
                </p>
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                  Pendiente
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estado del Dispositivo y Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estado del Dispositivo */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#18314F] mb-6">Mi Dispositivo de Monitoreo</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Estado</div>
              <div className="text-2xl font-bold text-green-600 mb-1">Conectado</div>
              <div className="text-xs text-gray-500">Sincronizado hace 2 min</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Batería</div>
              <div className="text-2xl font-bold text-[#18314F] mb-1">87%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Lecturas Hoy</div>
              <div className="text-2xl font-bold text-[#18314F] mb-1">142</div>
              <div className="text-xs text-gray-500">Frecuencia: cada 5 min</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Firmware</div>
              <div className="text-2xl font-bold text-[#18314F] mb-1">v2.4.1</div>
              <div className="text-xs text-green-600">Actualizado</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#18314F] mb-6">Acciones Rápidas</h2>
          <div className="space-y-3">
            <button className="w-full bg-[#18314F] hover:bg-[#18314F]/90 text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Ver Mi Historial
            </button>
            <button className="w-full bg-white hover:bg-gray-50 text-[#18314F] font-medium py-3 px-4 rounded-xl border-2 border-[#18314F] transition-colors text-sm flex items-center justify-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Programar Descanso
            </button>
            <button className="w-full bg-white hover:bg-gray-50 text-[#18314F] font-medium py-3 px-4 rounded-xl border-2 border-[#18314F] transition-colors text-sm flex items-center justify-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Reportar Síntoma
            </button>
            <button className="w-full bg-white hover:bg-gray-50 text-[#18314F] font-medium py-3 px-4 rounded-xl border-2 border-[#18314F] transition-colors text-sm flex items-center justify-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Centro de Ayuda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
