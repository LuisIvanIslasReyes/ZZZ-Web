/**
 * My Breaks Page (Employee)
 * Página para que los empleados vean y gestionen sus descansos programados
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { breakService } from '../../services/break.service';
import { LoadingSpinner, ScheduleBreakModal } from '../../components/common';
import type { ScheduledBreak, BreakStatus } from '../../types/break.types';

export function MyBreaksPage() {
  const [breaks, setBreaks] = useState<ScheduledBreak[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<BreakStatus | 'all'>('all');

  useEffect(() => {
    loadBreaks();
  }, []);

  const loadBreaks = async () => {
    try {
      setIsLoading(true);
      const data = await breakService.getMyBreaks();
      setBreaks(data);
    } catch (error: any) {
      console.error('Error loading breaks:', error);
      toast.error('Error al cargar descansos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBreak = async (breakId: number) => {
    if (!confirm('¿Estás seguro de cancelar este descanso?')) return;

    try {
      await breakService.cancelBreak(breakId);
      toast.success('Descanso cancelado');
      loadBreaks();
    } catch (error: any) {
      console.error('Error canceling break:', error);
      toast.error(error.response?.data?.error || 'Error al cancelar descanso');
    }
  };

  const handleBreakScheduled = () => {
    setIsScheduleModalOpen(false);
    loadBreaks();
  };

  const getStatusBadge = (status: BreakStatus) => {
    const badges = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-error',
      completed: 'badge-info',
      cancelled: 'badge-ghost',
    };
    return badges[status] || 'badge-ghost';
  };

  const getStatusIcon = (status: BreakStatus) => {
    switch (status) {
      case 'approved':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rejected':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'completed':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'cancelled':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getBreakTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactElement> = {
      coffee: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      lunch: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      rest: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      medical: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      personal: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      stretch: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    };
    return icons[type] || icons.rest;
  };

  const filteredBreaks = filterStatus === 'all' 
    ? breaks 
    : breaks.filter(b => b.status === filterStatus);

  const stats = {
    total: breaks.length,
    pending: breaks.filter(b => b.status === 'pending').length,
    approved: breaks.filter(b => b.status === 'approved').length,
    rejected: breaks.filter(b => b.status === 'rejected').length,
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Descansos Programados</h1>
          <p className="text-gray-600 mt-1">Gestiona tus descansos y solicitudes</p>
        </div>
        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="btn btn-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Programar Descanso
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-title">Total</div>
          <div className="stat-value text-primary">{stats.total}</div>
          <div className="stat-desc">Descansos totales</div>
        </div>
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-title">Pendientes</div>
          <div className="stat-value text-warning">{stats.pending}</div>
          <div className="stat-desc">Esperando aprobación</div>
        </div>
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-title">Aprobados</div>
          <div className="stat-value text-success">{stats.approved}</div>
          <div className="stat-desc">Listos para usar</div>
        </div>
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-title">Rechazados</div>
          <div className="stat-value text-error">{stats.rejected}</div>
          <div className="stat-desc">No autorizados</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Todos ({breaks.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`btn btn-sm ${filterStatus === 'pending' ? 'btn-warning' : 'btn-ghost'}`}
            >
              Pendientes ({stats.pending})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`btn btn-sm ${filterStatus === 'approved' ? 'btn-success' : 'btn-ghost'}`}
            >
              Aprobados ({stats.approved})
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`btn btn-sm ${filterStatus === 'rejected' ? 'btn-error' : 'btn-ghost'}`}
            >
              Rechazados ({stats.rejected})
            </button>
          </div>
        </div>
      </div>

      {/* Breaks List */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          {filteredBreaks.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay descansos</h3>
              <p className="text-gray-600 mb-4">
                {filterStatus === 'all' 
                  ? 'Aún no has programado ningún descanso'
                  : `No tienes descansos con estado: ${filterStatus}`}
              </p>
              {filterStatus === 'all' && (
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="btn btn-primary"
                >
                  Programar mi primer descanso
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Fecha y Hora</th>
                    <th>Duración</th>
                    <th>Estado</th>
                    <th>Motivo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBreaks.map((breakItem) => (
                    <tr key={breakItem.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          {getBreakTypeIcon(breakItem.break_type)}
                          <span className="font-medium">{breakItem.break_type_display}</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">{breakItem.scheduled_date}</div>
                          <div className="text-sm text-gray-600">{breakItem.scheduled_time}</div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-outline">{breakItem.duration_display}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(breakItem.status)}
                          <span className={`badge ${getStatusBadge(breakItem.status)}`}>
                            {breakItem.status_display}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="max-w-xs">
                          <p className="text-sm truncate">{breakItem.reason || '—'}</p>
                          {breakItem.reviewer_notes && (
                            <p className="text-xs text-gray-500 italic mt-1">
                              Nota: {breakItem.reviewer_notes}
                            </p>
                          )}
                        </div>
                      </td>
                      <td>
                        {breakItem.status === 'pending' && (
                          <button
                            onClick={() => handleCancelBreak(breakItem.id)}
                            className="btn btn-sm btn-error btn-outline"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancelar
                          </button>
                        )}
                        {breakItem.status === 'approved' && (
                          <span className="text-sm text-gray-500">
                            Aprobado por {breakItem.reviewed_by_name}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Break Modal */}
      <ScheduleBreakModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSuccess={handleBreakScheduled}
      />
    </div>
  );
}
