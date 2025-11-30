/**
 * Notification Service
 * Servicio para enviar notificaciones al equipo
 */

import api from './api';

interface NotificationData {
  title: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
}

interface NotificationResponse {
  message: string;
  title: string;
  priority: string;
  employees_notified: number;
  alerts: Array<{
    employee_id: number;
    employee_name: string;
    alert_id: number;
  }>;
}

class NotificationService {
  /**
   * Enviar notificación al equipo
   * Crea alertas de tipo 'notification' para los empleados
   */
  async sendTeamNotification(data: NotificationData): Promise<NotificationResponse> {
    try {
      // Preparar datos - asegurar que priority tenga un valor
      const payload = {
        title: data.title,
        message: data.message,
        priority: data.priority || 'medium'
      };

      const response = await api.post<NotificationResponse>('/alerts/send-team-notification/', payload);
      return response.data;
    } catch (error: any) {
      console.error('Error sending notification:', error);
      console.error('Error response:', error.response?.data);
      
      // Manejar errores específicos
      if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Datos inválidos';
        throw new Error(errorMsg);
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('No tienes permisos para enviar notificaciones');
      } else if (error.response?.status === 500) {
        const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Error en el servidor';
        throw new Error(`Error del servidor: ${errorMsg}`);
      } else {
        throw new Error('No se pudo enviar la notificación. Intenta de nuevo.');
      }
    }
  }

  /**
   * Enviar notificación a un empleado específico
   * Nota: Este método está deprecado. El backend solo soporta notificaciones al equipo completo.
   */
  async sendEmployeeNotification(
    employeeId: number,
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<NotificationResponse> {
    return this.sendTeamNotification({
      title,
      message,
      priority
    });
  }
}

export default new NotificationService();
