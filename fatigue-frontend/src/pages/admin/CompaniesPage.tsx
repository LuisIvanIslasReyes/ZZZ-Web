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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Empresas Clientes</h1>
          <p className="text-gray-600 mt-1">Gestión de empresas que contratan el servicio</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Empresa
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="stat-title">Total Empresas</div>
              <div className="stat-value text-primary">{stats.total_companies}</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-success">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-title">Activas</div>
              <div className="stat-value text-success">{stats.active_companies}</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="stat-title">Total Supervisores</div>
              <div className="stat-value text-info">{stats.total_supervisors}</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="stat-title">Total Empleados</div>
              <div className="stat-value text-secondary">{stats.total_employees}</div>
            </div>
          </div>
        </div>
      )}

      {/* Companies List */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Lista de Empresas</h2>
          
          {companies.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-gray-500 text-lg">No hay empresas registradas</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary mt-4"
              >
                Crear Primera Empresa
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Contacto</th>
                    <th>Supervisores</th>
                    <th>Empleados</th>
                    <th>Max Empleados</th>
                    <th>Suscripción</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <div>
                            <div className="font-bold">{company.name}</div>
                            <div className="text-sm text-gray-500">ID: {company.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div>{company.contact_email}</div>
                          {company.contact_phone && (
                            <div className="text-gray-500">{company.contact_phone}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-info">{company.supervisor_count}</div>
                      </td>
                      <td>
                        <div className="badge badge-secondary">{company.employee_count}</div>
                      </td>
                      <td>
                        <span className="text-gray-600">{company.max_employees}</span>
                      </td>
                      <td>
                        <div className="text-sm">
                          {company.subscription_end ? (
                            <>
                              <div>Hasta: {new Date(company.subscription_end).toLocaleDateString()}</div>
                              <div className={`badge badge-sm ${company.is_subscription_active ? 'badge-success' : 'badge-error'}`}>
                                {company.is_subscription_active ? 'Activa' : 'Vencida'}
                              </div>
                            </>
                          ) : (
                            <div className="badge badge-success">Indefinida</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={`badge ${company.is_active ? 'badge-success' : 'badge-error'}`}>
                          {company.is_active ? 'Activa' : 'Inactiva'}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => handleEdit(company)}
                          >
                            Editar
                          </button>
                          <button
                            className={`btn btn-sm ${company.is_active ? 'btn-warning' : 'btn-success'}`}
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
