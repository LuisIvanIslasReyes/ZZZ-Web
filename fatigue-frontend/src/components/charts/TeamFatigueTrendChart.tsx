/**
 * Team Fatigue Trend Chart
 * Componente para mostrar la tendencia de fatiga del equipo en el tiempo
 */

import { useEffect, useState } from 'react';
import { LineChart } from './LineChart';
import { visualizationService, type FatigueTrendDataPoint } from '../../services/visualization.service';

interface TeamFatigueTrendChartProps {
  days?: number;
  interval?: 'hour' | 'day';
  employeeId?: number;
  title?: string;
  height?: number;
}

export function TeamFatigueTrendChart({
  days = 7,
  interval = 'day',
  employeeId,
  title = 'Tendencia de Fatiga del Equipo',
  height = 300
}: TeamFatigueTrendChartProps) {
  const [data, setData] = useState<FatigueTrendDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [days, interval, employeeId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const trends = await visualizationService.getFatigueTrends({
        days,
        interval,
        employee_id: employeeId
      });
      setData(trends);
    } catch (err) {
      console.error('Error loading fatigue trends:', err);
      setError('Error al cargar datos de tendencias');
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
        <p>No hay datos de tendencia disponibles para el período seleccionado</p>
      </div>
    );
  }

  // Formatear datos para el LineChart
  const labels = data.map(item => {
    const date = new Date(item.date);
    if (interval === 'hour' && item.hour !== undefined) {
      return `${date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })} ${item.hour}:00`;
    }
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  });

  const datasets = [
    {
      label: 'Promedio de Fatiga',
      data: data.map(item => item.avg_fatigue_index),
      borderColor: '#18314F',
      backgroundColor: 'rgba(24, 49, 79, 0.1)',
      fill: true,
    },
    {
      label: 'Nivel Crítico (80%)',
      data: data.map(() => 80),
      borderColor: '#EF4444',
      backgroundColor: 'transparent',
      borderDash: [5, 5],
      fill: false,
    }
  ];

  return (
    <div>
      <LineChart
        labels={labels}
        datasets={datasets}
        title={title}
        height={height}
      />
      <div className="flex gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#18314F]"></span>
          Promedio del Equipo
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>
          Nivel Crítico (80%)
        </div>
      </div>
    </div>
  );
}
