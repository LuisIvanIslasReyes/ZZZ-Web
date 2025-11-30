/**
 * Supervisors Management Modal
 * Modal para gestionar supervisores de una empresa
 */

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { supervisorService } from '../../services';
import type { Supervisor } from '../../services/supervisor.service';

const supervisorSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  password_confirm: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  first_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  last_name: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
}).refine((data) => data.password === data.password_confirm, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirm'],
});

type SupervisorFormData = z.infer<typeof supervisorSchema>;

interface SupervisorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: number;
  companyName: string;
}

export function SupervisorsModal({ isOpen, onClose, companyId, companyName }: SupervisorsModalProps) {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SupervisorFormData>({
    resolver: zodResolver(supervisorSchema),
  });

  useEffect(() => {
    if (isOpen) {
      loadSupervisors();
      setShowCreateForm(false);
    }
  }, [isOpen, companyId]);

  const loadSupervisors = async () => {
    try {
      setIsLoading(true);
      const allSupervisors = await supervisorService.getSupervisors();
      // Filtrar supervisores de esta empresa
      const companySupervisors = allSupervisors.filter(s => s.company === companyId);
      setSupervisors(companySupervisors);
    } catch (error) {
      console.error('Error loading supervisors:', error);
      toast.error('Error al cargar supervisores');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SupervisorFormData) => {
    try {
      setIsSubmitting(true);
      await supervisorService.createSupervisor({
        ...data,
        company: companyId,
        is_active: true,
      });
      toast.success('Supervisor creado exitosamente');
      reset();
      setShowCreateForm(false);
      await loadSupervisors();
    } catch (error: any) {
      console.error('Error creating supervisor:', error);
      const errorMsg = error?.response?.data?.password_confirm?.[0] || 
                       error?.response?.data?.password?.[0] ||
                       error?.response?.data?.email?.[0] ||
                       error?.response?.data?.company?.[0] || 
                       'Error al crear supervisor';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (supervisorId: number, currentStatus: boolean) => {
    try {
      await supervisorService.toggleSupervisorStatus(supervisorId, !currentStatus);
      toast.success(`Supervisor ${currentStatus ? 'desactivado' : 'activado'} exitosamente`);
      await loadSupervisors();
    } catch (error: any) {
      console.error('Error toggling supervisor:', error);
      const errorMsg = error?.response?.data?.company?.[0] || 'Error al cambiar estado';
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (supervisorId: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este supervisor?')) return;
    
    try {
      await supervisorService.deleteSupervisor(supervisorId);
      toast.success('Supervisor eliminado exitosamente');
      await loadSupervisors();
    } catch (error) {
      console.error('Error deleting supervisor:', error);
      toast.error('Error al eliminar supervisor');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#18314F] text-white px-8 py-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Supervisores de {companyName}</h2>
              <p className="text-white/80 mt-1">Gestiona las cuentas de supervisor para esta empresa</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Create New Button */}
          {!showCreateForm && (
            <div className="mb-6">
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-[#18314F] hover:bg-[#18314F]/90 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear Nuevo Supervisor
              </button>
            </div>
          )}

          {/* Create Form */}
          {showCreateForm && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#18314F]">Nuevo Supervisor</h3>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    reset();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent transition-all ${
                        errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="supervisor@empresa.com"
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      {...register('password')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent transition-all ${
                        errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="Mínimo 8 caracteres"
                      disabled={isSubmitting}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Contraseña <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      {...register('password_confirm')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent transition-all ${
                        errors.password_confirm ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="Repite la contraseña"
                      disabled={isSubmitting}
                    />
                    {errors.password_confirm && (
                      <p className="mt-1 text-sm text-red-600">{errors.password_confirm.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('first_name')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent transition-all ${
                        errors.first_name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="Juan"
                      disabled={isSubmitting}
                    />
                    {errors.first_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('last_name')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent transition-all ${
                        errors.last_name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="Pérez"
                      disabled={isSubmitting}
                    />
                    {errors.last_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      reset();
                    }}
                    className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#18314F] text-white rounded-lg hover:bg-[#18314F]/90 font-medium transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creando...' : 'Crear Supervisor'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Supervisors List */}
          <div>
            <h3 className="text-lg font-semibold text-[#18314F] mb-4">
              Supervisores Existentes ({supervisors.length})
            </h3>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18314F]"></div>
              </div>
            ) : supervisors.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-gray-500 text-lg">No hay supervisores para esta empresa</p>
                <p className="text-gray-400 text-sm mt-2">Crea el primer supervisor usando el botón de arriba</p>
              </div>
            ) : (
              <div className="space-y-3">
                {supervisors.map((supervisor) => (
                  <div
                    key={supervisor.id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-[#18314F] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#18314F]/10 flex items-center justify-center">
                          <span className="text-[#18314F] font-bold text-lg">
                            {supervisor.first_name[0]}{supervisor.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-[#18314F]">{supervisor.full_name}</div>
                          <div className="text-sm text-gray-600">{supervisor.email}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {supervisor.employee_count} empleados • Creado: {new Date(supervisor.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            supervisor.is_active ? 'bg-green-500' : 'bg-gray-300'
                          }`}></span>
                          <span className={`text-sm font-medium ${
                            supervisor.is_active ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {supervisor.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleToggleActive(supervisor.id, supervisor.is_active)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            supervisor.is_active 
                              ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          {supervisor.is_active ? 'Desactivar' : 'Activar'}
                        </button>

                        <button
                          onClick={() => handleDelete(supervisor.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-8 py-4 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-lg font-semibold transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
