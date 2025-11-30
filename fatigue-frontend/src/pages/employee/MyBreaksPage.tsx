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
    } catch (error) {
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
    } catch (error) {
      console.error('Error canceling break:', error);
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Error al cancelar descanso');
    }
  };

  const handleBreakScheduled = () => {
    setIsScheduleModalOpen(false);
    loadBreaks();
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
          <h1 className="text-4xl font-bold text-[#18314F] mb-2">Mis Descansos</h1>
          <p className="text-lg text-[#18314F]/70">Gestiona tus descansos y consulta tu historial</p>
        </div>
        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="px-6 py-3 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Programar Descanso
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Total</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">Descansos registrados</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-gray-500 mt-1">Esperando aprobación</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Aprobados</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-xs text-gray-500 mt-1">Listos para usar</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Rechazados</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-xs text-gray-500 mt-1">No autorizados</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              filterStatus === 'all'
                ? 'bg-[#18314F] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos ({breaks.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              filterStatus === 'pending'
                ? 'bg-[#18314F] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pendientes ({stats.pending})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              filterStatus === 'approved'
                ? 'bg-[#18314F] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Aprobados ({stats.approved})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              filterStatus === 'rejected'
                ? 'bg-[#18314F] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Rechazados ({stats.rejected})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              filterStatus === 'completed'
                ? 'bg-[#18314F] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Historial
          </button>
        </div>
      </div>

      {/* Breaks List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          {filteredBreaks.length === 0 ? (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-semibold text-[#18314F] mb-2">No hay descansos</h3>
              <p className="text-gray-600 mb-4">
                {filterStatus === 'all' 
                  ? 'Aún no has programado ningún descanso'
                  : `No tienes descansos con estado: ${filterStatus}`}
              </p>
              {filterStatus === 'all' && (
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="px-6 py-3 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-lg font-semibold transition-colors"
                >
                  Programar mi primer descanso
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Tipo</th>
                    <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Fecha y Hora</th>
                    <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Duración</th>
                    <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Estado</th>
                    <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Motivo</th>
                    <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBreaks.map((breakItem) => (
                    <tr key={breakItem.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600">{getBreakTypeIcon(breakItem.break_type)}</span>
                          <span className="font-medium text-gray-700">{breakItem.break_type_display}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-[#18314F]">{breakItem.scheduled_date}</div>
                          <div className="text-sm text-gray-500">{breakItem.scheduled_time}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {breakItem.duration_display}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-sm font-semibold ${
                            breakItem.status === 'approved' ? 'text-green-600' :
                            breakItem.status === 'rejected' ? 'text-red-600' :
                            breakItem.status === 'completed' ? 'text-blue-600' :
                            breakItem.status === 'cancelled' ? 'text-gray-500' :
                            'text-yellow-600'
                          }`}>
                            {breakItem.status_display}
                          </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-600">{breakItem.reason || '—'}</p>
                          {breakItem.reviewer_notes && (
                            <p className="text-xs text-gray-500 italic mt-1 bg-gray-50 p-2 rounded">
                              <strong>Nota del supervisor:</strong> {breakItem.reviewer_notes}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {breakItem.status === 'pending' && (
                          <button
                            onClick={() => handleCancelBreak(breakItem.id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancelar
                          </button>
                        )}
                        {breakItem.status === 'approved' && breakItem.reviewed_by_name && (
                          <div className="text-sm">
                            <p className="text-gray-500">Aprobado por</p>
                            <p className="font-medium text-[#18314F]">{breakItem.reviewed_by_name}</p>
                          </div>
                        )}
                        {breakItem.status === 'rejected' && breakItem.reviewed_by_name && (
                          <div className="text-sm">
                            <p className="text-gray-500">Rechazado por</p>
                            <p className="font-medium text-[#18314F]">{breakItem.reviewed_by_name}</p>
                          </div>
                        )}
                        {(breakItem.status === 'completed' || breakItem.status === 'cancelled') && (
                          <span className="text-sm text-gray-400">—</span>
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
