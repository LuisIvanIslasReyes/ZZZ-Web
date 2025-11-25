import api from './api';
import type { User } from '../types/user.types';

export const employeeProfileService = {
  async updateMyProfile(data: Partial<User>): Promise<User> {
    // PATCH a /auth/me/ para actualizar solo los campos permitidos
    // console.log('📤 Enviando datos al backend:', data);
    const response = await api.patch('/auth/me/', data);
    // console.log('📥 Respuesta del backend:', response.data);
    return response.data;
  },
};
