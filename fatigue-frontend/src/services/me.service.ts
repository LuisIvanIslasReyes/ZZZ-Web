/**
 * Me Service
 * Servicio para obtener datos del usuario autenticado
 */

import api from './api';
import type { User } from '../types/user.types';

class MeService {
  /**
   * Obtiene los datos del usuario autenticado (perfil personal)
   */
  async getMe(): Promise<User> {
    const response = await api.get<User>('/auth/employee/me/');
    console.log('📋 Datos del usuario autenticado:', response.data);
    return response.data;
  }
}

export default new MeService();
