/**
 * Supervisor Team Reports Page
 * Reportes y análisis del equipo
 * Diseño ZZZ Admin Style
 */

import { useState } from 'react';

export function SupervisorTeamReportsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  const [selectedReport, setSelectedReport] = useState<'overview' | 'fatigue' | 'productivity' | 'alerts'>('overview');

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting report as ${format}`);
    // Implementar lógica de exportación
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
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-xl transition-colors"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </button>
              <button
                onClick={() => exportReport('excel')}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl transition-colors"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                Excel
              </button>
              <button
                onClick={() => exportReport('csv')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
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
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-center h-[100px] text-gray-400">
          <p>Los datos de resumen estarán disponibles próximamente</p>
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
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#18314F] mb-6">Análisis de Productividad</h2>
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            <p>Los datos de productividad estarán disponibles próximamente</p>
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
