/**
 * Breaks Management Page (Supervisor)
 * Página para supervisores: ver y aprobar/rechazar descansos
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { breakService } from '../../services/break.service';
import { LoadingSpinner } from '../../components/common';
import type { ScheduledBreak } from '../../types/break.types';

type TabType = 'pending' | 'today' | 'upcoming';

export function BreaksManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [breaks, setBreaks] = useState<ScheduledBreak[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingBreakId, setReviewingBreakId] = useState<number | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    loadBreaks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadBreaks = async () => {
    try {
      setIsLoading(true);
      let data: ScheduledBreak[] = [];
      
      switch (activeTab) {
        case 'pending':
          data = await breakService.getPendingBreaks();
          break;
        case 'today':
          data = await breakService.getTodayBreaks();
          break;
        case 'upcoming':
          data = await breakService.getUpcomingBreaks();
          break;
      }
      
      setBreaks(data);
    } catch (error) {
      console.error('Error loading breaks:', error);
      toast.error('Error al cargar descansos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (breakId: number, status: 'approved' | 'rejected') => {
    try {
      const confirmMsg = status === 'approved' 
        ? '¿Aprobar este descanso?' 
        : '¿Rechazar este descanso?';
      
      if (!confirm(confirmMsg)) return;

      await breakService.reviewBreak(breakId, {
        status,
        reviewer_notes: reviewNotes || undefined,
      });

      toast.success(
        status === 'approved' 
          ? 'Descanso aprobado' 
          : 'Descanso rechazado'
      );
      
      setReviewingBreakId(null);
      setReviewNotes('');
      loadBreaks();
    } catch (error) {
      console.error('Error reviewing break:', error);
      toast.error('Error al revisar descanso');
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

  const stats = {
    pending: breaks.filter(b => b.status === 'pending').length,
    approved: breaks.filter(b => b.status === 'approved').length,
    total: breaks.length,
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Descansos</h1>
        <p className="text-gray-600 mt-1">Revisa y aprueba las solicitudes de descanso de tu equipo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-title">Pendientes de Aprobación</div>
          <div className="stat-value text-warning">{stats.pending}</div>
          <div className="stat-desc">Requieren tu atención</div>
        </div>
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-title">Aprobados</div>
          <div className="stat-value text-success">{stats.approved}</div>
          <div className="stat-desc">En periodo actual</div>
        </div>
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-title">Total</div>
          <div className="stat-value text-primary">{stats.total}</div>
          <div className="stat-desc">Descansos en vista</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-100 shadow-lg p-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`tab ${activeTab === 'pending' ? 'tab-active' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pendientes ({stats.pending})
        </button>
        <button
          onClick={() => setActiveTab('today')}
          className={`tab ${activeTab === 'today' ? 'tab-active' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Hoy
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`tab ${activeTab === 'upcoming' ? 'tab-active' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Próximos (7 días)
        </button>
      </div>

      {/* Breaks Table */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          {breaks.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay descansos</h3>
              <p className="text-gray-600">
                {activeTab === 'pending' && 'No hay solicitudes pendientes de aprobación'}
                {activeTab === 'today' && 'No hay descansos programados para hoy'}
                {activeTab === 'upcoming' && 'No hay descansos programados en los próximos 7 días'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Tipo</th>
                    <th>Fecha y Hora</th>
                    <th>Duración</th>
                    <th>Motivo</th>
                    {activeTab === 'pending' && <th>Acciones</th>}
                    {activeTab !== 'pending' && <th>Estado</th>}
                  </tr>
                </thead>
                <tbody>
                  {breaks.map((breakItem) => (
                    <>
                      <tr key={breakItem.id}>
                        <td>
                          <div>
                            <div className="font-medium">{breakItem.employee_name}</div>
                            <div className="text-sm text-gray-600">ID: {breakItem.employee}</div>
                          </div>
                        </td>
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
                          <div className="max-w-xs">
                            <p className="text-sm">{breakItem.reason || '—'}</p>
                          </div>
                        </td>
                        {activeTab === 'pending' && (
                          <td>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setReviewingBreakId(breakItem.id)}
                                className="btn btn-sm btn-info btn-outline"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Revisar
                              </button>
                            </div>
                          </td>
                        )}
                        {activeTab !== 'pending' && (
                          <td>
                            <span className={`badge ${
                              breakItem.status === 'approved' ? 'badge-success' :
                              breakItem.status === 'rejected' ? 'badge-error' :
                              breakItem.status === 'completed' ? 'badge-info' :
                              'badge-ghost'
                            }`}>
                              {breakItem.status_display}
                            </span>
                          </td>
                        )}
                      </tr>
                      {/* Review Form */}
                      {reviewingBreakId === breakItem.id && (
                        <tr>
                          <td colSpan={6}>
                            <div className="bg-base-200 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Revisar Solicitud</h4>
                              <div className="form-control mb-4">
                                <label className="label">
                                  <span className="label-text">Notas de revisión (opcional)</span>
                                </label>
                                <textarea
                                  className="textarea textarea-bordered"
                                  placeholder="Agrega comentarios sobre tu decisión..."
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleReview(breakItem.id, 'approved')}
                                  className="btn btn-success"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Aprobar
                                </button>
                                <button
                                  onClick={() => handleReview(breakItem.id, 'rejected')}
                                  className="btn btn-error"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Rechazar
                                </button>
                                <button
                                  onClick={() => {
                                    setReviewingBreakId(null);
                                    setReviewNotes('');
                                  }}
                                  className="btn btn-ghost"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
