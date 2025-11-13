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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Panel de Control</h1>
          <p className="text-base-content/60 text-lg">
            Bienvenido al sistema de monitoreo de fatiga laboral
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Empleado
          </button>
          <button className="btn btn-outline gap-2 hover:shadow-md transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar Datos
          </button>
        </div>
      </div>

      {/* Stats Grid - Modernizado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Empleados */}
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
          <div className="card-body p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-blue-100 text-sm font-medium mb-2">Total Empleados</p>
                <h3 className="text-5xl font-bold mb-3">{stats?.total_employees || 0}</h3>
                <div className="flex items-center gap-1 text-blue-100 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>+12% vs mes anterior</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Dispositivos Activos */}
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
          <div className="card-body p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-green-100 text-sm font-medium mb-2">Dispositivos Activos</p>
                <h3 className="text-5xl font-bold mb-3">{stats?.active_devices || 0}</h3>
                <div className="flex items-center gap-2 text-green-100 text-sm">
                  <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse"></div>
                  <span>En línea ahora</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas Pendientes */}
        <div className="card bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
          <div className="card-body p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-amber-100 text-sm font-medium mb-2">Alertas Pendientes</p>
                <h3 className="text-5xl font-bold mb-3">{stats?.pending_alerts || 0}</h3>
                <div className="flex items-center gap-1 text-amber-100 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{stats?.alerts_today || 0} hoy</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Fatiga Promedio */}
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
          <div className="card-body p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-purple-100 text-sm font-medium mb-2">Fatiga Promedio</p>
                <h3 className="text-5xl font-bold mb-3">{stats?.avg_fatigue_score ? `${stats.avg_fatigue_score.toFixed(1)}%` : '0%'}</h3>
                <div className="flex items-center gap-1 text-purple-100 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                  <span>-5% vs semana anterior</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts - Rediseñado */}
      <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
        <div className="card-body p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="card-title text-2xl mb-1">Alertas Recientes</h2>
              <p className="text-sm text-base-content/60">Últimas 24 horas</p>
            </div>
            <button className="btn btn-primary gap-2 shadow-md hover:shadow-lg transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Ver Todas
            </button>
          </div>

          {recentAlerts.length === 0 ? (
            <div className="text-center py-16 bg-base-200/50 rounded-2xl">
              <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold text-xl mb-2">¡Todo en orden!</p>
              <p className="text-base-content/60">No hay alertas recientes</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-lg">
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Mensaje</th>
                    <th>Severidad</th>
                    <th>Estado</th>
                    <th>Nivel de Fatiga</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-base-200 transition-colors cursor-pointer">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-lg w-12 h-12">
                              <span className="text-sm font-bold">{alert.employee_name?.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-base">{alert.employee_name}</div>
                            <div className="text-sm text-base-content/60">ID: #{alert.employee_id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="max-w-xs">
                          <p className="text-sm">{alert.message}</p>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getSeverityColor(alert.severity)} gap-1`}>
                          {alert.severity === 'critical' && '🔴'}
                          {alert.severity === 'high' && '🟠'}
                          {alert.severity === 'medium' && '🟡'}
                          {alert.severity}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="radial-progress text-sm" style={{"--value": alert.fatigue_score, "--size": "3rem", "--thickness": "4px"} as React.CSSProperties} role="progressbar">
                            <span className="font-bold">{alert.fatigue_score}%</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {new Date(alert.created_at).toLocaleString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                          })}
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-sm hover:btn-primary transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendencia de Fatiga */}
        <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
          <div className="card-body p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="card-title text-xl">Tendencia de Fatiga</h2>
                <p className="text-sm text-base-content/60">Última semana</p>
              </div>
              <button className="btn btn-ghost btn-sm btn-circle hover:bg-base-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
            <LineChart
              labels={['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']}
              datasets={[
                {
                  label: 'Fatiga Promedio',
                  data: [45, 52, 48, 58, 62, 55, 42],
                },
                {
                  label: 'Fatiga Máxima',
                  data: [78, 82, 75, 85, 88, 80, 72],
                },
              ]}
              height={250}
            />
          </div>
        </div>

        {/* Alertas por Severidad */}
        <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
          <div className="card-body p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="card-title text-xl">Alertas por Severidad</h2>
                <p className="text-sm text-base-content/60">Distribución actual</p>
              </div>
            </div>
            <DoughnutChart
              labels={['Baja', 'Media', 'Alta', 'Crítica']}
              data={[12, 25, 18, 8]}
              colors={['#10b981', '#f59e0b', '#ef4444', '#991b1b']}
              height={250}
            />
          </div>
        </div>

        {/* Alertas por Departamento */}
        <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
          <div className="card-body p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="card-title text-xl">Alertas por Departamento</h2>
                <p className="text-sm text-base-content/60">Top 5 departamentos</p>
              </div>
            </div>
            <BarChart
              labels={['IT', 'Operaciones', 'RRHH', 'Producción', 'Logística']}
              datasets={[
                {
                  label: 'Alertas',
                  data: [12, 28, 8, 35, 15],
                },
              ]}
              height={250}
            />
          </div>
        </div>

        {/* Estado de Empleados */}
        <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
          <div className="card-body p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="card-title text-xl">Estado de Empleados</h2>
                <p className="text-sm text-base-content/60">Clasificación por riesgo</p>
              </div>
            </div>
            <DoughnutChart
              labels={['Normal', 'En Observación', 'Alto Riesgo']}
              data={[stats?.total_employees ? stats.total_employees - (stats.high_risk_employees || 0) - 5 : 40, 5, stats?.high_risk_employees || 3]}
              colors={['#10b981', '#f59e0b', '#ef4444']}
              height={250}
            />
          </div>
        </div>
      </div>

      {/* Empleados en Riesgo y Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Empleados en Riesgo Alto */}
        <div className="lg:col-span-2 card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
          <div className="card-body p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="card-title text-xl">Empleados en Riesgo Alto</h2>
                <p className="text-sm text-base-content/60">
                  {stats?.high_risk_employees || 0} empleados requieren atención inmediata
                </p>
              </div>
              <button className="btn btn-error gap-2 shadow-md hover:shadow-lg transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Alerta General
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-5 bg-error/5 border border-error/20 rounded-xl hover:bg-error/10 hover:border-error/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-error text-error-content rounded-xl w-14 h-14">
                        <span className="font-bold">JD</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base">John Doe #{i}</h3>
                      <p className="text-sm text-base-content/60">Producción - Turno A</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="badge badge-error">Alta</div>
                        <span className="text-sm font-medium">Fatiga: 85%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actividad del Día */}
        <div className="card bg-gradient-to-br from-primary to-primary-focus text-white shadow-xl hover:shadow-2xl transition-shadow">
          <div className="card-body p-8">
            <h2 className="card-title text-xl mb-6">Actividad del Día</h2>
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-primary-content/90 font-medium">Alertas Hoy</span>
                  <span className="text-3xl font-bold">{stats?.alerts_today || 0}</span>
                </div>
                <progress className="progress progress-warning bg-white/20 h-3" value={stats?.alerts_today || 0} max="50"></progress>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-primary-content/90 font-medium">Dispositivos Activos</span>
                  <span className="text-3xl font-bold">{stats?.active_devices || 0}</span>
                </div>
                <progress className="progress progress-success bg-white/20 h-3" value={stats?.active_devices || 0} max={stats?.total_employees || 60}></progress>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-primary-content/90 font-medium">Tasa de Respuesta</span>
                  <span className="text-3xl font-bold">98%</span>
                </div>
                <progress className="progress progress-info bg-white/20 h-3" value="98" max="100"></progress>
              </div>

              <div className="divider my-6"></div>

              <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-semibold text-lg">Estado del Sistema</span>
                </div>
                <p className="text-sm text-primary-content/90 mb-3">Todos los sistemas operativos</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Uptime: 99.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
