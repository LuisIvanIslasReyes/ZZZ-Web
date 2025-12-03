/**
 * Biometric Radar Chart Component
 * Gráfica radial que compara métricas promedio del equipo contra valores saludables
 */

import React from 'react';
import { Radar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

interface BiometricStats {
  avgHr: number;
  avgSpo2: number;
  avgHrv: number;
  avgActivity: number;
  avgFatigue: number;
}

interface HealthyRange {
  hr: number;
  spo2: number;
  hrv: number;
  activity: number;
  fatigue: number;
}

interface BiometricRadarChartProps {
  teamStats: BiometricStats;
  healthyRange: HealthyRange;
  height?: number;
}

export const BiometricRadarChart: React.FC<BiometricRadarChartProps> = ({ 
  teamStats, 
  healthyRange,
  height = 400 
}) => {
  // Normalizar valores a escala 0-100
  const normalizeHr = (value: number) => ((value - 40) / (140 - 40)) * 100;
  const normalizeHrv = (value: number) => ((value - 20) / (80 - 20)) * 100;

  const radarData = {
    labels: ['HR', 'SpO2', 'HRV', 'Actividad', 'Fatiga (inv)'],
    datasets: [
      {
        label: 'Equipo',
        data: [
          normalizeHr(teamStats.avgHr),
          teamStats.avgSpo2,
          normalizeHrv(teamStats.avgHrv),
          teamStats.avgActivity * 100,
          100 - teamStats.avgFatigue // Invertido: menos fatiga es mejor
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        label: 'Rango Saludable',
        data: [
          normalizeHr(healthyRange.hr),
          healthyRange.spo2,
          normalizeHrv(healthyRange.hrv),
          healthyRange.activity * 100,
          100 - healthyRange.fatigue
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(16, 185, 129)',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: window.devicePixelRatio,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          backdropColor: 'transparent',
          font: { size: 11 }
        },
        pointLabels: {
          font: { size: 13, weight: 'bold' }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
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
            const labels = ['Ritmo Cardíaco', 'Saturación O₂', 'Variabilidad HR', 'Nivel Actividad', 'Baja Fatiga'];
            return labels[context[0].dataIndex] || context[0].label;
          },
          label: (context) => {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.r;
            const dataIndex = context.dataIndex;
            
            let actualValue = '';
            if (dataIndex === 0) {
              // HR
              const hrValue = (value / 100) * (140 - 40) + 40;
              actualValue = `${hrValue.toFixed(0)} bpm`;
            } else if (dataIndex === 1) {
              // SpO2
              actualValue = `${value.toFixed(1)}%`;
            } else if (dataIndex === 2) {
              // HRV
              const hrvValue = (value / 100) * (80 - 20) + 20;
              actualValue = `${hrvValue.toFixed(1)}`;
            } else if (dataIndex === 3) {
              // Activity
              actualValue = `${value.toFixed(1)}%`;
            } else if (dataIndex === 4) {
              // Fatiga invertida
              const fatigueValue = 100 - value;
              actualValue = `${fatigueValue.toFixed(1)}% fatiga`;
            }
            
            return `${datasetLabel}: ${actualValue}`;
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 }
      }
    }
  };

  return (
    <div>
      <div style={{ height: `${height}px` }}>
        <Radar data={radarData} options={options} redraw />
      </div>
      
      {/* Valores reales */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
        <div className="bg-blue-50 p-2 rounded border border-blue-200">
          <p className="font-semibold text-blue-900">HR Promedio</p>
          <p className="text-blue-700">{teamStats.avgHr.toFixed(0)} bpm</p>
        </div>
        <div className="bg-blue-50 p-2 rounded border border-blue-200">
          <p className="font-semibold text-blue-900">SpO2 Promedio</p>
          <p className="text-blue-700">{teamStats.avgSpo2.toFixed(1)}%</p>
        </div>
        <div className="bg-blue-50 p-2 rounded border border-blue-200">
          <p className="font-semibold text-blue-900">HRV Promedio</p>
          <p className="text-blue-700">{teamStats.avgHrv.toFixed(1)}</p>
        </div>
        <div className="bg-blue-50 p-2 rounded border border-blue-200">
          <p className="font-semibold text-blue-900">Actividad</p>
          <p className="text-blue-700">{(teamStats.avgActivity * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-blue-50 p-2 rounded border border-blue-200">
          <p className="font-semibold text-blue-900">Fatiga</p>
          <p className="text-blue-700">{teamStats.avgFatigue.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};
