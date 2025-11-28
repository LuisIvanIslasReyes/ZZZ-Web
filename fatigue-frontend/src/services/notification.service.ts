/**
 * Notification Service
 * Servicio para enviar notificaciones al equipo
 */

import api from './api';

interface NotificationData {
  title: string;
  message: string;
  severity?: 'info' | 'warning' | 'critical';
  employee_ids?: number[];
}

interface NotificationResponse {
  success: boolean;
  message: string;
  notifications_sent: number;
}

class NotificationService {
  /**
   * Enviar notificación al equipo
   * Crea alertas de tipo 'notification' para los empleados
   */
  async sendTeamNotification(data: NotificationData): Promise<NotificationResponse> {
    try {
      const response = await api.post<NotificationResponse>('/alerts/send_team_notification', data);
      return response.data;
    } catch (error: any) {
      console.error('Error sending notification:', error);
      
      // Manejar errores específicos
      if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.error || 'Datos inválidos';
        throw new Error(errorMsg);
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('No tienes permisos para enviar notificaciones');
      } else {
        throw new Error('No se pudo enviar la notificación. Intenta de nuevo.');
      }
    }
  }

  /**
   * Enviar notificación a un empleado específico
   */
  async sendEmployeeNotification(
    employeeId: number,
    title: string,
    message: string,
    severity: 'info' | 'warning' | 'critical' = 'info'
  ): Promise<NotificationResponse> {
    return this.sendTeamNotification({
      title,
      message,
      severity,
      employee_ids: [employeeId]
    });
  }
}

export default new NotificationService();
