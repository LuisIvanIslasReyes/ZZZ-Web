/**
 * Supervisor Dashboard Page
 * Dashboard específico para supervisores - Vista de su equipo
 * Diseño actualizado ZZZ Admin Style
 */

import { useState, useEffect } from 'react';
import { dashboardService } from '../../services';
import { LoadingSpinner } from '../../components/common';
import { DoughnutChart } from '../../components/charts';
import { useAuth } from '../../contexts';
import type { DashboardStats } from '../../types';

export function SupervisorDashboardPage() {
  const { user } = useAuth();
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/60">No se pudieron cargar los datos</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header con Empresa */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#18314F] mb-1">Dashboard del Supervisor</h1>
            <p className="text-lg text-[#18314F]/70">Monitoreo de tu equipo de trabajo</p>
          </div>
          {user?.company_name && (
            <div className="bg-[#18314F] text-white rounded-xl px-6 py-3 shadow-lg">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  <p className="text-xs text-white/70">Mi Empresa</p>
                  <p className="text-base font-bold">{user.company_name}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cards superiores - Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Empleados en mi Equipo */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Empleados en mi Equipo</span>
            <span className="bg-gray-100 rounded-full p-2">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-[#18314F]">{stats.total_employees}</span>
            <span className="flex items-center gap-1 text-green-600 font-semibold text-sm">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#22C55E"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 17l7-7 7 7" /></svg>
              {stats.active_devices} con dispositivos
            </span>
          </div>
        </div>

        {/* Alertas Activas */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Alertas Activas</span>
            <span className="bg-red-100 rounded-full p-2">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-bold ${stats.pending_alerts > 0 ? 'text-[#E53E3E]' : 'text-[#18314F]'}`}>{stats.pending_alerts}</span>
            <span className={`font-semibold text-sm ${stats.pending_alerts > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {stats.pending_alerts > 0 ? 'Requieren atención' : 'Todo normal'}
            </span>
          </div>
        </div>

        {/* Nivel Promedio de Fatiga */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Nivel Promedio de Fatiga</span>
            <span className={`rounded-full p-2 ${stats.avg_fatigue_score > 70 ? 'bg-red-100' : 'bg-green-100'}`}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-[#18314F]">{stats.avg_fatigue_score}%</span>
            <span className={`font-semibold text-sm ${stats.avg_fatigue_score > 70 ? 'text-red-600' : 'text-green-600'}`}>
              {stats.avg_fatigue_score > 70 ? 'Alto nivel' : 'Nivel controlado'}
            </span>
          </div>
        </div>

        {/* Empleados en Riesgo */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Empleados en Riesgo</span>
            <span className={`rounded-full p-2 ${(stats.high_risk_employees || 0) > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-bold ${(stats.high_risk_employees || 0) > 0 ? 'text-[#E53E3E]' : 'text-[#18314F]'}`}>{stats.high_risk_employees || 0}</span>
            <span className={`font-semibold text-sm ${(stats.high_risk_employees || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {(stats.high_risk_employees || 0) > 0 ? 'Acción requerida' : 'Equipo estable'}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Grid - Fila 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fatiga del Equipo - Últimos 7 días */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#18314F"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
            <span className="text-lg font-semibold text-[#18314F]">Tendencia de Fatiga del Equipo</span>
          </div>
          <p className="text-sm text-[#18314F]/70 mb-4">Últimos 7 días</p>
          <div className="flex items-center justify-center h-[220px] text-gray-400">
            <p>Los datos de tendencia de fatiga estarán disponibles próximamente</p>
          </div>
          <div className="flex gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#18314F]"></span>Promedio del Equipo</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>Nivel Crítico (80%)</div>
          </div>
        </div>

        {/* Estado del Equipo */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#18314F"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16M12 4v16" /></svg>
            <span className="text-lg font-semibold text-[#18314F]">Estado del Equipo</span>
          </div>
          <p className="text-sm text-[#18314F]/70 mb-4">Distribución por nivel de riesgo</p>
          {stats.high_risk_employees !== undefined && stats.high_risk_employees > 0 ? (
            <DoughnutChart
              labels={['Normal', 'Alto Riesgo']}
              data={[
                stats.total_employees - (stats.high_risk_employees || 0),
                stats.high_risk_employees || 0
              ]}
              colors={['#22C55E', '#EF4444']}
              height={220}
            />
          ) : (
            <div className="flex items-center justify-center h-[220px] text-gray-400">
              <p>No hay datos de riesgo disponibles</p>
            </div>
          )}
          <div className="flex flex-col gap-1 mt-4 text-sm">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#22C55E]"></span>Normal <span className="ml-auto font-semibold">{stats.total_employees - (stats.high_risk_employees || 0)} empleados</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>Alto Riesgo <span className="ml-auto font-semibold">{stats.high_risk_employees || 0} empleados</span></div>
          </div>
        </div>
      </div>

      {/* Charts Grid - Fila 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productividad vs Fatiga */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#18314F"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v18h18" /></svg>
            <span className="text-lg font-semibold text-[#18314F]">Productividad vs Fatiga</span>
          </div>
          <p className="text-sm text-[#18314F]/70 mb-4">Correlación semanal</p>
          <div className="flex items-center justify-center h-[220px] text-gray-400">
            <p>Los datos de productividad vs fatiga estarán disponibles próximamente</p>
          </div>
          <div className="flex gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#22C55E]"></span>Productividad (%)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>Fatiga Promedio (%)</div>
          </div>
        </div>

        {/* Horas de Trabajo del Equipo */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#18314F"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-lg font-semibold text-[#18314F]">Horas de Trabajo del Equipo</span>
          </div>
          <p className="text-sm text-[#18314F]/70 mb-4">Comparación con recomendaciones</p>
          <div className="flex items-center justify-center h-[220px] text-gray-400">
            <p>Los datos de horas de trabajo estarán disponibles próximamente</p>
          </div>
          <div className="flex gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#18314F]"></span>Horas Trabajadas</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#8B5CF6]"></span>Horas Recomendadas</div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 px-8 py-6">
        <h2 className="text-xl font-semibold text-[#18314F] mb-6">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 bg-[#18314F] hover:bg-[#18314F]/90 text-white font-medium py-3 px-6 rounded-xl transition-colors">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Generar Reporte Semanal
          </button>
          <button className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#18314F] font-medium py-3 px-6 rounded-xl border-2 border-[#18314F] transition-colors">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            Enviar Notificación al Equipo
          </button>
          <button className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#18314F] font-medium py-3 px-6 rounded-xl border-2 border-[#18314F] transition-colors">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Ver Detalles del Equipo
          </button>
        </div>
      </div>
    </div>
  );
}
