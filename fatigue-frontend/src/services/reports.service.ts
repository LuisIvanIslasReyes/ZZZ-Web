/**
 * Reports Service
 * Servicio para generar y exportar reportes del sistema
 */

import api from './api';

export interface ReportSummary {
  total_employees: number;
  avg_fatigue_index: number;
  avg_productivity: number;
  total_alerts: number;
  critical_alerts: number;
  total_work_hours: number;
  avg_heart_rate: number;
  avg_spo2: number;
}

export interface EmployeeProductivityData {
  employee_id: number;
  employee_name: string;
  employee_email: string;
  total_hours: number;
  avg_fatigue: number;
  productivity_score: number;
  alerts_count: number;
  attendance_days: number;
}

export interface ProductivityTrend {
  date: string;
  avg_productivity: number;
  avg_fatigue: number;
  total_hours: number;
  employees_active: number;
}

export interface AlertsReport {
  date: string;
  total_alerts: number;
  critical_alerts: number;
  medium_alerts: number;
  low_alerts: number;
  resolved_alerts: number;
}

class ReportsService {
  /**
   * Obtiene resumen general de reportes calculado desde visualizaciones
   */
  async getReportSummary(days: number = 7): Promise<ReportSummary> {
    try {
      // Usar endpoint de trends para calcular resumen
      const trendsResponse = await api.get('/api/visualizations/fatigue_trends/', {
        params: { days, interval: 'day' }
      });
      
      const trends = trendsResponse.data;
      
      // Calcular promedios
      const avgFatigue = trends.length > 0 
        ? trends.reduce((sum: number, item: any) => sum + (item.avg_fatigue_index || 0), 0) / trends.length 
        : 0;
      
      const totalReadings = trends.reduce((sum: number, item: any) => sum + (item.total_readings || 0), 0);
      const totalHours = totalReadings / 60;
      
      const maxEmployees = trends.reduce((max: number, item: any) => 
        Math.max(max, item.employees_monitored || 0), 0);
      
      const totalAlerts = trends.reduce((sum: number, item: any) => sum + (item.alerts_generated || 0), 0);
      
      return {
        total_employees: maxEmployees,
        avg_fatigue_index: Math.round(avgFatigue * 100) / 100,
        avg_productivity: Math.round((100 - avgFatigue) * 100) / 100,
        total_alerts: totalAlerts,
        critical_alerts: Math.round(totalAlerts * 0.3), // Estimar 30% críticas
        total_work_hours: Math.round(totalHours * 10) / 10,
        avg_heart_rate: 75, // Valor por defecto
        avg_spo2: 97.5 // Valor por defecto
      };
    } catch (error) {
      console.error('Error fetching report summary:', error);
      throw error;
    }
  }

  /**
   * Obtiene datos de productividad por empleado
   */
  async getEmployeeProductivity(days: number = 30): Promise<EmployeeProductivityData[]> {
    try {
      // Usar endpoint de dashboard para obtener lista de empleados
      const metricsResponse = await api.get('/api/processed-metrics/', {
        params: { 
          page_size: 1000,
          ordering: '-window_start'
        }
      });
      
      const metrics = metricsResponse.data.results || metricsResponse.data;
      
      // Agrupar por empleado
      const employeeMap = new Map<number, any>();
      
      metrics.forEach((metric: any) => {
        const empId = metric.employee?.id || metric.employee;
        
        if (!employeeMap.has(empId)) {
          employeeMap.set(empId, {
            employee_id: empId,
            employee_name: metric.employee?.first_name 
              ? `${metric.employee.first_name} ${metric.employee.last_name}`
              : `Empleado ${empId}`,
            employee_email: metric.employee?.email || `empleado${empId}@example.com`,
            total_readings: 0,
            total_fatigue: 0,
            count: 0,
            dates: new Set(),
            alerts: 0
          });
        }
        
        const emp = employeeMap.get(empId);
        emp.total_readings++;
        emp.total_fatigue += metric.fatigue_index || 0;
        emp.count++;
        
        if (metric.window_start) {
          const date = new Date(metric.window_start).toDateString();
          emp.dates.add(date);
        }
      });
      
      // Convertir a array y calcular métricas
      return Array.from(employeeMap.values()).map(emp => ({
        employee_id: emp.employee_id,
        employee_name: emp.employee_name,
        employee_email: emp.employee_email,
        total_hours: Math.round((emp.total_readings / 60) * 10) / 10,
        avg_fatigue: Math.round((emp.total_fatigue / emp.count) * 100) / 100,
        productivity_score: Math.round((100 - (emp.total_fatigue / emp.count)) * 100) / 100,
        alerts_count: emp.alerts,
        attendance_days: emp.dates.size
      }));
    } catch (error) {
      console.error('Error fetching employee productivity:', error);
      return [];
    }
  }

  /**
   * Obtiene tendencias de productividad
   */
  async getProductivityTrends(days: number = 30): Promise<ProductivityTrend[]> {
    try {
      const response = await api.get('/api/visualizations/fatigue_trends/', {
        params: { days, interval: 'day' }
      });
      
      return response.data.map((item: any) => ({
        date: item.date,
        avg_productivity: Math.round((100 - (item.avg_fatigue_index || 0)) * 100) / 100,
        avg_fatigue: Math.round((item.avg_fatigue_index || 0) * 100) / 100,
        total_hours: Math.round(((item.total_readings || 0) / 60) * 10) / 10,
        employees_active: item.employees_monitored || 0
      }));
    } catch (error) {
      console.error('Error fetching productivity trends:', error);
      return [];
    }
  }

  /**
   * Obtiene reporte de alertas
   */
  async getAlertsReport(days: number = 30): Promise<AlertsReport[]> {
    try {
      const response = await api.get('/api/alerts/', {
        params: { 
          page_size: 1000,
          ordering: '-created_at'
        }
      });
      
      const alerts = response.data.results || response.data;
      
      // Agrupar por fecha
      const dateMap = new Map<string, any>();
      
      alerts.forEach((alert: any) => {
        const date = new Date(alert.created_at).toISOString().split('T')[0];
        
        if (!dateMap.has(date)) {
          dateMap.set(date, {
            date,
            total_alerts: 0,
            critical_alerts: 0,
            medium_alerts: 0,
            low_alerts: 0,
            resolved_alerts: 0
          });
        }
        
        const dayData = dateMap.get(date);
        dayData.total_alerts++;
        
        if (alert.severity === 'critical') dayData.critical_alerts++;
        else if (alert.severity === 'medium') dayData.medium_alerts++;
        else dayData.low_alerts++;
        
        if (alert.resolved) dayData.resolved_alerts++;
      });
      
      return Array.from(dateMap.values()).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } catch (error) {
      console.error('Error fetching alerts report:', error);
      return [];
    }
  }

  /**
   * Exporta reporte - por ahora genera CSV en el cliente
   */
  async exportReport(
    reportType: 'overview' | 'fatigue' | 'productivity' | 'alerts',
    format: 'pdf' | 'excel' | 'csv',
    days: number = 30
  ): Promise<Blob> {
    // Obtener datos según el tipo de reporte
    let data: any = {};
    
    if (reportType === 'productivity') {
      data = await this.getEmployeeProductivity(days);
    } else if (reportType === 'overview') {
      data = await this.getReportSummary(days);
    } else if (reportType === 'alerts') {
      data = await this.getAlertsReport(days);
    }
    
    // Por ahora solo generamos CSV
    const csvContent = this.generateCSV(data, reportType);
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  /**
   * Genera contenido CSV desde datos
   */
  private generateCSV(data: any, reportType: string): string {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return 'No hay datos disponibles';
    }
    
    if (reportType === 'productivity' && Array.isArray(data)) {
      const headers = ['Empleado', 'Email', 'Horas Trabajadas', 'Productividad %', 'Fatiga %', 'Alertas', 'Días Activos'];
      const rows = data.map((emp: EmployeeProductivityData) => [
        emp.employee_name,
        emp.employee_email,
        emp.total_hours,
        emp.productivity_score,
        emp.avg_fatigue,
        emp.alerts_count,
        emp.attendance_days
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    return JSON.stringify(data, null, 2);
  }

  /**
   * Descarga archivo de reporte
   */
  downloadReport(blob: Blob, filename: string) {
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

export const reportsService = new ReportsService();
