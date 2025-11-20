import { useState, useEffect } from 'react';
import { companyService } from '../../services';
import { CompanyFormModal } from '../../components/forms/CompanyFormModal';
import type { Company, CompanyGlobalStats, CompanyCreateInput, CompanyUpdateInput } from '../../types';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState<CompanyGlobalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const [companiesData, statsData] = await Promise.all([
        companyService.getCompanies(),
        companyService.getCompanyGlobalStats(),
      ]);
      setCompanies(companiesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCompany = async (data: CompanyCreateInput) => {
    try {
      setIsSubmitting(true);
      await companyService.createCompany(data);
      setIsModalOpen(false);
      setEditingCompany(null);
      await loadCompanies();
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCompany = async (data: CompanyUpdateInput) => {
    if (!editingCompany) return;
    try {
      setIsSubmitting(true);
      await companyService.updateCompany(editingCompany.id, data);
      setIsModalOpen(false);
      setEditingCompany(null);
      await loadCompanies();
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (data: CompanyCreateInput | CompanyUpdateInput) => {
    if (editingCompany) {
      await handleUpdateCompany(data as CompanyUpdateInput);
    } else {
      await handleCreateCompany(data as CompanyCreateInput);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
  };

  const handleToggleActive = async (id: number) => {
    try {
      await companyService.toggleCompanyActive(id);
      await loadCompanies();
    } catch (error) {
      console.error('Error toggling company:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#18314F] mb-1">Empresas Clientes</h1>
            <p className="text-lg text-[#18314F]/70">Gestión de empresas que contratan el servicio</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#18314F] hover:bg-[#18314F]/90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Empresa
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Empresas */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-base font-medium">Total Empresas</span>
              <span className="bg-blue-100 rounded-full p-2">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
            </div>
            <span className="text-4xl font-bold text-[#18314F]">{stats.total_companies}</span>
          </div>

          {/* Activas */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-base font-medium">Activas</span>
              <span className="bg-green-100 rounded-full p-2">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#22C55E">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <span className="text-4xl font-bold text-[#18314F]">{stats.active_companies}</span>
          </div>

          {/* Total Supervisores */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-base font-medium">Total Supervisores</span>
              <span className="bg-purple-100 rounded-full p-2">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#A855F7">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </div>
            <span className="text-4xl font-bold text-[#18314F]">{stats.total_supervisors}</span>
          </div>

          {/* Total Empleados */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-base font-medium">Total Empleados</span>
              <span className="bg-orange-100 rounded-full p-2">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#F97316">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
            </div>
            <span className="text-4xl font-bold text-[#18314F]">{stats.total_employees}</span>
          </div>
        </div>
      )}

      {/* Companies List */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-[#18314F] mb-6">Lista de Empresas</h2>
        
        {companies.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-gray-500 text-lg">No hay empresas registradas</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-[#18314F] hover:bg-[#18314F]/90 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Crear Primera Empresa
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Empresa</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contacto</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Supervisores</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Empleados</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Max Empleados</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Suscripción</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-100 rounded-full p-2">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </span>
                        <div>
                          <div className="font-bold text-[#18314F]">{company.name}</div>
                          <div className="text-sm text-gray-500">ID: {company.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{company.contact_email}</div>
                        {company.contact_phone && (
                          <div className="text-gray-500">{company.contact_phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {company.supervisor_count}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {company.employee_count}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-gray-600 font-medium">{company.max_employees}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {company.subscription_end ? (
                          <>
                            <div className="text-gray-900">Hasta: {new Date(company.subscription_end).toLocaleDateString()}</div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold mt-1 ${
                              company.is_subscription_active 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {company.is_subscription_active ? 'Activa' : 'Vencida'}
                            </span>
                          </>
                        ) : (
                          <span className="inline-flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                            Indefinida
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        company.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {company.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                          onClick={() => handleEdit(company)}
                        >
                          Editar
                        </button>
                        <button
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            company.is_active 
                              ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700' 
                              : 'bg-green-100 hover:bg-green-200 text-green-700'
                          }`}
                          onClick={() => handleToggleActive(company.id)}
                        >
                          {company.is_active ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Company Form Modal */}
      <CompanyFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingCompany}
        isLoading={isSubmitting}
      />
    </div>
  );
}
