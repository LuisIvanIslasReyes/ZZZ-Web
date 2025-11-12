/**
 * StatCard Component
 * Card para mostrar estadísticas con icono, valor y cambio
 */

import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string | ReactNode;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  trend?: string;
  trendUp?: boolean;
  variant?: 'success' | 'warning' | 'error' | 'info';
  loading?: boolean;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  change, 
  trend,
  trendUp,
  variant = 'info',
  loading 
}: StatCardProps) {
  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div className="skeleton h-12 w-12 rounded-full"></div>
            <div className="skeleton h-8 w-20"></div>
          </div>
          <div className="skeleton h-4 w-24 mt-2"></div>
        </div>
      </div>
    );
  }

  const variantClasses = {
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info'
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`text-4xl ${variantClasses[variant]}`}>{icon}</div>
            <div>
              <p className="text-sm text-base-content/60">{title}</p>
              <p className="text-3xl font-bold">{value}</p>
              {trend && (
                <p className={`text-xs mt-1 ${trendUp ? 'text-success' : 'text-base-content/60'}`}>
                  {trendUp && '↑ '}{!trendUp && '↓ '}{trend}
                </p>
              )}
            </div>
          </div>
          {change && (
            <div
              className={`badge gap-1 ${
                change.type === 'increase' ? 'badge-success' : 'badge-error'
              }`}
            >
              {change.type === 'increase' ? '↑' : '↓'} {Math.abs(change.value)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
