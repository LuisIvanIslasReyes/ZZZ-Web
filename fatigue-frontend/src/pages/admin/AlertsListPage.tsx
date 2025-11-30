/**
 * Alerts List Page
 * Página de listado y gestión de alertas
 */

import { useState, useEffect } from 'react';
import { alertService } from '../../services';
import { Table, Modal, SearchBar } from '../../components/common';
import { AlertWorkflowModal } from '../../components/alerts';
import toast from 'react-hot-toast';
import type { Column, TableAction } from '../../components/common';
import type { FatigueAlert } from '../../types';

export function AlertsListPage() {
  const [alerts, setAlerts] = useState<FatigueAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<FatigueAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<FatigueAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [workflowAlert, setWorkflowAlert] = useState<FatigueAlert | null>(null);
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedAlerts, setSelectedAlerts] = useState<number[]>([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, alerts, severityFilter, statusFilter, dateFilter]);

  const applyFilters = () => {
    let filtered = [...alerts];

    // Filtro de búsqueda
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(
        (alert) =>
          (alert.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
          (alert.alert_type?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
    }

    // Filtro de severidad
    if (severityFilter) {
      filtered = filtered.filter((alert) => alert.severity === severityFilter);
    }

    // Filtro de estado
    if (statusFilter) {
      filtered = filtered.filter((alert) => alert.status === statusFilter);
    }

    // Filtro de fecha
    if (dateFilter) {
      const now = new Date();
      const hours = parseInt(dateFilter);
      const cutoffDate = new Date(now.getTime() - hours * 60 * 60 * 1000);
      filtered = filtered.filter((alert) => new Date(alert.created_at) >= cutoffDate);
    }

    setFilteredAlerts(filtered);
  };

  const loadAlerts = async () => {
    try {
      setIsLoading(true);
      const data = await alertService.getAllAlerts();
      setAlerts(data);
      setFilteredAlerts(data);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageAlert = (alert: FatigueAlert) => {
    setWorkflowAlert(alert);
    setIsWorkflowModalOpen(true);
  };

  const handleBulkAction = async (action: 'acknowledge' | 'resolve' | 'dismiss') => {
    if (selectedAlerts.length === 0) {
      toast.error('Selecciona al menos una alerta');
      return;
    }

    const actionLabels = {
      acknowledge: 'reconocidas',
      resolve: 'resueltas',
      dismiss: 'descartadas',
    };

    if (!confirm(`¿Estás seguro de que deseas ${actionLabels[action]} ${selectedAlerts.length} alerta(s)?`)) {
      return;
    }

    try {
      const promises = selectedAlerts.map((id) => {
        switch (action) {
          case 'acknowledge':
            return alertService.acknowledgeAlert(id);
          case 'resolve':
            return alertService.resolveAlert(id);
          case 'dismiss':
            return alertService.dismissAlert(id);
        }
      });

      await Promise.all(promises);
      toast.success(`✓ ${selectedAlerts.length} alerta(s) ${actionLabels[action]} exitosamente`);
      setSelectedAlerts([]);
      loadAlerts();
    } catch (error) {
      console.error('Error in bulk action:', error);
      toast.error('Error al procesar las alertas');
    }
  };

  const handleViewDetails = (alert: FatigueAlert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const toggleAlertSelection = (id: number) => {
    setSelectedAlerts((prev) =>
      prev.includes(id) ? prev.filter((alertId) => alertId !== id) : [...prev, id]
    );
  };

  const toggleAllAlerts = () => {
    if (selectedAlerts.length === filteredAlerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(filteredAlerts.map((alert) => alert.id));
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
      case 'low':
        return 'badge-success';
      default:
        return 'badge-ghost';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'Crítica';
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return severity;
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
      case 'false_positive':
        return 'badge-ghost';
      default:
        return 'badge-ghost';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'acknowledged':
        return 'Reconocida';
      case 'resolved':
        return 'Resuelta';
      case 'false_positive':
        return 'Falso Positivo';
      default:
        return status;
    }
  };

  const columns: Column<FatigueAlert>[] = [
    {
      key: 'checkbox',
      label: (
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={selectedAlerts.length === filteredAlerts.length && filteredAlerts.length > 0}
          onChange={toggleAllAlerts}
        />
      ),
      render: (alert) => (
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={selectedAlerts.includes(alert.id)}
          onChange={() => toggleAlertSelection(alert.id)}
        />
      ),
    },
    {
      key: 'created_at',
      label: 'Fecha',
      render: (alert) => new Date(alert.created_at).toLocaleString(),
    },
    {
      key: 'employee_name',
      label: 'Empleado',
    },
    {
      key: 'alert_type',
      label: 'Tipo',
      render: (alert) => {
        const types: Record<string, string> = {
          high_fatigue: 'Fatiga Alta',
          critical_fatigue: 'Fatiga Crítica',
          abnormal_heart_rate: 'FC Anormal',
          low_spo2: 'SpO2 Bajo',
          pattern_detected: 'Patrón Detectado',
        };
        return alert.alert_type ? (types[alert.alert_type] || alert.alert_type) : 'N/A';
      },
    },
    {
      key: 'severity',
      label: 'Severidad',
      render: (alert) => (
        <span className={`badge ${getSeverityColor(alert.severity)}`}>
          {getSeverityLabel(alert.severity)}
        </span>
      ),
    },
    {
      key: 'fatigue_score',
      label: 'Score Fatiga',
      render: (alert) => (
        <div className="flex items-center gap-2">
          <progress
            className={`progress ${
              alert.fatigue_score >= 80
                ? 'progress-error'
                : alert.fatigue_score >= 60
                ? 'progress-warning'
                : 'progress-success'
            } w-20`}
            value={alert.fatigue_score}
            max="100"
          ></progress>
          <span className="text-xs font-mono">{alert.fatigue_score}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (alert) => (
        <span className={`badge ${getStatusColor(alert.status)}`}>
          {getStatusLabel(alert.status)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alertas de Fatiga</h1>
          <p className="text-gray-600 mt-1">Gestión y monitoreo de alertas del sistema</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => {
            setSeverityFilter('critical');
            setStatusFilter('');
          }}
          className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all ${
            severityFilter === 'critical' ? 'ring-2 ring-red-500' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">Alertas Críticas</h3>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-red-600 mb-1">
            {alerts.filter((a) => a.severity === 'critical').length}
          </div>
          <p className="text-sm text-gray-500">Requieren atención inmediata</p>
        </button>

        <button
          onClick={() => {
            setSeverityFilter('');
            setStatusFilter('pending');
          }}
          className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all ${
            statusFilter === 'pending' && !severityFilter ? 'ring-2 ring-yellow-500' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">Pendientes</h3>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-yellow-600 mb-1">
            {alerts.filter((a) => a.status === 'pending').length}
          </div>
          <p className="text-sm text-gray-500">Por revisar</p>
        </button>

        <button
          onClick={() => {
            setSeverityFilter('');
            setStatusFilter('acknowledged');
          }}
          className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all ${
            statusFilter === 'acknowledged' && !severityFilter ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">Reconocidas</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-blue-600 mb-1">
            {alerts.filter((a) => a.status === 'acknowledged').length}
          </div>
          <p className="text-sm text-gray-500">En proceso</p>
        </button>

        <button
          onClick={() => {
            setSeverityFilter('');
            setStatusFilter('resolved');
          }}
          className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all ${
            statusFilter === 'resolved' && !severityFilter ? 'ring-2 ring-green-500' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">Resueltas Hoy</h3>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-green-600 mb-1">
            {alerts.filter((a) => a.status === 'resolved').length}
          </div>
          <p className="text-sm text-gray-500">Completadas</p>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-semibold text-gray-900">Filtros Activos</h3>
          {(severityFilter || statusFilter || dateFilter || searchTerm) && (
            <button
              onClick={() => {
                setSeverityFilter('');
                setStatusFilter('');
                setDateFilter('');
                setSearchTerm('');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar filtros
            </button>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por empleado o tipo..."
            className="flex-1"
          />
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="">Todas las severidades</option>
            <option value="critical">Crítica</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="acknowledged">Reconocidas</option>
            <option value="resolved">Resueltas</option>
            <option value="dismissed">Descartadas</option>
          </select>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="">Todo el tiempo</option>
            <option value="24">Últimas 24 horas</option>
            <option value="168">Últimos 7 días</option>
            <option value="720">Últimos 30 días</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedAlerts.length > 0 && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <span className="font-semibold text-blue-900">
              {selectedAlerts.length} {selectedAlerts.length === 1 ? 'alerta seleccionada' : 'alertas seleccionadas'}
            </span>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => handleBulkAction('acknowledge')}
                className="btn btn-sm btn-info gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Reconocer
              </button>
              <button
                onClick={() => handleBulkAction('resolve')}
                className="btn btn-sm btn-success gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resolver
              </button>
              <button
                onClick={() => handleBulkAction('dismiss')}
                className="btn btn-sm btn-ghost gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Descartar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18314F] mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando alertas...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron alertas</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {columns.map((col, idx) => (
                    <th key={idx} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {typeof col.label === 'string' ? col.label : col.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50">
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                        {col.render ? col.render(alert) : String(alert[col.key as keyof FatigueAlert] ?? '')}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {(alert.status === 'pending' || alert.status === 'acknowledged') && (
                          <button
                            onClick={() => handleManageAlert(alert)}
                            className="btn btn-sm bg-[#18314F] hover:bg-[#18314F]/90 text-white gap-1"
                            title="Gestionar alerta"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Gestionar
                          </button>
                        )}
                        <button
                          onClick={() => handleViewDetails(alert)}
                          className="btn btn-ghost btn-sm"
                          title="Ver detalles"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Alert Workflow Modal */}
      <AlertWorkflowModal
        isOpen={isWorkflowModalOpen}
        onClose={() => {
          setIsWorkflowModalOpen(false);
          setWorkflowAlert(null);
        }}
        alert={workflowAlert}
        onUpdate={loadAlerts}
      />

      {/* Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAlert(null);
        }}
        title={selectedAlert ? `Alerta #${selectedAlert.id}` : 'Alerta'}
        size="lg"
      >
        {selectedAlert && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Empleado</span>
                </label>
                <p>{selectedAlert.employee_name}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Fecha</span>
                </label>
                <p>{new Date(selectedAlert.created_at).toLocaleString()}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Tipo de Alerta</span>
                </label>
                <p>{selectedAlert.alert_type}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Severidad</span>
                </label>
                <span className={`badge ${getSeverityColor(selectedAlert.severity)}`}>
                  {getSeverityLabel(selectedAlert.severity)}
                </span>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Estado</span>
                </label>
                <span className={`badge ${getStatusColor(selectedAlert.status)}`}>
                  {getStatusLabel(selectedAlert.status)}
                </span>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Score de Fatiga</span>
                </label>
                <div className="flex items-center gap-2">
                  <progress
                    className={`progress ${
                      selectedAlert.fatigue_score >= 80
                        ? 'progress-error'
                        : selectedAlert.fatigue_score >= 60
                        ? 'progress-warning'
                        : 'progress-success'
                    } w-32`}
                    value={selectedAlert.fatigue_score}
                    max="100"
                  ></progress>
                  <span className="font-mono">{selectedAlert.fatigue_score}</span>
                </div>
              </div>
              {selectedAlert.heart_rate && (
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Frecuencia Cardíaca</span>
                  </label>
                  <p>{selectedAlert.heart_rate} bpm</p>
                </div>
              )}
              {selectedAlert.spo2 && (
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">SpO2</span>
                  </label>
                  <p>{selectedAlert.spo2}%</p>
                </div>
              )}
              {selectedAlert.acknowledged_at && (
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Reconocida el</span>
                  </label>
                  <p>{new Date(selectedAlert.acknowledged_at).toLocaleString()}</p>
                </div>
              )}
              {selectedAlert.resolved_at && (
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Resuelta el</span>
                  </label>
                  <p>{new Date(selectedAlert.resolved_at).toLocaleString()}</p>
                </div>
              )}
            </div>
            {selectedAlert.message && (
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Mensaje</span>
                </label>
                <div className="alert alert-warning">
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
                  <span>{selectedAlert.message}</span>
                </div>
              </div>
            )}
            {selectedAlert.recommendations && (
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Recomendaciones</span>
                </label>
                <p className="text-sm text-base-content/70">{selectedAlert.recommendations}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

