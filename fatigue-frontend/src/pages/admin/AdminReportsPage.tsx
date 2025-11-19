/**
 * Admin Reports Page
 * Página de reportes y análisis para administradores
 */

import { useState, useEffect } from 'react';
import { reportService, employeeService } from '../../services';
import toast from 'react-hot-toast';
import type { EmployeeReport, ExecutiveSummary, Employee } from '../../types';

export function AdminReportsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummary | null>(null);
  const [selectedReport, setSelectedReport] = useState<'executive' | 'employee'>('executive');
  const [period, setPeriod] = useState<'7' | '30' | '90' | 'custom'>('30');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [employeeReport, setEmployeeReport] = useState<EmployeeReport | null>(null);

  useEffect(() => {
    loadEmployees();
    loadExecutiveSummary();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadExecutiveSummary = async () => {
    try {
      setIsLoading(true);
      const params = period === 'custom' && startDate && endDate
        ? { start_date: startDate, end_date: endDate }
        : { days: parseInt(period) };
      
      const data = await reportService.getExecutiveSummary(params);
      setExecutiveSummary(data);
    } catch (error) {
      console.error('Error loading executive summary:', error);
      toast.error('Error al cargar resumen ejecutivo');
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmployeeReport = async () => {
    if (!selectedEmployeeId) {
      toast.error('Selecciona un empleado');
      return;
    }

    try {
      setIsLoading(true);
      const params = period === 'custom' && startDate && endDate
        ? { start_date: startDate, end_date: endDate }
        : { days: parseInt(period) };
      
      const data = await reportService.getEmployeeReport(selectedEmployeeId, params);
      setEmployeeReport(data);
    } catch (error) {
      console.error('Error loading employee report:', error);
      toast.error('Error al cargar reporte de empleado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (selectedReport === 'executive') {
      loadExecutiveSummary();
    } else {
      loadEmployeeReport();
    }
  };

  const handleExportExecutive = async () => {
    try {
      const params = period === 'custom' && startDate && endDate
        ? { start_date: startDate, end_date: endDate }
        : { days: parseInt(period) };
      
      const blob = await reportService.exportExecutiveSummary(params);
      const filename = `resumen_ejecutivo_${new Date().toISOString().split('T')[0]}.csv`;
      reportService.downloadBlob(blob, filename);
      toast.success('Reporte exportado correctamente');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Error al exportar reporte');
    }
  };

  const handleExportEmployee = async () => {
    if (!selectedEmployeeId) {
      toast.error('Selecciona un empleado');
      return;
    }

    try {
      const params = period === 'custom' && startDate && endDate
        ? { start_date: startDate, end_date: endDate }
        : { days: parseInt(period) };
      
      const blob = await reportService.exportEmployeeReport(selectedEmployeeId, params);
      const employee = employees.find(e => e.id === selectedEmployeeId);
      const filename = `reporte_empleado_${employee?.first_name}_${employee?.last_name}_${new Date().toISOString().split('T')[0]}.csv`;
      reportService.downloadBlob(blob, filename);
      toast.success('Reporte exportado correctamente');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Error al exportar reporte');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#18314F]">Reportes</h1>
        <p className="text-gray-600 mt-1">Análisis y exportación de datos del sistema</p>
      </div>

      {/* Report Configuration */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold text-[#18314F] mb-6">Configuración del Reporte</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tipo de Reporte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Reporte
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value as 'executive' | 'employee')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
            >
              <option value="executive">Resumen Ejecutivo</option>
              <option value="employee">Reporte de Empleado</option>
            </select>
          </div>

          {/* Período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as '7' | '30' | '90' | 'custom')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
            >
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          {/* Fecha Inicio - Solo si es custom */}
          {period === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
              />
            </div>
          )}

          {/* Fecha Fin - Solo si es custom */}
          {period === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
              />
            </div>
          )}

          {/* Empleado - Solo si es reporte de empleado */}
          {selectedReport === 'employee' && (
            <div className={period === 'custom' ? 'md:col-span-2' : ''}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empleado
              </label>
              <select
                value={selectedEmployeeId || ''}
                onChange={(e) => setSelectedEmployeeId(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
              >
                <option value="">Seleccionar empleado...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleGenerateReport}
            disabled={isLoading || (selectedReport === 'employee' && !selectedEmployeeId)}
            className="px-6 py-3 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {isLoading ? 'Generando...' : 'Generar Reporte'}
          </button>

          <button
            onClick={selectedReport === 'executive' ? handleExportExecutive : handleExportEmployee}
            disabled={isLoading || (selectedReport === 'employee' && !selectedEmployeeId)}
            className="px-6 py-3 text-[#18314F] bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      {selectedReport === 'executive' && executiveSummary && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#18314F]">Resumen Ejecutivo</h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Empleados</p>
                  <p className="text-3xl font-bold text-[#18314F] mt-2">
                    {executiveSummary.total_employees}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#18314F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Dispositivos Activos</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {executiveSummary.active_devices}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Alertas</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {executiveSummary.total_alerts}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Alertas Críticas</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {executiveSummary.critical_alerts}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Fatiga Promedio</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        executiveSummary.avg_fatigue >= 70
                          ? 'bg-red-500'
                          : executiveSummary.avg_fatigue >= 50
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${executiveSummary.avg_fatigue}%` }}
                    />
                  </div>
                </div>
                <span className="text-2xl font-bold text-[#18314F]">
                  {executiveSummary.avg_fatigue.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Empleados Alto Riesgo</h3>
              <p className="text-4xl font-bold text-red-600">
                {executiveSummary.high_risk_employees}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Requieren atención inmediata
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recomendaciones Aplicadas</h3>
              <p className="text-4xl font-bold text-green-600">
                {executiveSummary.recommendations_applied}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Mejoras implementadas
              </p>
            </div>
          </div>

          {/* Top Concerns */}
          {executiveSummary.top_concerns && executiveSummary.top_concerns.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Principales Preocupaciones</h3>
              <ul className="space-y-2">
                {executiveSummary.top_concerns.map((concern, index) => (
                  <li key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="flex items-center justify-center w-6 h-6 bg-[#18314F] text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Employee Report */}
      {selectedReport === 'employee' && employeeReport && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#18314F]">
            Reporte de {employeeReport.employee.first_name} {employeeReport.employee.last_name}
          </h2>

          {/* Metrics Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Fatiga Promedio</h3>
              <p className="text-3xl font-bold text-[#18314F]">
                {employeeReport.metrics_stats.avg_fatigue.toFixed(1)}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-sm font-medium text-gray-600 mb-2">SpO2 Promedio</h3>
              <p className="text-3xl font-bold text-blue-600">
                {employeeReport.metrics_stats.avg_spo2.toFixed(1)}%
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-sm font-medium text-gray-600 mb-2">FC Promedio</h3>
              <p className="text-3xl font-bold text-purple-600">
                {employeeReport.metrics_stats.avg_hr.toFixed(0)} bpm
              </p>
            </div>
          </div>

          {/* Alerts and Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Alertas</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-[#18314F]">{employeeReport.alerts_stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Críticas:</span>
                  <span className="font-bold text-red-600">{employeeReport.alerts_stats.critical}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Resueltas:</span>
                  <span className="font-bold text-green-600">{employeeReport.alerts_stats.resolved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pendientes:</span>
                  <span className="font-bold text-yellow-600">{employeeReport.alerts_stats.pending}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recomendaciones</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-[#18314F]">{employeeReport.recommendations_stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Aplicadas:</span>
                  <span className="font-bold text-green-600">{employeeReport.recommendations_stats.applied}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rechazadas:</span>
                  <span className="font-bold text-red-600">{employeeReport.recommendations_stats.rejected}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pendientes:</span>
                  <span className="font-bold text-yellow-600">{employeeReport.recommendations_stats.pending}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
