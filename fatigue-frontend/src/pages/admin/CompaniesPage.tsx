import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { companyService, supervisorService } from '../../services';
import { CompanyFormModal } from '../../components/forms/CompanyFormModal';
import { SupervisorsModal } from '../../components/forms/SupervisorsModal';
import type { Company, CompanyGlobalStats, CompanyCreateInput, CompanyUpdateInput } from '../../types';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState<CompanyGlobalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [supervisorsModalCompany, setSupervisorsModalCompany] = useState<Company | null>(null);

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

  const handleCreateCompany = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      // Primero crear la empresa
      const companyData = {
        name: data.name,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        address: data.address,
        max_employees: data.max_employees,
        subscription_start: data.subscription_start,
        subscription_end: data.subscription_end,
      };
      
      const newCompany = await companyService.createCompany(companyData);
      
      // Si se proporcionaron datos del supervisor, crearlo
      if (data.supervisor_email && data.supervisor_password) {
        const supervisorData = {
          email: data.supervisor_email,
          password: data.supervisor_password,
          first_name: data.supervisor_first_name,
          last_name: data.supervisor_last_name,
          company: newCompany.id,
          role: 'supervisor' as const,
        };
        
        try {
          await supervisorService.createSupervisor(supervisorData);
          toast.success('Empresa y supervisor creados exitosamente');
        } catch (error) {
          console.error('Error creating supervisor:', error);
          toast.error('Empresa creada pero hubo un error al crear el supervisor. Créalo manualmente desde el botón "Supervisores".');
        }
      } else {
        toast.success('Empresa creada exitosamente. Recuerda crear su cuenta de supervisor.');
      }
      
      setIsModalOpen(false);
      setEditingCompany(null);
      await loadCompanies();
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error('Error al crear la empresa. Por favor, intenta de nuevo.');
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
      toast.success('Empresa actualizada exitosamente');
      setIsModalOpen(false);
      setEditingCompany(null);
      await loadCompanies();
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('Error al actualizar la empresa. Por favor, intenta de nuevo.');
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
      const company = companies.find(c => c.id === id);
      await companyService.toggleCompanyActive(id);
      toast.success(`Empresa ${company?.is_active ? 'desactivada' : 'activada'} exitosamente`);
      await loadCompanies();
    } catch (error) {
      console.error('Error toggling company:', error);
      toast.error('Error al cambiar el estado de la empresa');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Empresas Clientes</h1>
            <p className="text-gray-600">Gestión de empresas que contratan el servicio</p>
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
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Empresas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-base font-medium">Total Empresas</span>
              <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-4xl font-bold text-gray-900">{stats.total_companies}</span>
          </div>

          {/* Activas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-base font-medium">Activas</span>
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-4xl font-bold text-gray-900">{stats.active_companies}</span>
          </div>

          {/* Empresas con Supervisor Activo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-base font-medium">Empresas con Supervisor</span>
              <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-4xl font-bold text-gray-900">{stats.total_supervisors}</span>
            <span className="text-xs text-gray-500 mt-1">1 supervisor = 1 empresa</span>
          </div>

          {/* Total Empleados */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-base font-medium">Total Empleados</span>
              <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-4xl font-bold text-gray-900">{stats.total_employees}</span>
          </div>
          </div>
        </div>
      )}

      {/* Companies List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Lista de Empresas</h2>
        
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
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Supervisor</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Empleados</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Max Empleados</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Suscripción</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div>
                          <div className="font-bold text-gray-900">{company.name}</div>
                          {/* <div className="text-sm text-gray-500">ID: {company.id}</div> */}
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
                      {company.supervisor_count > 0 ? (
                        <span className="text-green-600 font-medium">✓ Activo</span>
                      ) : (
                        <span className="text-gray-400">Sin supervisor</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-gray-900 font-medium">{company.employee_count}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-gray-600 font-medium">{company.max_employees}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {company.subscription_end ? (
                          <>
                            <div className="text-gray-600">Hasta: {new Date(company.subscription_end).toLocaleDateString()}</div>
                            <span className={`text-xs font-medium ${
                              company.is_subscription_active 
                                ? 'text-green-600' 
                                : 'text-red-500'
                            }`}>
                              {company.is_subscription_active ? 'Activa' : 'Vencida'}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs">Indefinida</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          company.is_active ? 'bg-green-500' : 'bg-gray-300'
                        }`}></span>
                        <span className={`text-sm font-medium ${
                          company.is_active ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {company.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-2 items-center">
                        <button
                          className="w-full px-3 py-1.5 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                          onClick={() => setSupervisorsModalCompany(company)}
                          title="Gestionar supervisores"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          Supervisores
                        </button>
                        <div className="flex gap-2 w-full">
                          <button
                            className="flex-1 px-3 py-1.5 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-600 rounded-lg text-sm font-medium transition-colors"
                            onClick={() => handleEdit(company)}
                          >
                            Editar
                          </button>
                          <button
                            className={`flex-1 px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
                              company.is_active 
                                ? 'border-red-200 hover:border-red-300 hover:bg-red-50 text-red-500' 
                                : 'border-green-200 hover:border-green-300 hover:bg-green-50 text-green-600'
                            }`}
                            onClick={() => handleToggleActive(company.id)}
                          >
                            {company.is_active ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
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

      {/* Supervisors Management Modal */}
      {supervisorsModalCompany && (
        <SupervisorsModal
          isOpen={!!supervisorsModalCompany}
          onClose={() => {
            setSupervisorsModalCompany(null);
            loadCompanies(); // Recargar para actualizar los conteos
          }}
          companyId={supervisorsModalCompany.id}
          companyName={supervisorsModalCompany.name}
        />
      )}
    </div>
  );
}
