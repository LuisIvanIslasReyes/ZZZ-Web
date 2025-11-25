import api from './api';

export const employeeExportService = {
  async exportMyData(): Promise<Blob> {
    const response = await api.get('/auth/employee/export-my-data/', {
      responseType: 'blob', // Para recibir el archivo Excel
    });
    return response.data;
  },
};
