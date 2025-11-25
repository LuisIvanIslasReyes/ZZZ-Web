/**
 * Health Status Doughnut Chart
 * Muestra indicadores de salud con gráfica de dona
 */

import { useEffect, useState } from 'react';
import { DoughnutChart } from './DoughnutChart';
import { metricsService } from '../../services';

interface HealthStatusChartProps {
  employeeId?: number;
  title?: string;
  height?: number;
}

export function HealthStatusChart({
  employeeId,
  title = 'Indicadores de Salud',
  height = 220
}: HealthStatusChartProps) {
  const [avgHR, setAvgHR] = useState(75);
  const [avgSpO2, setAvgSpO2] = useState(98);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [employeeId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const stats = await metricsService.getMetricsStats({
        employee: employeeId
      });
      
      // Calcular promedios si hay datos
      if (stats) {
        setAvgHR((stats as any).avg_heart_rate || (stats as any).avg_hr || 75);
        setAvgSpO2((stats as any).avg_spo2 || 98);
      }
    } catch (err) {
      console.error('Error loading health stats:', err);
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

  // Mostrar distribución de salud basada en HR y SpO2
  const labels = ['Ritmo Cardíaco', 'Oxigenación', 'Otros Indicadores'];
  const data = [avgHR, avgSpO2, 85]; // 85 como placeholder para otros indicadores
  const colors = ['#18314F', '#22C55E', '#8B5CF6'];

  return (
    <div>
      <DoughnutChart
        labels={labels}
        data={data}
        colors={colors}
        height={height}
        title={title}
      />
      <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-[#18314F]"></span>
          </div>
          <p className="font-semibold text-lg">{avgHR.toFixed(1)}</p>
          <p className="text-xs text-gray-500">BPM</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-[#22C55E]"></span>
          </div>
          <p className="font-semibold text-lg">{avgSpO2.toFixed(1)}%</p>
          <p className="text-xs text-gray-500">SpO2</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-[#8B5CF6]"></span>
          </div>
          <p className="font-semibold text-lg">85%</p>
          <p className="text-xs text-gray-500">General</p>
        </div>
      </div>
    </div>
  );
}
