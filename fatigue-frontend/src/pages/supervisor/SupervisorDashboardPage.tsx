/**
 * Supervisor Dashboard Page
 * Dashboard específico para supervisores - Vista de su equipo
 * Diseño actualizado ZZZ Admin Style
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { dashboardService, reportService, notificationService } from '../../services';
import { LoadingSpinner, SendNotificationModal } from '../../components/common';
import { DoughnutChart, TeamFatigueTrendChart, ProductivityFatigueChart, WorkHoursChart } from '../../components/charts';
import { useAuth } from '../../contexts';
import type { DashboardStats } from '../../types';

export function SupervisorDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

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

  const handleGenerateReport = async (format: 'csv' | 'excel' | 'pdf' = 'csv') => {
    try {
      setIsGeneratingReport(true);
      const formatLabel = format === 'csv' ? 'CSV' : format === 'excel' ? 'Excel' : 'PDF';
      toast.loading(`Generando reporte en ${formatLabel}...`);
      
      // Generar reporte de los últimos 7 días
      const blob = await reportService.exportTeamReport({ days: 7, format });
      
      // Extensión del archivo
      const extension = format === 'csv' ? 'csv' : format === 'excel' ? 'xlsx' : 'pdf';
      
      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-equipo-${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success(`Reporte ${formatLabel} descargado exitosamente`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.dismiss();
      toast.error('Error al generar el reporte');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleSendNotification = async (data: {
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
  }) => {
    try {
      setIsSendingNotification(true);
      console.log('📤 Enviando notificación:', data);
      
      const response = await notificationService.sendTeamNotification(data);
      
      console.log('✅ Respuesta exitosa:', response);
      
      const successMessage = response.employees_notified === 1 
        ? 'Notificación enviada a 1 empleado' 
        : `Notificación enviada a ${response.employees_notified} empleados`;
      
      toast.success(successMessage);
      setIsNotificationModalOpen(false);
    } catch (error: unknown) {
      console.error('❌ Error completo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar la notificación';
      toast.error(errorMessage);
    } finally {
      setIsSendingNotification(false);
    }
  };

  const handleViewTeamDetails = () => {
    navigate('/supervisor/team');
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

  return (
    <div className="space-y-8">
      {/* Header con Empresa */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard del Supervisor</h1>
            <p className="text-gray-600">Monitoreo de tu equipo de trabajo</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Botón Enviar Notificación */}
            <button
              onClick={() => setIsNotificationModalOpen(true)}
              className="bg-[#18314F] hover:bg-[#18314F]/90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Notificar Equipo
            </button>
            {/* Badge Empresa */}
            {user?.company_name && (
              <div className="bg-[#18314F] text-white rounded-xl px-5 py-2.5 shadow-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div>
                    <p className="text-xs text-white/70">Mi Empresa</p>
                    <p className="text-sm font-bold">{user.company_name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cards superiores - Métricas */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Empleados en mi Equipo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-base font-medium">Empleados en mi Equipo</span>
              <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">{stats.total_employees}</span>
              <span className="text-sm text-green-600 font-medium">
                ↑ {stats.active_devices} con dispositivos
              </span>
            </div>
          </div>

          {/* Alertas Activas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-base font-medium">Alertas Activas</span>
              <svg className={`w-8 h-8 ${stats.pending_alerts > 0 ? 'text-red-500' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${stats.pending_alerts > 0 ? 'text-red-500' : 'text-gray-900'}`}>{stats.pending_alerts}</span>
              <span className={`text-sm font-medium ${stats.pending_alerts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {stats.pending_alerts > 0 ? 'Requieren atención' : 'Todo normal'}
              </span>
            </div>
          </div>

          {/* Nivel Promedio de Fatiga */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-base font-medium">Nivel Promedio de Fatiga</span>
              <svg className={`w-8 h-8 ${stats.avg_fatigue_score > 70 ? 'text-red-500' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">{stats.avg_fatigue_score}%</span>
              <span className={`text-sm font-medium ${stats.avg_fatigue_score > 70 ? 'text-red-600' : 'text-green-600'}`}>
                {stats.avg_fatigue_score > 70 ? 'Alto nivel' : 'Nivel controlado'}
              </span>
            </div>
          </div>

          {/* Empleados en Riesgo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-base font-medium">Empleados en Riesgo</span>
              <svg className={`w-8 h-8 ${(stats.high_risk_employees || 0) > 0 ? 'text-red-500' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${(stats.high_risk_employees || 0) > 0 ? 'text-red-500' : 'text-gray-900'}`}>{stats.high_risk_employees || 0}</span>
              <span className={`text-sm font-medium ${(stats.high_risk_employees || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {(stats.high_risk_employees || 0) > 0 ? 'Acción requerida' : 'Equipo estable'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid - Fila 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fatiga del Equipo - Últimos 7 días */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-[#18314F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <span className="text-lg font-bold text-gray-900">Tendencia de Fatiga del Equipo</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">Últimos 7 días</p>
          <TeamFatigueTrendChart days={7} interval="day" height={220} title="" />
        </div>

        {/* Estado del Equipo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-[#18314F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16M12 4v16" />
            </svg>
            <span className="text-lg font-bold text-gray-900">Estado del Equipo</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">Distribución por nivel de riesgo</p>
          {stats.high_risk_employees !== undefined && stats.high_risk_employees > 0 ? (
            <DoughnutChart
              labels={['Normal', 'Alto Riesgo']}
              data={[
                stats.total_employees - (stats.high_risk_employees || 0),
                stats.high_risk_employees || 0
              ]}
              colors={['#22C55E', '#EF4444']}
              height={220}
            />
          ) : (
            <div className="flex items-center justify-center h-[220px] text-gray-400">
              <p>No hay datos de riesgo disponibles</p>
            </div>
          )}
          <div className="flex flex-col gap-1 mt-4 text-sm">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#22C55E]"></span>Normal <span className="ml-auto font-semibold">{stats.total_employees - (stats.high_risk_employees || 0)} empleados</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>Alto Riesgo <span className="ml-auto font-semibold">{stats.high_risk_employees || 0} empleados</span></div>
          </div>
        </div>
      </div>

      {/* Charts Grid - Fila 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productividad vs Fatiga */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-[#18314F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
            </svg>
            <span className="text-lg font-bold text-gray-900">Actividad vs Fatiga</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">Correlación semanal</p>
          <ProductivityFatigueChart days={7} height={220} title="" />
        </div>

        {/* Horas de Trabajo del Equipo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-[#18314F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg font-bold text-gray-900">Horas de Actividad del Equipo</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">Comparación con recomendaciones</p>
          <WorkHoursChart days={7} height={220} title="" />
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Exportar Reportes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button 
            onClick={() => handleGenerateReport('csv')}
            disabled={isGeneratingReport}
            className="flex items-center justify-center gap-2 bg-[#18314F] hover:bg-[#18314F]/90 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingReport ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar CSV
              </>
            )}
          </button>
          <button 
            onClick={() => handleGenerateReport('excel')}
            disabled={isGeneratingReport}
            className="flex items-center justify-center gap-2 bg-[#18314F] hover:bg-[#18314F]/90 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingReport ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Exportar Excel
              </>
            )}
          </button>
          <button 
            onClick={() => handleGenerateReport('pdf')}
            disabled={isGeneratingReport}
            className="flex items-center justify-center gap-2 bg-[#18314F] hover:bg-[#18314F]/90 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingReport ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Exportar PDF
              </>
            )}
          </button>
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-3 pt-4 border-t border-gray-200">Otras Acciones</h3>
        <button 
          onClick={handleViewTeamDetails}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#18314F] font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 hover:border-[#18314F] transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Ver Detalles del Equipo
        </button>
      </div>

      {/* Send Notification Modal */}
      <SendNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onSend={handleSendNotification}
        isLoading={isSendingNotification}
      />
    </div>
  );
}
