/**
 * Productivity vs Fatigue Chart
 * Muestra la correlación entre nivel de actividad y fatiga
 */

import { useEffect, useState } from 'react';
import { LineChart } from './LineChart';
import { visualizationService } from '../../services/visualization.service';

interface ProductivityFatigueChartProps {
  days?: number;
  title?: string;
  height?: number;
}

export function ProductivityFatigueChart({
  days = 7,
  title = 'Actividad vs Fatiga',
  height = 220
}: ProductivityFatigueChartProps) {
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
      console.error('Error loading productivity data:', err);
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
        <p>Los datos de productividad vs fatiga estarán disponibles próximamente</p>
      </div>
    );
  }

  // Formatear datos
  const labels = data.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  });

  // Simular productividad inversa a la fatiga (más fatiga = menos productividad)
  const productivityData = data.map(item => Math.max(0, 100 - item.avg_fatigue_index));
  const fatigueData = data.map(item => item.avg_fatigue_index);

  const datasets = [
    {
      label: 'Nivel de Actividad (%)',
      data: productivityData,
      borderColor: '#22C55E',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
    },
    {
      label: 'Fatiga Promedio (%)',
      data: fatigueData,
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
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
          <span className="w-3 h-3 rounded-full bg-[#22C55E]"></span>
          Nivel de Actividad
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>
          Fatiga Promedio
        </div>
      </div>
    </div>
  );
}
