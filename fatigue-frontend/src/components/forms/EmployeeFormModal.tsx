/**
 * Employee Form Modal Component
 * Modal para crear y editar empleados (usado por supervisores)
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts';
import type { Employee } from '../../types';

const employeeSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().optional().or(z.literal('')),
  first_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  last_name: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  is_active: z.boolean().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  initialData?: Employee | null;
  isLoading?: boolean;
}

export function EmployeeFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: EmployeeFormModalProps) {
  const isEdit = !!initialData;
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      is_active: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        email: initialData.email,
        first_name: initialData.first_name,
        last_name: initialData.last_name,
        phone: initialData.phone || '',
        department: initialData.department || '',
        position: initialData.position || '',
        is_active: initialData.is_active,
        password: '',
      });
    } else {
      reset({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        department: '',
        position: '',
        is_active: true,
        password: '',
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = async (data: EmployeeFormData) => {
    // Validar password para creación
    if (!isEdit && (!data.password || data.password.length < 8)) {
      setError('password', {
        type: 'manual',
        message: 'La contraseña es requerida y debe tener al menos 8 caracteres',
      });
      return;
    }

    // Si es edición y no hay password, eliminarlo del objeto
    if (isEdit && !data.password) {
      const { password, ...dataWithoutPassword } = data;
      await onSubmit(dataWithoutPassword as EmployeeFormData);
    } else {
      await onSubmit(data);
    }
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#18314F] text-white px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {isEdit ? 'Editar Empleado' : 'Nuevo Empleado'}
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-300 transition-colors"
              disabled={isLoading}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-white/80 mt-2">
            {isEdit ? 'Actualiza la información del empleado' : 'Registra un nuevo empleado en tu equipo'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="px-8 py-6">
          <div className="space-y-6">
            {/* Información de Empresa */}
            {user?.company_name && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 rounded-lg p-2">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Empresa</p>
                    <p className="text-base font-bold text-blue-700">{user.company_name}</p>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">Este empleado será asignado automáticamente a tu empresa</p>
              </div>
            )}

            {/* Información Personal */}
            <div>
              <h3 className="text-lg font-semibold text-[#18314F] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent transition-all ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="empleado@empresa.com"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña {!isEdit && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    {...register('password')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent transition-all ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder={isEdit ? 'Dejar en blanco para no cambiar' : 'Mínimo 8 caracteres'}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                  {isEdit ? (
                    <p className="mt-1 text-sm text-gray-500">Dejar en blanco para mantener la contraseña actual</p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">La contraseña debe tener al menos 8 caracteres</p>
                  )}
                </div>

                {/* First Name */}
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
                    disabled={isLoading}
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                  )}
                </div>

                {/* Last Name */}
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
                    disabled={isLoading}
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white transition-all"
                    placeholder="+52 123 456 7890"
                    disabled={isLoading}
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento
                  </label>
                  <input
                    type="text"
                    {...register('department')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white transition-all"
                    placeholder="Producción"
                    disabled={isLoading}
                  />
                </div>

                {/* Position */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Posición/Cargo
                  </label>
                  <input
                    type="text"
                    {...register('position')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white transition-all"
                    placeholder="Operador de maquinaria"
                    disabled={isLoading}
                  />
                </div>

                {/* Is Active */}
                {isEdit && (
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('is_active')}
                        className="w-5 h-5 text-[#18314F] focus:ring-[#18314F] border-gray-300 rounded"
                        disabled={isLoading}
                      />
                      <span className="text-sm font-medium text-gray-700">Empleado activo</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer con acciones */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#18314F] text-white rounded-lg hover:bg-[#18314F]/90 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEdit ? 'Actualizar Empleado' : 'Crear Empleado'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
