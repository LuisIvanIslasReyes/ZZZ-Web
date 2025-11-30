/**
 * Report Service
 * Servicio para generación y descarga de reportes
 */

import api from './api';
import type { EmployeeReport, TeamReport, ExecutiveSummary } from '../types/report.types';

class ReportService {
  private readonly BASE_PATH = '/reports';

  /**
   * Obtener reporte de empleado
   */
  async getEmployeeReport(employeeId: number, params?: {
    days?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<EmployeeReport> {
    const response = await api.get<EmployeeReport>(`${this.BASE_PATH}/employee_report/`, {
      params: {
        employee_id: employeeId,
        ...params
      }
    });
    return response.data;
  }

  /**
   * Obtener reporte de equipo (supervisor)
   */
  async getTeamReport(params?: {
    days?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<TeamReport> {
    const response = await api.get<TeamReport>(`${this.BASE_PATH}/team_report/`, {
      params
    });
    return response.data;
  }

  /**
   * Obtener resumen ejecutivo (admin)
   */
  async getExecutiveSummary(params?: {
    days?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<ExecutiveSummary> {
    const response = await api.get<ExecutiveSummary>(`${this.BASE_PATH}/executive_summary/`, {
      params
    });
    return response.data;
  }

  /**
   * Exportar reporte de empleado en CSV
   */
  async exportEmployeeReport(employeeId: number, params?: {
    days?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<Blob> {
    const response = await api.get(`${this.BASE_PATH}/employee_report/`, {
      params: {
        employee_id: employeeId,
        format: 'csv',
        ...params
      },
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Exportar reporte de equipo en múltiples formatos
   */
  async exportTeamReport(params?: {
    days?: number;
    start_date?: string;
    end_date?: string;
    format?: 'csv' | 'excel' | 'pdf';
  }): Promise<Blob> {
    const response = await api.get(`${this.BASE_PATH}/team_report/`, {
      params: {
        format: params?.format || 'csv',
        days: params?.days,
        start_date: params?.start_date,
        end_date: params?.end_date
      },
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Exportar resumen ejecutivo en CSV
   */
  async exportExecutiveSummary(params?: {
    days?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<Blob> {
    const response = await api.get(`${this.BASE_PATH}/executive_summary/`, {
      params: {
        format: 'csv',
        ...params
      },
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Descargar archivo blob
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export const reportService = new ReportService();
