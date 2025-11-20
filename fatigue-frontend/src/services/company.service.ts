import api from './api';
import type {
  Company,
  CompanyDetail,
  CompanyStats,
  CompanyGlobalStats,
  CompanyCreateInput,
  CompanyUpdateInput
} from '../types/company.types';

/**
 * Company Service
 * Servicios para gestión de empresas (solo Admin)
 */

/**
 * Obtener lista de todas las empresas
 */
export const getCompanies = async (params?: {
  is_active?: boolean;
  ordering?: string;
}): Promise<Company[]> => {
  const response = await api.get<Company[]>('/admin/companies/', { params });
  return response.data;
};

/**
 * Obtener detalle de una empresa
 */
export const getCompany = async (id: number): Promise<CompanyDetail> => {
  const response = await api.get<CompanyDetail>(`/admin/companies/${id}/`);
  return response.data;
};

/**
 * Crear una nueva empresa
 */
export const createCompany = async (data: CompanyCreateInput): Promise<Company> => {
  const response = await api.post<Company>('/admin/companies/', data);
  return response.data;
};

/**
 * Actualizar una empresa
 */
export const updateCompany = async (
  id: number,
  data: CompanyUpdateInput
): Promise<Company> => {
  const response = await api.patch<Company>(`/admin/companies/${id}/`, data);
  return response.data;
};

/**
 * Eliminar una empresa
 */
export const deleteCompany = async (id: number): Promise<void> => {
  await api.delete(`/admin/companies/${id}/`);
};

/**
 * Obtener estadísticas globales de todas las empresas
 */
export const getCompanyGlobalStats = async (): Promise<CompanyGlobalStats> => {
  const companies = await getCompanies();
  return {
    total_companies: companies.length,
    active_companies: companies.filter(c => c.is_active).length,
    total_supervisors: companies.reduce((sum, c) => sum + c.supervisor_count, 0),
    total_employees: companies.reduce((sum, c) => sum + c.employee_count, 0),
  };
};

/**
 * Obtener estadísticas de una empresa
 */
export const getCompanyStats = async (id: number): Promise<CompanyStats> => {
  const response = await api.get<CompanyStats>(`/admin/companies/${id}/stats/`);
  return response.data;
};

/**
 * Activar/desactivar empresa
 */
export const toggleCompanyActive = async (id: number): Promise<Company> => {
  const response = await api.post<Company>(`/admin/companies/${id}/toggle_active/`);
  return response.data;
};

export default {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyStats,
  getCompanyGlobalStats,
  toggleCompanyActive,
};
