import api from './api';
import type { User } from '../types/user.types';

export interface AvatarResponse {
  message: string;
  avatar_url: string;
}

export const employeeProfileService = {
  async updateMyProfile(data: Partial<User>): Promise<User> {
    // PATCH a /auth/me/ para actualizar solo los campos permitidos
    // console.log('📤 Enviando datos al backend:', data);
    const response = await api.patch('/auth/me/', data);
    // console.log('📥 Respuesta del backend:', response.data);
    return response.data;
  },

  async uploadAvatar(file: File): Promise<AvatarResponse> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/auth/upload-avatar/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteAvatar(): Promise<{ message: string }> {
    const response = await api.delete('/auth/upload-avatar/');
    return response.data;
  },
};
