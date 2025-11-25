import api from './api';

export const exportMyData = async (): Promise<Blob> => {
  const response = await api.get('/admin/export-my-data/', {
    responseType: 'blob',
  });
  return response.data;
};
