/**
 * Alerts List Page
 * Página de listado y gestión de alertas
 */

import { useState, useEffect } from 'react';
import { alertService } from '../../services';
import { Table, Modal, SearchBar } from '../../components/common';
import type { Column, TableAction } from '../../components/common';
import type { FatigueAlert } from '../../types';

export function AlertsListPage() {
  const [alerts, setAlerts] = useState<FatigueAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<FatigueAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<FatigueAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAlerts(alerts);
    } else {
      const filtered = alerts.filter(
        (alert) =>
          (alert.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
          (alert.alert_type?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
      setFilteredAlerts(filtered);
    }
  }, [searchTerm, alerts]);

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

  const handleAcknowledge = async (alert: FatigueAlert) => {
    try {
      await alertService.acknowledgeAlert(alert.id);
      loadAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const handleResolve = async (alert: FatigueAlert) => {
    try {
      await alertService.resolveAlert(alert.id);
      loadAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const handleViewDetails = (alert: FatigueAlert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
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

  const actions: TableAction<FatigueAlert>[] = [
    {
      label: 'Ver',
      onClick: handleViewDetails,
      className: 'btn btn-ghost btn-sm',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
    },
    {
      label: 'Reconocer',
      onClick: handleAcknowledge,
      className: 'btn btn-ghost btn-sm',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    {
      label: 'Resolver',
      onClick: handleResolve,
      className: 'btn btn-ghost btn-sm text-success',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Alertas de Fatiga</h1>
          <p className="text-base-content/60">Gestión y monitoreo de alertas del sistema</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Total Alertas</div>
          <div className="stat-value text-primary">{alerts.length}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Pendientes</div>
          <div className="stat-value text-warning">
            {alerts.filter((a) => a.status === 'pending').length}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Críticas</div>
          <div className="stat-value text-error">
            {alerts.filter((a) => a.severity === 'critical').length}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Reconocidas</div>
          <div className="stat-value text-info">
            {alerts.filter((a) => a.status === 'acknowledged').length}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Resueltas</div>
          <div className="stat-value text-success">
            {alerts.filter((a) => a.status === 'resolved').length}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por empleado o tipo..."
              className="flex-1"
            />
            <select className="select select-bordered">
              <option value="">Todas las severidades</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
            <select className="select select-bordered">
              <option value="">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="acknowledged">Reconocidas</option>
              <option value="resolved">Resueltas</option>
            </select>
            <select className="select select-bordered">
              <option value="">Últimas 24 horas</option>
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <Table
            data={filteredAlerts}
            columns={columns}
            actions={actions}
            keyExtractor={(alert) => alert.id}
            isLoading={isLoading}
            emptyMessage="No se encontraron alertas"
          />
        </div>
      </div>

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
