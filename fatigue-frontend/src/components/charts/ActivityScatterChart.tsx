/**
 * Activity Scatter Chart Component
 * Scatter plot con cuadrantes de riesgo que correlaciona actividad vs fatiga
 */

import React from 'react';
import { Scatter } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

interface ScatterDataPoint {
  employeeId: number;
  employeeName: string;
  activity: number;
  fatigue: number;
  hr: number;
  spo2: number;
  hrv: number;
  quadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  risk: 'optimal' | 'normal' | 'warning' | 'critical';
}

interface ActivityScatterChartProps {
  data: ScatterDataPoint[];
  height?: number;
  onPointClick?: (employee: ScatterDataPoint) => void;
}

const RISK_QUADRANTS = {
  Q1: { name: 'ALERTA', color: '#fbbf24', description: 'Alta fatiga + Baja actividad' },
  Q2: { name: 'CRÍTICO', color: '#ef4444', description: 'Alta fatiga + Alta actividad' },
  Q3: { name: 'NORMAL', color: '#94a3b8', description: 'Baja fatiga + Baja actividad' },
  Q4: { name: 'ÓPTIMO', color: '#10b981', description: 'Baja fatiga + Alta actividad' }
};

export const ActivityScatterChart: React.FC<ActivityScatterChartProps> = ({ 
  data, 
  height = 400,
  onPointClick 
}) => {
  // Agrupar datos por cuadrante
  const datasets = ['Q1', 'Q2', 'Q3', 'Q4'].map(quadrant => {
    const quadrantData = data.filter(d => d.quadrant === quadrant);
    const config = RISK_QUADRANTS[quadrant as keyof typeof RISK_QUADRANTS];
    
    return {
      label: config.name,
      data: quadrantData.map(d => ({
        x: d.activity,
        y: d.fatigue,
        employeeData: d
      })),
      backgroundColor: config.color,
      borderColor: config.color,
      borderWidth: 2,
      pointRadius: 8,
      pointHoverRadius: 12,
    };
  });

  const chartData = {
    datasets
  };

  const options: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Actividad (%)',
          font: { size: 14, weight: 'bold' }
        },
        grid: {
          color: (context) => {
            // Línea vertical en x=50
            return context.tick.value === 50 ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)';
          },
          lineWidth: (context) => context.tick.value === 50 ? 2 : 1
        }
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Fatiga (%)',
          font: { size: 14, weight: 'bold' }
        },
        grid: {
          color: (context) => {
            // Línea horizontal en y=70
            return context.tick.value === 70 ? 'rgba(239, 68, 68, 0.5)' : 'rgba(0, 0, 0, 0.1)';
          },
          lineWidth: (context) => context.tick.value === 70 ? 2 : 1
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
            const data = context[0].raw as { employeeData: ScatterDataPoint };
            return data.employeeData.employeeName;
          },
          label: (context) => {
            const data = context.raw as { employeeData: ScatterDataPoint };
            const emp = data.employeeData;
            return [
              `Actividad: ${emp.activity.toFixed(1)}%`,
              `Fatiga: ${emp.fatigue.toFixed(1)}%`,
              `HR: ${emp.hr} bpm`,
              `SpO2: ${emp.spo2}%`,
              `HRV: ${emp.hrv.toFixed(1)}`
            ];
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 }
      }
    },
    onClick: (_event, elements) => {
      if (elements.length > 0 && onPointClick) {
        const datasetIndex = elements[0].datasetIndex;
        const index = elements[0].index;
        const point = datasets[datasetIndex].data[index] as { employeeData: ScatterDataPoint };
        onPointClick(point.employeeData);
      }
    }
  };

  return (
    <div>
      <div style={{ height: `${height}px` }}>
        <Scatter data={chartData} options={options} redraw />
      </div>
      
      {/* Leyenda de cuadrantes */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {Object.entries(RISK_QUADRANTS).map(([key, config]) => (
          <div 
            key={key} 
            className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200"
          >
            <div 
              className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0"
              style={{ backgroundColor: config.color }}
            />
            <div className="text-xs">
              <p className="font-semibold text-gray-800">{config.name}</p>
              <p className="text-gray-600">{config.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
