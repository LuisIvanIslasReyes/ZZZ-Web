/**
 * Breaks Management Page (Supervisor)
 * Página para supervisores: ver y aprobar/rechazar descansos
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { breakService } from '../../services/break.service';
import { LoadingSpinner } from '../../components/common';
import type { ScheduledBreak } from '../../types/break.types';

type TabType = 'pending' | 'today' | 'upcoming' | 'history';

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
        case 'history': {
          // Cargar todos los descansos y filtrar aprobados/rechazados/completados
          const allBreaks = await breakService.getMyBreaks();
          data = allBreaks.filter(b => 
            b.status === 'approved' || 
            b.status === 'rejected' || 
            b.status === 'completed' ||
            b.status === 'cancelled'
          );
          break;
        }
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
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#18314F] mb-2">Gestión de Descansos</h1>
        <p className="text-lg text-[#18314F]/70">Revisa y aprueba las solicitudes de descanso de tu equipo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pendientes de Aprobación</p>
              <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-gray-500 mt-1">Requieren tu atención</p>
            </div>
            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Aprobados</p>
              <p className="text-4xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-xs text-gray-500 mt-1">En periodo actual</p>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
              <p className="text-4xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">Descansos en vista</p>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-md p-2 inline-flex gap-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-[#18314F] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pendientes ({stats.pending})
        </button>
        <button
          onClick={() => setActiveTab('today')}
          className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
            activeTab === 'today'
              ? 'bg-[#18314F] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Hoy
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'bg-[#18314F] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Próximos (7 días)
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-[#18314F] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Historial
        </button>
      </div>

      {/* Breaks Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6">
          {breaks.length === 0 ? (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-semibold text-[#18314F] mb-2">No hay descansos</h3>
              <p className="text-gray-600">
                {activeTab === 'pending' && 'No hay solicitudes pendientes de aprobación'}
                {activeTab === 'today' && 'No hay descansos programados para hoy'}
                {activeTab === 'upcoming' && 'No hay descansos programados en los próximos 7 días'}
                {activeTab === 'history' && 'No hay descansos en el historial'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Empleado</th>
                    <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Tipo</th>
                    <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Fecha y Hora</th>
                    <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Duración</th>
                    <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Motivo</th>
                    {activeTab === 'pending' && <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Acciones</th>}
                    {activeTab !== 'pending' && <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Estado</th>}
                  </tr>
                </thead>
                <tbody>
                  {breaks.map((breakItem) => (
                    <>
                      <tr key={breakItem.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-[#18314F]">{breakItem.employee_name}</div>
                            <div className="text-sm text-gray-500">ID: {breakItem.employee}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
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
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-600">{breakItem.reason || '—'}</p>
                          </div>
                        </td>
                        {activeTab === 'pending' && (
                          <td className="py-4 px-4">
                            <button
                              onClick={() => setReviewingBreakId(breakItem.id)}
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Revisar
                            </button>
                          </td>
                        )}
                        {activeTab !== 'pending' && (
                          <td className="py-4 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              breakItem.status === 'approved' ? 'bg-green-100 text-green-700' :
                              breakItem.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              breakItem.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {breakItem.status_display}
                            </span>
                          </td>
                        )}
                      </tr>
                      {/* Review Form */}
                      {reviewingBreakId === breakItem.id && (
                        <tr>
                          <td colSpan={6} className="py-0">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 mx-4 my-3 rounded-xl border border-blue-100">
                              <h4 className="font-bold text-[#18314F] mb-4 text-lg">Revisar Solicitud</h4>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Notas de revisión (opcional)
                                </label>
                                <textarea
                                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                  placeholder="Agrega comentarios sobre tu decisión..."
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleReview(breakItem.id, 'approved')}
                                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-md"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Aprobar
                                </button>
                                <button
                                  onClick={() => handleReview(breakItem.id, 'rejected')}
                                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-md"
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
                                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
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
