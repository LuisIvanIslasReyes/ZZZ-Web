/**
 * Fatigue Area Chart Component
 * Gráfica de área con gradiente, zonas de riesgo y marcadores de eventos
 */

import React from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import type { ChartOptions } from 'chart.js';

export interface FatigueDataPoint {
  timestamp: string;
  fatigue: number;
  avgHr: number;
  avgSpo2: number;
  activeEmployees: number;
  events?: Array<{
    type: 'alert' | 'break' | 'symptom' | 'recommendation';
    icon: string;
    description: string;
  }>;
}

interface FatigueAreaChartProps {
  data: FatigueDataPoint[];
  height?: number;
  criticalThreshold?: number;
}

export const FatigueAreaChart: React.FC<FatigueAreaChartProps> = ({ 
  data, 
  height = 400,
  criticalThreshold = 80 
}) => {
  const chartData = {
    labels: data.map(d => format(new Date(d.timestamp), 'HH:mm')),
    datasets: [
      {
        label: 'Fatiga Promedio',
        data: data.map(d => d.fatigue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D } }) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
          gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.3)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.2)');
          return gradient;
        },
        fill: true,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
          font: { size: 11 }
        }
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: (context) => {
            // Línea del umbral crítico
            if (context.tick.value === criticalThreshold) {
              return 'rgba(239, 68, 68, 0.5)';
            }
            return 'rgba(0, 0, 0, 0.1)';
          },
          lineWidth: (context) => {
            return context.tick.value === criticalThreshold ? 2 : 1;
          }
        },
        ticks: {
          callback: (value) => `${value}%`,
          font: { size: 11 }
        },
        title: {
          display: true,
          text: 'Fatiga (%)',
          font: { size: 12, weight: 'bold' }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const dataPoint = data[context[0].dataIndex];
            return format(new Date(dataPoint.timestamp), 'dd/MM/yyyy HH:mm');
          },
          label: (context) => {
            const dataPoint = data[context.dataIndex];
            return [
              `Fatiga: ${dataPoint.fatigue.toFixed(1)}%`,
              `HR promedio: ${dataPoint.avgHr} bpm`,
              `SpO2 promedio: ${dataPoint.avgSpo2}%`,
              `Empleados activos: ${dataPoint.activeEmployees}`
            ];
          },
          afterLabel: (context) => {
            const dataPoint = data[context.dataIndex];
            if (dataPoint.events && dataPoint.events.length > 0) {
              const eventLines = ['', '--- Eventos ---'];
              dataPoint.events.forEach(event => {
                eventLines.push(`${event.icon} ${event.description}`);
              });
              return eventLines;
            }
            return [];
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 }
      }
    }
  };

  // Calcular estadísticas
  const avgFatigue = data.reduce((sum, d) => sum + d.fatigue, 0) / data.length;
  const maxFatigue = Math.max(...data.map(d => d.fatigue));
  const minFatigue = Math.min(...data.map(d => d.fatigue));

  return (
    <div>
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <p className="text-xs text-gray-600">Promedio</p>
          <p className="text-lg font-bold text-gray-900">{avgFatigue.toFixed(1)}%</p>
        </div>
        <div className="bg-red-50 p-3 rounded border border-red-200">
          <p className="text-xs text-red-600">Máximo</p>
          <p className="text-lg font-bold text-red-700">{maxFatigue.toFixed(1)}%</p>
        </div>
        <div className="bg-green-50 p-3 rounded border border-green-200">
          <p className="text-xs text-green-600">Mínimo</p>
          <p className="text-lg font-bold text-green-700">{minFatigue.toFixed(1)}%</p>
        </div>
      </div>

      {/* Gráfica */}
      <div style={{ height: `${height}px` }}>
        <Line data={chartData} options={options} redraw />
      </div>

      {/* Leyenda de zonas */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(16, 185, 129, 0.5)' }}></div>
          <span className="text-gray-700">Normal (&lt; 40%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(245, 158, 11, 0.5)' }}></div>
          <span className="text-gray-700">Moderado (40-70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.5)' }}></div>
          <span className="text-gray-700">Alto (&gt; 70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-red-500" style={{ borderStyle: 'dashed' }}></div>
          <span className="text-gray-700">Umbral Crítico ({criticalThreshold}%)</span>
        </div>
      </div>
    </div>
  );
};
