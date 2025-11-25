/**
 * Hourly Activity Chart
 * Muestra la distribución de fatiga por hora del día
 */

import { useEffect, useState } from 'react';
import { BarChart } from './BarChart';
import { visualizationService } from '../../services/visualization.service';

interface HourlyActivityChartProps {
  days?: number;
  employeeId?: number;
  title?: string;
  height?: number;
}

interface HourlyData {
  hour: number;
  avg_fatigue_index?: number;
  avg_fatigue?: number;
  total_readings: number;
}

export function HourlyActivityChart({
  days = 7,
  employeeId,
  title = 'Actividad por Hora del Día',
  height = 300
}: HourlyActivityChartProps) {
  const [data, setData] = useState<HourlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [days, employeeId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const hourlyData = await visualizationService.getHourlyDistribution({
        days,
        employee_id: employeeId
      });
      setData(hourlyData);
    } catch (err) {
      console.error('Error loading hourly distribution:', err);
      setError('Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>No hay datos de actividad disponibles</p>
      </div>
    );
  }

  // Formatear datos para el BarChart
  const labels = data.map(item => `${item.hour}:00`);
  const datasets = [
    {
      label: 'Nivel de Fatiga Promedio',
      data: data.map(item => (item.avg_fatigue || item.avg_fatigue_index || 0) as number),
      backgroundColor: 'rgba(24, 49, 79, 0.8)',
      borderColor: '#18314F',
      borderWidth: 1,
    }
  ];

  return (
    <div>
      <BarChart
        labels={labels}
        datasets={datasets}
        title={title}
        height={height}
      />
      <div className="flex gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#18314F]"></span>
          Fatiga Promedio por Hora
        </div>
      </div>
    </div>
  );
}
