/**
 * Supervisor Dashboard Page
 * Dashboard específico para supervisores - Vista de su equipo
 */

import { useState, useEffect } from 'react';
import { dashboardService } from '../../services';
import { StatCard, LoadingSpinner } from '../../components/common';
import { LineChart, BarChart, DoughnutChart } from '../../components/charts';
import type { DashboardStats } from '../../types';

export function SupervisorDashboardPage() {
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard del Supervisor</h1>
        <p className="text-base-content/60">Monitoreo de tu equipo de trabajo</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Empleados en mi Equipo"
          value={stats.total_employees}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
          trend={`${stats.active_devices} con dispositivos`}
          trendUp={true}
        />

        <StatCard
          title="Alertas Activas"
          value={stats.pending_alerts}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          }
          trend={stats.pending_alerts > 0 ? 'Requiere atención' : 'Todo normal'}
          trendUp={false}
          variant={stats.pending_alerts > 0 ? 'warning' : 'success'}
        />

        <StatCard
          title="Nivel Promedio de Fatiga"
          value={`${stats.avg_fatigue_score}%`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
          trend={stats.avg_fatigue_score > 70 ? 'Alto nivel' : 'Nivel controlado'}
          trendUp={stats.avg_fatigue_score > 70}
          variant={stats.avg_fatigue_score > 70 ? 'error' : 'success'}
        />

        <StatCard
          title="Empleados en Riesgo"
          value={stats.high_risk_employees || 0}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          trend={stats.high_risk_employees > 0 ? 'Acción requerida' : 'Equipo estable'}
          trendUp={false}
          variant={stats.high_risk_employees > 0 ? 'error' : 'success'}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fatiga del Equipo - Últimos 7 días */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Tendencia de Fatiga del Equipo</h2>
            <p className="text-sm text-base-content/60">Últimos 7 días</p>
            <LineChart
              labels={['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']}
              datasets={[
                {
                  label: 'Promedio del Equipo',
                  data: [45, 52, 48, 58, 62, 55, 42],
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true,
                },
                {
                  label: 'Nivel Crítico',
                  data: [80, 80, 80, 80, 80, 80, 80],
                  borderColor: 'rgb(239, 68, 68)',
                  backgroundColor: 'transparent',
                  fill: false,
                },
              ]}
              height={300}
            />
          </div>
        </div>

        {/* Estado de Empleados */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Estado del Equipo</h2>
            <p className="text-sm text-base-content/60">Distribución por nivel de riesgo</p>
            <DoughnutChart
              labels={['Normal', 'Observación', 'Alto Riesgo']}
              data={[
                stats.total_employees - (stats.high_risk_employees || 0) - Math.floor(stats.total_employees * 0.2),
                Math.floor(stats.total_employees * 0.2),
                stats.high_risk_employees || 0
              ]}
              colors={['#10b981', '#f59e0b', '#ef4444']}
              height={300}
            />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productividad vs Fatiga */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Productividad vs Fatiga</h2>
            <p className="text-sm text-base-content/60">Correlación semanal</p>
            <BarChart
              labels={['Lun', 'Mar', 'Mié', 'Jue', 'Vie']}
              datasets={[
                {
                  label: 'Productividad (%)',
                  data: [85, 78, 82, 72, 68],
                  backgroundColor: 'rgba(16, 185, 129, 0.8)',
                },
                {
                  label: 'Fatiga Promedio (%)',
                  data: [45, 52, 48, 58, 62],
                  backgroundColor: 'rgba(239, 68, 68, 0.8)',
                },
              ]}
              height={300}
            />
          </div>
        </div>

        {/* Horas Trabajadas vs Recomendadas */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Horas de Trabajo del Equipo</h2>
            <p className="text-sm text-base-content/60">Comparación con recomendaciones</p>
            <BarChart
              labels={['Empleado 1', 'Empleado 2', 'Empleado 3', 'Empleado 4', 'Empleado 5']}
              datasets={[
                {
                  label: 'Horas Trabajadas',
                  data: [45, 52, 48, 42, 50],
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                },
                {
                  label: 'Horas Recomendadas',
                  data: [40, 40, 40, 40, 40],
                  backgroundColor: 'rgba(139, 92, 246, 0.8)',
                },
              ]}
              height={300}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn btn-outline btn-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Generar Reporte Semanal
            </button>
            <button className="btn btn-outline btn-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              Enviar Notificación al Equipo
            </button>
            <button className="btn btn-outline btn-accent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Ver Detalles del Equipo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
