/**
 * Admin Dashboard Page
 * Dashboard principal para administradores - Diseño ZZZ Admin
 */

import { useState, useEffect } from 'react';
import { StatCard, LoadingSpinner } from '../../components/common';
import { LineChart, BarChart, DoughnutChart } from '../../components/charts';
import { dashboardService, alertService } from '../../services';
import type { DashboardStats, FatigueAlert } from '../../types';

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<FatigueAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, alerts] = await Promise.all([
        dashboardService.getDashboardStats(),
        alertService.getRecentAlerts(24),
      ]);
      setStats(dashboardStats);
      setRecentAlerts(alerts.slice(0, 5)); // Top 5 alerts
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'badge-error';
      case 'high':
        return 'badge-warning';
      case 'medium':
        return 'badge-info';
      default:
        return 'badge-ghost';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'acknowledged':
        return 'badge-info';
      case 'resolved':
        return 'badge-success';
      default:
        return 'badge-ghost';
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Cargando dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header con Quick Actions */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#18314F] mb-1">Dashboard General</h1>
        <p className="text-lg text-[#18314F]/70">Vista en tiempo real del estado de todos los empleados</p>
      </div>

      {/* Cards superiores - Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Empleados Activos */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Empleados Activos</span>
            <span className="bg-gray-100 rounded-full p-2">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-[#18314F]">{stats?.total_employees || 0}</span>
            <span className="flex items-center gap-1 text-green-600 font-semibold text-sm">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#22C55E"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 17l7-7 7 7" /></svg>
              +5 vs. ayer
            </span>
          </div>
        </div>

        {/* Alertas Críticas */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Alertas Críticas</span>
            <span className="bg-red-100 rounded-full p-2">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-[#E53E3E]">{stats?.pending_alerts || 0}</span>
            <span className="text-red-600 font-semibold text-sm">Requieren atención</span>
          </div>
        </div>

        {/* FC Promedio */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">FC Promedio</span>
            <span className="bg-green-100 rounded-full p-2">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 21C12 21 4 13.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.36 16 21 16 21H12Z" fill="#22C55E"/></svg>
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-[#18314F]">{stats?.avg_heart_rate || 0}</span>
            <span className="text-green-600 font-semibold text-sm">BPM en turno actual</span>
          </div>
        </div>

        {/* Nivel de Estrés */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Nivel de Estrés</span>
            <span className="bg-yellow-100 rounded-full p-2">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-yellow-500">{stats?.avg_stress_level ? `${stats.avg_stress_level}%` : '0%'}</span>
            <span className="text-yellow-600 font-semibold text-sm">Promedio general</span>
          </div>
        </div>
      </div>

      {/* Recent Alerts - Rediseñado */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 px-8 py-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#18314F"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v4m0 4h.01" /></svg>
            <span className="text-xl font-semibold text-[#18314F]">Alertas Recientes</span>
          </div>
          <button className="absolute top-6 right-8 flex items-center gap-1 text-[#18314F] hover:underline font-medium bg-white rounded-lg px-3 py-1 shadow-sm">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#18314F"><circle cx="12" cy="12" r="10" stroke="#18314F" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="#18314F" strokeWidth="2"/><path d="M12 9v2" stroke="#18314F" strokeWidth="2" strokeLinecap="round"/></svg>
            Ver Todas
          </button>
        </div>
        {/* Empty State */}
        {recentAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#18314F" className="mb-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            <p className="font-semibold text-2xl mb-2 text-[#18314F]">¡Todo en orden!</p>
            <p className="text-base text-[#18314F]/70">No hay alertas recientes</p>
          </div>
        ) : (
          // ...existing code for table of alerts...
          <div className="overflow-x-auto">
            {/* Aquí iría la tabla de alertas si existieran */}
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado de Empleados */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#18314F"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16M12 4v16" /></svg>
            <span className="text-lg font-semibold text-[#18314F]">Estado de Empleados</span>
          </div>
          <DoughnutChart
            labels={["Normal", "Advertencia", "Crítico"]}
            data={[45, 12, 3]}
            colors={["#22C55E", "#FACC15", "#EF4444"]}
            height={220}
          />
          <div className="flex flex-col gap-1 mt-4 text-sm">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#22C55E]"></span>Normal <span className="ml-auto font-semibold">45 empleados</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#FACC15]"></span>Advertencia <span className="ml-auto font-semibold">12 empleados</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>Crítico <span className="ml-auto font-semibold">3 empleados</span></div>
          </div>
        </div>

        {/* Nivel de Fatiga por Departamento */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#18314F"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v18h18" /></svg>
            <span className="text-lg font-semibold text-[#18314F]">Nivel de Fatiga por Departamento</span>
          </div>
          <BarChart
            labels={["Producción", "Almacén", "Mantenimiento", "Calidad"]}
            datasets={[
              { label: "Alto", data: [2, 1, 1, 0], backgroundColor: "#EF4444" },
              { label: "Bajo", data: [22, 15, 10, 8], backgroundColor: "#22C55E" },
              { label: "Moderado", data: [6, 5, 4, 2], backgroundColor: "#FACC15" }
            ]}
            height={220}
          />
          <div className="flex gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>Alto</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#22C55E]"></span>Bajo</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#FACC15]"></span>Moderado</div>
          </div>
        </div>
      </div>

      {/* Tendencias del Día */}
      <div className="mt-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#18314F"><circle cx="12" cy="12" r="10" stroke="#18314F" strokeWidth="2"/><path d="M8 12h8" stroke="#18314F" strokeWidth="2" strokeLinecap="round"/></svg>
            <span className="text-lg font-semibold text-[#18314F]">Tendencias del Día</span>
          </div>
          <LineChart
            labels={["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00"]}
            datasets={[
              { label: "Alertas Generadas", data: [2, 3, 3, 4, 5, 6, 3], borderColor: "#18314F", backgroundColor: "#18314F" },
              { label: "Nivel de Estrés", data: [20, 30, 45, 40, 55, 60, 48], borderColor: "#FACC15", backgroundColor: "#FACC15" },
              { label: "Nivel de Fatiga", data: [15, 25, 35, 30, 45, 55, 42], borderColor: "#EF4444", backgroundColor: "#EF4444" }
            ]}
            height={220}
          />
          <div className="flex gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#18314F]"></span>Alertas Generadas</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#FACC15]"></span>Nivel de Estrés</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>Nivel de Fatiga</div>
          </div>
        </div>
      </div>

      {/* Empleados en Riesgo y Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Empleados en Riesgo Alto */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-200 px-8 py-6 relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#18314F]">Empleados en Riesgo Alto</h2>
              <p className="text-sm text-[#18314F]/70">
                {stats?.high_risk_employees || 0} empleados requieren atención inmediata
              </p>
            </div>
            <button className="absolute top-6 right-8 flex items-center gap-1 text-[#E53E3E] font-medium bg-white rounded-lg px-3 py-1 shadow-sm border border-[#E53E3E]/30">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#E53E3E"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Alerta General
            </button>
          </div>
          {/* Employee Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-5 border border-gray-300 rounded-xl bg-white flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-gray-100 text-[#18314F] rounded-xl w-14 h-14 flex items-center justify-center">
                    <span className="font-bold text-lg">JD</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base text-[#18314F]">John Doe #{i}</h3>
                  <p className="text-sm text-[#18314F]/70">Producción - Turno A</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-block px-2 py-1 rounded bg-[#FEE2E2] text-[#E53E3E] text-xs font-semibold">Alta</span>
                    <span className="text-sm font-medium text-[#18314F]">Fatiga: 85%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad del Día */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 px-8 py-6">
          <h2 className="text-xl font-bold text-[#18314F] mb-6">Actividad del Día</h2>
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-semibold text-[#18314F]">Alertas Hoy</span>
                <span className="text-3xl font-bold text-[#18314F]">{stats?.alerts_today || 0}</span>
              </div>
              <div className="h-2 bg-gray-400 rounded"></div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-semibold text-[#18314F]">Dispositivos Activos</span>
                <span className="text-3xl font-bold text-[#18314F]">{stats?.active_devices || 0}</span>
              </div>
              <div className="h-2 bg-gray-400 rounded"></div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-semibold text-[#18314F]">Tasa de Respuesta</span>
                <span className="text-3xl font-bold text-[#18314F]">98%</span>
              </div>
              <div className="h-2 bg-green-600 rounded"></div>
            </div>
            <div className="mt-8">
              <span className="text-base font-semibold text-[#18314F] mb-2 inline-block">Estado del Sistema</span>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-[#18314F]">Todos los sistemas operativos</span>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-sm font-semibold text-[#18314F]">Uptime: 99.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
