/**
 * Employee Metrics Page
 * Métricas detalladas del empleado
 * Diseño ZZZ Admin Style
 */

import { LineChart, BarChart } from '../../components/charts';

export function EmployeeMetricsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#18314F] mb-1">My Metrics</h1>
        <p className="text-lg text-[#18314F]/70">Análisis detallado de mis indicadores de salud</p>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#18314F] text-white rounded-xl font-medium">Última Semana</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl font-medium">Último Mes</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl font-medium">Último Trimestre</button>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-sm text-gray-600 mb-2">Promedio de Fatiga</h3>
          <p className="text-4xl font-bold text-[#18314F] mb-1">52%</p>
          <p className="text-sm text-green-600">-8% vs semana anterior</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-sm text-gray-600 mb-2">Frecuencia Cardíaca Media</h3>
          <p className="text-4xl font-bold text-[#18314F] mb-1">72 BPM</p>
          <p className="text-sm text-green-600">Dentro del rango normal</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-sm text-gray-600 mb-2">Horas de Sueño Promedio</h3>
          <p className="text-4xl font-bold text-[#18314F] mb-1">7.2h</p>
          <p className="text-sm text-yellow-600">Recomendado: 8h</p>
        </div>
      </div>

      {/* Detailed Charts */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#18314F] mb-6">Evolución de Fatiga</h2>
        <LineChart
          labels={['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']}
          datasets={[
            {
              label: 'Nivel de Fatiga (%)',
              data: [42, 55, 48, 62, 58, 45, 40],
              borderColor: '#EF4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: true,
            },
          ]}
          height={250}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#18314F] mb-6">Frecuencia Cardíaca por Día</h2>
        <BarChart
          labels={['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']}
          datasets={[
            {
              label: 'FC Promedio (BPM)',
              data: [68, 72, 70, 75, 78, 65, 62],
              backgroundColor: '#22C55E',
            },
          ]}
          height={250}
        />
      </div>
    </div>
  );
}
