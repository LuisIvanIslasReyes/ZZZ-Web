/**
 * Supervisor Team Reports Page
 * Reportes y análisis del equipo con datos reales
 * Diseño ZZZ Admin Style
 */

import { useState, useEffect } from 'react';
import { reportsService } from '../../services';
import { TeamFatigueTrendChart, ProductivityFatigueChart, WorkHoursChart } from '../../components/charts';
import type { ReportSummary, EmployeeProductivityData } from '../../services/reports.service';

export function SupervisorTeamReportsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [selectedReport, setSelectedReport] = useState<'overview' | 'fatigue' | 'productivity' | 'alerts'>('productivity');
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeProductivityData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;

  useEffect(() => {
    loadReportData();
  }, [timeRange, selectedReport]);

  const loadReportData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Cargar resumen
      const summaryData = await reportsService.getReportSummary(days);
      setSummary(summaryData);

      // Cargar datos específicos según el reporte seleccionado
      if (selectedReport === 'productivity') {
        const empData = await reportsService.getEmployeeProductivity(days);
        setEmployeeData(empData);
      }
    } catch (err) {
      console.error('Error loading report data:', err);
      setError('Error al cargar los datos del reporte. Verifica que haya métricas procesadas.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      setIsExporting(true);
      
      // Por ahora solo CSV funciona
      if (format !== 'csv') {
        alert('La exportación a PDF y Excel estará disponible próximamente. Usa CSV por ahora.');
        return;
      }
      
      const blob = await reportsService.exportReport(selectedReport, format, days);
      const filename = `reporte_${selectedReport}_${timeRange}_${new Date().toISOString().split('T')[0]}.${format}`;
      reportsService.downloadReport(blob, filename);
    } catch (err) {
      console.error('Error exporting report:', err);
      alert('Error al exportar el reporte. Por favor intenta de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#18314F] mb-1">Team Reports</h1>
        <p className="text-lg text-[#18314F]/70">Análisis y reportes detallados del equipo</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="font-semibold text-[#18314F] mb-2">Período de Tiempo</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  timeRange === 'week' ? 'bg-[#18314F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Última Semana
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  timeRange === 'month' ? 'bg-[#18314F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Último Mes
              </button>
              <button
                onClick={() => setTimeRange('quarter')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  timeRange === 'quarter' ? 'bg-[#18314F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Último Trimestre
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#18314F] mb-2">Exportar Reporte</h3>
            <div className="flex gap-2">
              <button
                onClick={() => exportReport('pdf')}
                disabled={isExporting}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-xl transition-colors"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </button>
              <button
                onClick={() => exportReport('excel')}
                disabled={isExporting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-xl transition-colors"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                Excel
              </button>
              <button
                onClick={() => exportReport('csv')}
                disabled={isExporting}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-xl transition-colors"
              >
                {isExporting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="bg-white rounded-2xl shadow-md p-2 flex gap-2">
        <button
          onClick={() => setSelectedReport('overview')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
            selectedReport === 'overview' ? 'bg-[#18314F] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Vista General
        </button>
        <button
          onClick={() => setSelectedReport('fatigue')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
            selectedReport === 'fatigue' ? 'bg-[#18314F] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Análisis de Fatiga
        </button>
        <button
          onClick={() => setSelectedReport('productivity')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
            selectedReport === 'productivity' ? 'bg-[#18314F] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Productividad
        </button>
        <button
          onClick={() => setSelectedReport('alerts')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
            selectedReport === 'alerts' ? 'bg-[#18314F] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Historial de Alertas
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Empleados Activos</p>
              <p className="text-2xl font-bold text-[#18314F]">
                {isLoading ? '...' : summary?.total_employees || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#22C55E">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Productividad Promedio</p>
              <p className="text-2xl font-bold text-[#18314F]">
                {isLoading ? '...' : `${summary?.avg_productivity?.toFixed(1) || 0}%`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#F59E0B">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Horas Trabajadas</p>
              <p className="text-2xl font-bold text-[#18314F]">
                {isLoading ? '...' : `${summary?.total_work_hours?.toFixed(0) || 0}h`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#EF4444">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Alertas Críticas</p>
              <p className="text-2xl font-bold text-[#18314F]">
                {isLoading ? '...' : summary?.critical_alerts || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts - Overview Report */}
      {selectedReport === 'overview' && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#18314F] mb-4">Vista General del Equipo</h2>
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>Los datos de vista general estarán disponibles próximamente</p>
          </div>
        </div>
      )}

      {/* Fatigue Analysis Report */}
      {selectedReport === 'fatigue' && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#18314F] mb-6">Análisis Detallado de Fatiga</h2>
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>Los datos de análisis de fatiga estarán disponibles próximamente</p>
          </div>
        </div>
      )}

      {/* Productivity Report */}
      {selectedReport === 'productivity' && (
        <div className="space-y-6">
          {/* Gráficas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-[#18314F] mb-4">Actividad vs Fatiga</h3>
              <ProductivityFatigueChart days={days} height={280} title="" />
            </div>
            
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-[#18314F] mb-4">Horas de Trabajo</h3>
              <WorkHoursChart days={days} height={280} title="" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#18314F] mb-4">Tendencia de Fatiga</h3>
            <TeamFatigueTrendChart days={days} interval="day" height={300} title="" />
          </div>

          {/* Tabla de Empleados */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold text-[#18314F] mb-6">Análisis por Empleado</h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18314F]"></div>
              </div>
            ) : employeeData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-[#18314F]">Empleado</th>
                      <th className="text-center py-4 px-4 font-semibold text-[#18314F]">Días Activos</th>
                      <th className="text-center py-4 px-4 font-semibold text-[#18314F]">Horas Trabajadas</th>
                      <th className="text-center py-4 px-4 font-semibold text-[#18314F]">Productividad</th>
                      <th className="text-center py-4 px-4 font-semibold text-[#18314F]">Fatiga Promedio</th>
                      <th className="text-center py-4 px-4 font-semibold text-[#18314F]">Alertas</th>
                      <th className="text-center py-4 px-4 font-semibold text-[#18314F]">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeData.map((emp) => (
                      <tr key={emp.employee_id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-[#18314F]">{emp.employee_name}</p>
                            <p className="text-sm text-gray-500">{emp.employee_email}</p>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4 text-gray-700">
                          {emp.attendance_days}
                        </td>
                        <td className="text-center py-4 px-4 text-gray-700">
                          {emp.total_hours.toFixed(1)}h
                        </td>
                        <td className="text-center py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            emp.productivity_score >= 80 ? 'bg-green-100 text-green-800' :
                            emp.productivity_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {emp.productivity_score.toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-center py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            emp.avg_fatigue < 40 ? 'bg-green-100 text-green-800' :
                            emp.avg_fatigue < 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {emp.avg_fatigue.toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-center py-4 px-4">
                          <span className={`font-medium ${emp.alerts_count > 5 ? 'text-red-600' : 'text-gray-600'}`}>
                            {emp.alerts_count}
                          </span>
                        </td>
                        <td className="text-center py-4 px-4">
                          {emp.avg_fatigue < 40 ? (
                            <span className="text-green-600 font-medium">Óptimo</span>
                          ) : emp.avg_fatigue < 70 ? (
                            <span className="text-yellow-600 font-medium">Atención</span>
                          ) : (
                            <span className="text-red-600 font-medium">Crítico</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No hay datos de productividad disponibles para el período seleccionado</p>
                <p className="text-sm mt-2">Asegúrate de que los empleados tengan métricas procesadas</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alerts History Report */}
      {selectedReport === 'alerts' && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#18314F] mb-6">Historial de Alertas</h2>
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>Los datos de alertas estarán disponibles próximamente</p>
          </div>
        </div>
      )}
    </div>
  );
}
