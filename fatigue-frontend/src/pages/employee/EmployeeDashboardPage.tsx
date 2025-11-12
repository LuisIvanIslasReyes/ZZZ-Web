/**
 * Employee Dashboard Page
 * Dashboard personal para empleados - Métricas individuales
 */

import { useState, useEffect } from 'react';
import { dashboardService } from '../../services';
import { StatCard, LoadingSpinner } from '../../components/common';
import { LineChart, DoughnutChart, BarChart } from '../../components/charts';
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

  // Simular datos personales del empleado
  const myFatigueLevel = stats.avg_fatigue_score;
  const myRiskLevel = myFatigueLevel > 70 ? 'Alto' : myFatigueLevel > 50 ? 'Medio' : 'Bajo';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Mi Dashboard Personal</h1>
        <p className="text-base-content/60">Monitoreo de tu salud y bienestar</p>
      </div>

      {/* Alert Banner - Si hay nivel alto de fatiga */}
      {myFatigueLevel > 70 && (
        <div className="alert alert-warning shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h3 className="font-bold">Nivel de fatiga elevado</h3>
            <div className="text-xs">
              Te recomendamos tomar un descanso y consultar las recomendaciones personalizadas.
            </div>
          </div>
          <button className="btn btn-sm btn-ghost">Ver Recomendaciones</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Mi Nivel de Fatiga Actual"
          value={`${myFatigueLevel}%`}
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          }
          trend={myFatigueLevel > 70 ? 'Nivel alto' : myFatigueLevel > 50 ? 'Nivel medio' : 'Nivel normal'}
          trendUp={myFatigueLevel > 70}
          variant={myFatigueLevel > 70 ? 'error' : myFatigueLevel > 50 ? 'warning' : 'success'}
        />

        <StatCard
          title="Nivel de Riesgo"
          value={myRiskLevel}
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          }
          trend={myRiskLevel === 'Alto' ? 'Requiere atención' : 'Bajo control'}
          trendUp={false}
          variant={myRiskLevel === 'Alto' ? 'error' : myRiskLevel === 'Medio' ? 'warning' : 'success'}
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          }
          trend={stats.pending_alerts > 0 ? 'Revisar alertas' : 'Sin alertas'}
          trendUp={false}
          variant={stats.pending_alerts > 0 ? 'warning' : 'success'}
        />

        <StatCard
          title="Horas de Descanso Hoy"
          value="7.5h"
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
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          }
          trend="Recomendado: 8h"
          trendUp={false}
          variant="info"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mi Historial de Fatiga */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Mi Historial de Fatiga</h2>
            <p className="text-sm text-base-content/60">Últimos 7 días</p>
            <LineChart
              labels={['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']}
              datasets={[
                {
                  label: 'Mi Nivel de Fatiga',
                  data: [42, 55, 48, 62, 58, 45, myFatigueLevel],
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true,
                },
                {
                  label: 'Promedio del Equipo',
                  data: [45, 52, 48, 58, 62, 55, 50],
                  borderColor: 'rgb(139, 92, 246)',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  fill: true,
                },
              ]}
              height={300}
            />
          </div>
        </div>

        {/* Estado de Salud Integral */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Estado de Salud Integral</h2>
            <p className="text-sm text-base-content/60">Indicadores principales</p>
            <DoughnutChart
              labels={['Fatiga Física', 'Fatiga Mental', 'Estrés', 'Descanso']}
              data={[myFatigueLevel, 45, 38, 85]}
              colors={['#ef4444', '#f59e0b', '#8b5cf6', '#10b981']}
              height={300}
            />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Semanal */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Mi Actividad Semanal</h2>
            <p className="text-sm text-base-content/60">Horas de trabajo vs descanso</p>
            <BarChart
              labels={['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']}
              datasets={[
                {
                  label: 'Horas Trabajadas',
                  data: [9, 10, 8, 9.5, 11, 0, 0],
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                },
                {
                  label: 'Horas de Descanso',
                  data: [7, 6.5, 8, 7, 6, 9, 9],
                  backgroundColor: 'rgba(16, 185, 129, 0.8)',
                },
              ]}
              height={300}
            />
          </div>
        </div>

        {/* Progreso Semanal */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Progreso de Bienestar</h2>
            <p className="text-sm text-base-content/60">Comparación semanal</p>
            <LineChart
              labels={['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4']}
              datasets={[
                {
                  label: 'Puntuación de Bienestar',
                  data: [65, 72, 68, 75],
                  borderColor: 'rgb(16, 185, 129)',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  fill: true,
                },
              ]}
              height={300}
            />
          </div>
        </div>
      </div>

      {/* Recomendaciones Personalizadas */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Recomendaciones Personalizadas</h2>
            <div className="badge badge-primary">3 nuevas</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recomendación 1 */}
            <div className="card bg-base-200">
              <div className="card-body">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">💤</div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-2">Mejorar Descanso</h3>
                    <p className="text-sm text-base-content/70">
                      Intenta dormir al menos 8 horas por noche. Tu promedio actual es de 7.2 horas.
                    </p>
                    <div className="badge badge-sm badge-info mt-2">Alta prioridad</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recomendación 2 */}
            <div className="card bg-base-200">
              <div className="card-body">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🧘</div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-2">Pausas Activas</h3>
                    <p className="text-sm text-base-content/70">
                      Toma descansos de 5 minutos cada hora. Realiza estiramientos suaves.
                    </p>
                    <div className="badge badge-sm badge-success mt-2">Recomendado</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recomendación 3 */}
            <div className="card bg-base-200">
              <div className="card-body">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">💧</div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-2">Hidratación</h3>
                    <p className="text-sm text-base-content/70">
                      Mantén una botella de agua cerca. Meta: 2 litros al día.
                    </p>
                    <div className="badge badge-sm badge-warning mt-2">Pendiente</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estado del Dispositivo */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Mi Dispositivo de Monitoreo</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Estado</div>
              <div className="stat-value text-sm text-success">Conectado</div>
              <div className="stat-desc">Sincronizado hace 2 min</div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Batería</div>
              <div className="stat-value text-sm">87%</div>
              <div className="stat-desc">
                <progress className="progress progress-success w-full" value="87" max="100"></progress>
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Lecturas Hoy</div>
              <div className="stat-value text-sm">142</div>
              <div className="stat-desc">Frecuencia: cada 5 min</div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Firmware</div>
              <div className="stat-value text-sm">v2.4.1</div>
              <div className="stat-desc text-success">Actualizado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              Ver Mi Historial
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Programar Descanso
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              Reportar Síntoma
            </button>
            <button className="btn btn-outline btn-info">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Centro de Ayuda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
