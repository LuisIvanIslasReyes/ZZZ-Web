/**
 * Supervisor Team Alerts Page
 * Gestión de alertas del equipo
 * Diseño ZZZ Admin Style
 */

import { useState, useEffect } from 'react';
import { alertService } from '../../services';
import { LoadingSpinner } from '../../components/common';
import type { FatigueAlert } from '../../types';

export function SupervisorTeamAlertsPage() {
  const [alerts, setAlerts] = useState<FatigueAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setIsLoading(true);
      const data = await alertService.getRecentAlerts(168); // Última semana
      setAlerts(data);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcknowledge = async (alertId: number) => {
    try {
      await alertService.acknowledgeAlert(alertId);
      await loadAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const handleResolve = async (alertId: number) => {
    try {
      await alertService.resolveAlert(alertId);
      await loadAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#DC2626">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'high':
      case 'medium':
        return (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#F59E0B">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Pendiente</span>;
      case 'acknowledged':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Reconocida</span>;
      case 'resolved':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Resuelta</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    return matchesSeverity && matchesStatus;
  });

  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'pending').length;
  const pendingCount = alerts.filter(a => a.status === 'pending').length;
  const acknowledgedCount = alerts.filter(a => a.status === 'acknowledged').length;
  const resolvedToday = alerts.filter(a => a.status === 'resolved' && new Date(a.created_at).toDateString() === new Date().toDateString()).length;

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Cargando alertas..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#18314F] mb-1">Team Alerts</h1>
        <p className="text-lg text-[#18314F]/70">Gestión y seguimiento de alertas del equipo</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Alertas Críticas</span>
            <span className="bg-red-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#DC2626">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <span className="text-4xl font-bold text-red-600">{criticalCount}</span>
          <p className="text-sm text-gray-500 mt-1">Requieren atención inmediata</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Pendientes</span>
            <span className="bg-yellow-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#F59E0B">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <span className="text-4xl font-bold text-yellow-600">{pendingCount}</span>
          <p className="text-sm text-gray-500 mt-1">Por revisar</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Reconocidas</span>
            <span className="bg-blue-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </span>
          </div>
          <span className="text-4xl font-bold text-blue-600">{acknowledgedCount}</span>
          <p className="text-sm text-gray-500 mt-1">En proceso</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Resueltas Hoy</span>
            <span className="bg-green-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#22C55E">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <span className="text-4xl font-bold text-green-600">{resolvedToday}</span>
          <p className="text-sm text-gray-500 mt-1">Completadas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="font-semibold text-[#18314F] mb-2">Filtrar por Severidad</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterSeverity('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
                  filterSeverity === 'all' ? 'bg-[#18314F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilterSeverity('critical')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
                  filterSeverity === 'critical' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Críticas
              </button>
              <button
                onClick={() => setFilterSeverity('high')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
                  filterSeverity === 'high' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Altas
              </button>
              <button
                onClick={() => setFilterSeverity('medium')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
                  filterSeverity === 'medium' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Medias
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#18314F] mb-2">Filtrar por Estado</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
                  filterStatus === 'all' ? 'bg-[#18314F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
                  filterStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setFilterStatus('acknowledged')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
                  filterStatus === 'acknowledged' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Reconocidas
              </button>
              <button
                onClick={() => setFilterStatus('resolved')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
                  filterStatus === 'resolved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Resueltas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <svg className="mx-auto mb-4" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#18314F">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-[#18314F] mb-2">No hay alertas</h3>
            <p className="text-gray-500">No se encontraron alertas con los filtros seleccionados</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert.id} className={`bg-white rounded-2xl shadow-md p-6 border-l-4 ${
              alert.severity === 'critical' ? 'border-red-500' :
              alert.severity === 'high' ? 'border-orange-500' :
              alert.severity === 'medium' ? 'border-yellow-500' : 'border-blue-500'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getSeverityIcon(alert.severity)}
                    <h3 className="text-lg font-semibold text-[#18314F]">{alert.alert_type}</h3>
                    {getStatusBadge(alert.status)}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{alert.message}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Empleado #{alert.employee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{new Date(alert.created_at).toLocaleString('es-ES')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {alert.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors text-sm"
                      >
                        Reconocer
                      </button>
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl transition-colors text-sm"
                      >
                        Resolver
                      </button>
                    </>
                  )}
                  {alert.status === 'acknowledged' && (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl transition-colors text-sm"
                    >
                      Resolver
                    </button>
                  )}
                  {alert.status === 'resolved' && (
                    <span className="text-green-600 font-semibold py-2 px-4">✓ Completada</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
