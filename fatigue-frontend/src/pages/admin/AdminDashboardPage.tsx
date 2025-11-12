/**
 * Admin Dashboard Page
 * Dashboard principal para administradores con estadísticas y métricas
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
        <p className="text-base-content/60">
          Resumen general del sistema de monitoreo de fatiga
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Empleados"
          value={stats?.total_employees || 0}
          icon="👥"
          loading={loading}
        />
        <StatCard
          title="Dispositivos Activos"
          value={stats?.active_devices || 0}
          icon="⌚"
          loading={loading}
        />
        <StatCard
          title="Alertas Pendientes"
          value={stats?.pending_alerts || 0}
          icon="🚨"
          change={
            stats?.alerts_today
              ? {
                  value: ((stats.alerts_today / (stats.pending_alerts || 1)) * 100),
                  type: 'increase',
                }
              : undefined
          }
          loading={loading}
        />
        <StatCard
          title="Fatiga Promedio"
          value={stats?.avg_fatigue_score ? `${stats.avg_fatigue_score.toFixed(1)}%` : '0%'}
          icon="📊"
          loading={loading}
        />
      </div>

      {/* Recent Alerts */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title">Alertas Recientes (Últimas 24h)</h2>
            <button className="btn btn-primary btn-sm">Ver Todas</button>
          </div>

          {recentAlerts.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">
              <p className="text-4xl mb-2">✅</p>
              <p>No hay alertas recientes</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Mensaje</th>
                    <th>Severidad</th>
                    <th>Estado</th>
                    <th>Fatiga</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAlerts.map((alert) => (
                    <tr key={alert.id} className="hover">
                      <td>
                        <div className="font-semibold">{alert.employee_name}</div>
                      </td>
                      <td>{alert.message}</td>
                      <td>
                        <span className={`badge ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <progress
                            className="progress progress-error w-20"
                            value={alert.fatigue_score}
                            max="100"
                          ></progress>
                          <span className="text-sm">{alert.fatigue_score}%</span>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* High Risk Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Empleados en Riesgo Alto</h2>
            <p className="text-base-content/60 mb-4">
              {stats?.high_risk_employees || 0} empleados requieren atención
            </p>
            <div className="flex items-center justify-center p-8 text-base-content/40">
              <p>Cargando datos de empleados...</p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Actividad del Día</h2>
            <div className="stats stats-vertical shadow">
              <div className="stat">
                <div className="stat-title">Alertas Hoy</div>
                <div className="stat-value text-primary">{stats?.alerts_today || 0}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Dispositivos Activos</div>
                <div className="stat-value text-secondary">{stats?.active_devices || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tendencia de Fatiga (Última Semana) */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Tendencia de Fatiga - Última Semana</h2>
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
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Distribución de Alertas por Severidad</h2>
            <DoughnutChart
              labels={['Baja', 'Media', 'Alta', 'Crítica']}
              data={[12, 25, 18, 8]}
              colors={['#10b981', '#f59e0b', '#ef4444', '#991b1b']}
              height={250}
            />
          </div>
        </div>

        {/* Alertas por Departamento */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Alertas por Departamento</h2>
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

        {/* Empleados Monitoreados */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Estado de Empleados</h2>
            <DoughnutChart
              labels={['Normal', 'En Observación', 'Alto Riesgo']}
              data={[stats?.total_employees ? stats.total_employees - (stats.high_risk_employees || 0) - 5 : 40, 5, stats?.high_risk_employees || 3]}
              colors={['#10b981', '#f59e0b', '#ef4444']}
              height={250}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
