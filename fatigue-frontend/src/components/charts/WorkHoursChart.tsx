/**
 * Work Hours Chart
 * Muestra las horas de actividad basadas en métricas procesadas
 */

import { useEffect, useState } from 'react';
import { BarChart } from './BarChart';
import { visualizationService } from '../../services/visualization.service';

interface WorkHoursChartProps {
  days?: number;
  title?: string;
  height?: number;
}

export function WorkHoursChart({
  days = 7,
  title = 'Horas de Actividad',
  height = 220
}: WorkHoursChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [days]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const trends = await visualizationService.getFatigueTrends({
        days,
        interval: 'day'
      });
      setData(trends);
    } catch (err) {
      console.error('Error loading work hours:', err);
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

  if (error || !data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>Los datos de horas de trabajo estarán disponibles próximamente</p>
      </div>
    );
  }

  // Calcular horas aproximadas basadas en el número de lecturas
  // Cada lectura representa ~1 minuto de ventana
  const labels = data.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  });

  const hoursWorked = data.map(item => {
    // Aproximación: total_readings en minutos / 60 = horas
    return (item.total_readings / 60).toFixed(1);
  });

  const recommendedHours = data.map(() => 8); // 8 horas recomendadas

  const datasets = [
    {
      label: 'Horas Activas',
      data: hoursWorked.map(h => parseFloat(h)),
      backgroundColor: 'rgba(24, 49, 79, 0.8)',
      borderColor: '#18314F',
      borderWidth: 1,
    },
    {
      label: 'Horas Recomendadas',
      data: recommendedHours,
      backgroundColor: 'rgba(139, 92, 246, 0.6)',
      borderColor: '#8B5CF6',
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
          Horas Activas
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#8B5CF6]"></span>
          Horas Recomendadas (8h)
        </div>
      </div>
    </div>
  );
}
