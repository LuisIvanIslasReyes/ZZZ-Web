/**
 * Supervisor Team Reports Page
 * Reportes y análisis del equipo
 * Diseño ZZZ Admin Style
 */

import { useState } from 'react';
import { LineChart, BarChart, DoughnutChart } from '../../components/charts';

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Promedio de Fatiga</span>
            <span className="bg-yellow-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#FACC15">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
          </div>
          <span className="text-4xl font-bold text-[#18314F]">54%</span>
          <p className="text-sm text-gray-500 mt-1">-8% vs período anterior</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Total de Alertas</span>
            <span className="bg-red-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#EF4444">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
          </div>
          <span className="text-4xl font-bold text-[#18314F]">23</span>
          <p className="text-sm text-gray-500 mt-1">12 resueltas, 11 pendientes</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Productividad</span>
            <span className="bg-green-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#22C55E">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </span>
          </div>
          <span className="text-4xl font-bold text-[#18314F]">87%</span>
          <p className="text-sm text-gray-500 mt-1">+5% vs período anterior</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Horas Trabajadas</span>
            <span className="bg-blue-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <span className="text-4xl font-bold text-[#18314F]">312</span>
          <p className="text-sm text-gray-500 mt-1">Equipo completo</p>
        </div>
      </div>

      {/* Charts - Overview Report */}
      {selectedReport === 'overview' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evolución Semanal */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#18314F">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <span className="text-lg font-semibold text-[#18314F]">Evolución Semanal del Equipo</span>
              </div>
              <LineChart
                labels={['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']}
                datasets={[
                  {
                    label: 'Nivel de Fatiga (%)',
                    data: [45, 52, 48, 58, 62, 55, 42],
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true,
                  },
                  {
                    label: 'Productividad (%)',
                    data: [85, 78, 82, 72, 68, 75, 88],
                    borderColor: '#22C55E',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    fill: true,
                  },
                ]}
                height={250}
              />
            </div>

            {/* Distribución de Estado */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#18314F">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16M12 4v16" />
                </svg>
                <span className="text-lg font-semibold text-[#18314F]">Distribución de Estado del Equipo</span>
              </div>
              <DoughnutChart
                labels={['Normal', 'Observación', 'Crítico']}
                data={[15, 8, 2]}
                colors={['#22C55E', '#FACC15', '#EF4444']}
                height={250}
              />
              <div className="flex flex-col gap-1 mt-4 text-sm">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#22C55E]"></span>Normal <span className="ml-auto font-semibold">15 empleados (60%)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#FACC15]"></span>Observación <span className="ml-auto font-semibold">8 empleados (32%)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>Crítico <span className="ml-auto font-semibold">2 empleados (8%)</span></div>
              </div>
            </div>
          </div>

          {/* Rendimiento por Empleado */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#18314F">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v18h18" />
              </svg>
              <span className="text-lg font-semibold text-[#18314F]">Rendimiento Individual</span>
            </div>
            <BarChart
              labels={['Emp 1', 'Emp 2', 'Emp 3', 'Emp 4', 'Emp 5', 'Emp 6', 'Emp 7', 'Emp 8']}
              datasets={[
                {
                  label: 'Fatiga Promedio (%)',
                  data: [45, 52, 38, 68, 42, 55, 48, 62],
                  backgroundColor: '#EF4444',
                },
                {
                  label: 'Productividad (%)',
                  data: [88, 82, 92, 72, 90, 78, 85, 70],
                  backgroundColor: '#22C55E',
                },
              ]}
              height={250}
            />
          </div>
        </>
      )}

      {/* Fatigue Analysis Report */}
      {selectedReport === 'fatigue' && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#18314F] mb-6">Análisis Detallado de Fatiga</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-[#18314F] mb-4">Tendencia de Fatiga por Turno</h3>
              <LineChart
                labels={['06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00']}
                datasets={[
                  {
                    label: 'Turno Mañana',
                    data: [30, 35, 42, 48, 52, 45, 38],
                    borderColor: '#3B82F6',
                    backgroundColor: 'transparent',
                  },
                  {
                    label: 'Turno Tarde',
                    data: [35, 40, 45, 52, 58, 55, 50],
                    borderColor: '#F59E0B',
                    backgroundColor: 'transparent',
                  },
                  {
                    label: 'Turno Noche',
                    data: [40, 48, 55, 62, 68, 65, 60],
                    borderColor: '#8B5CF6',
                    backgroundColor: 'transparent',
                  },
                ]}
                height={250}
              />
            </div>
            <div>
              <h3 className="font-semibold text-[#18314F] mb-4">Factores de Riesgo</h3>
              <BarChart
                labels={['Horas Extra', 'Falta Sueño', 'Estrés Alto', 'Carga Física', 'Temperatura']}
                datasets={[
                  {
                    label: 'Incidencia',
                    data: [12, 18, 15, 8, 5],
                    backgroundColor: ['#EF4444', '#F59E0B', '#FACC15', '#3B82F6', '#8B5CF6'],
                  },
                ]}
                height={250}
              />
            </div>
          </div>
        </div>
      )}

      {/* Productivity Report */}
      {selectedReport === 'productivity' && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#18314F] mb-6">Análisis de Productividad</h2>
          <div className="space-y-6">
            <LineChart
              labels={['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']}
              datasets={[
                {
                  label: 'Productividad General (%)',
                  data: [82, 85, 83, 87],
                  borderColor: '#22C55E',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  fill: true,
                },
                {
                  label: 'Meta (%)',
                  data: [80, 80, 80, 80],
                  borderColor: '#18314F',
                  backgroundColor: 'transparent',
                  borderDash: [5, 5],
                },
              ]}
              height={250}
            />
          </div>
        </div>
      )}

      {/* Alerts History Report */}
      {selectedReport === 'alerts' && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#18314F] mb-6">Historial de Alertas</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-[#18314F] mb-4">Alertas por Día</h3>
              <BarChart
                labels={['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']}
                datasets={[
                  {
                    label: 'Críticas',
                    data: [2, 1, 3, 2, 4, 1, 0],
                    backgroundColor: '#EF4444',
                  },
                  {
                    label: 'Altas',
                    data: [3, 4, 2, 5, 3, 2, 1],
                    backgroundColor: '#F59E0B',
                  },
                  {
                    label: 'Medias',
                    data: [5, 6, 4, 7, 5, 3, 2],
                    backgroundColor: '#FACC15',
                  },
                ]}
                height={250}
              />
            </div>
            <div>
              <h3 className="font-semibold text-[#18314F] mb-4">Tiempo de Resolución</h3>
              <DoughnutChart
                labels={['< 1 hora', '1-4 horas', '4-8 horas', '> 8 horas']}
                data={[35, 45, 15, 5]}
                colors={['#22C55E', '#FACC15', '#F59E0B', '#EF4444']}
                height={250}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
