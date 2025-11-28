/**
 * Company Form Modal Component
 * Modal para crear y editar empresas (clientes)
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Company, CompanyCreateInput, CompanyUpdateInput } from '../../types';

const companySchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  contact_email: z.string().email('Email inválido'),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  max_employees: z.number().min(1, 'Debe permitir al menos 1 empleado').max(10000, 'Máximo 10,000 empleados'),
  subscription_start: z.string().optional(),
  subscription_end: z.string().optional(),
  // Datos del supervisor (solo al crear)
  supervisor_email: z.string().email('Email inválido').optional(),
  supervisor_password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
  supervisor_first_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  supervisor_last_name: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyCreateInput | CompanyUpdateInput) => Promise<void>;
  initialData?: Company | null;
  isLoading?: boolean;
}

export function CompanyFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: CompanyFormModalProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      max_employees: 100,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        contact_email: initialData.contact_email,
        contact_phone: initialData.contact_phone || '',
        address: initialData.address || '',
        max_employees: initialData.max_employees,
        subscription_start: initialData.subscription_start || '',
        subscription_end: initialData.subscription_end || '',
      });
    } else {
      reset({
        name: '',
        contact_email: '',
        contact_phone: '',
        address: '',
        max_employees: 100,
        subscription_start: '',
        subscription_end: '',
      });
    }
  }, [initialData, reset]);

  const cleanData = (data: CompanyFormData) => {
    // Limpiar datos: convertir strings vacíos a null o undefined
    const cleaned: any = {
      name: data.name,
      contact_email: data.contact_email,
      max_employees: data.max_employees,
    };

    // Solo agregar campos opcionales si tienen valor
    if (data.contact_phone && data.contact_phone.trim() !== '') {
      cleaned.contact_phone = data.contact_phone;
    }
    if (data.address && data.address.trim() !== '') {
      cleaned.address = data.address;
    }
    if (data.subscription_start && data.subscription_start.trim() !== '') {
      cleaned.subscription_start = data.subscription_start;
    }
    if (data.subscription_end && data.subscription_end.trim() !== '') {
      cleaned.subscription_end = data.subscription_end;
    }

    // Para crear empresa, agregar datos del supervisor si existen
    if (!isEdit) {
      if (data.supervisor_email && data.supervisor_email.trim() !== '') {
        cleaned.supervisor_email = data.supervisor_email;
      }
      if (data.supervisor_password && data.supervisor_password.trim() !== '') {
        cleaned.supervisor_password = data.supervisor_password;
      }
      if (data.supervisor_first_name && data.supervisor_first_name.trim() !== '') {
        cleaned.supervisor_first_name = data.supervisor_first_name;
      }
      if (data.supervisor_last_name && data.supervisor_last_name.trim() !== '') {
        cleaned.supervisor_last_name = data.supervisor_last_name;
      }
    }

    return cleaned;
  };

  const onFormSubmit = async (data: CompanyFormData) => {
    const cleanedData = cleanData(data);
    console.log('Datos enviados al crear/editar empresa:', cleanedData);
    await onSubmit(cleanedData);
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
              {isEdit ? 'Editar Empresa' : 'Nueva Empresa'}
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
            {isEdit ? 'Actualiza los datos de la empresa cliente' : 'Registra una nueva empresa cliente en el sistema'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="px-8 py-6">
          <div className="space-y-6">
            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-semibold text-[#18314F] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Información Básica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Empresa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent transition-all ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Acme Corp."
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Email de Contacto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de Contacto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('contact_email')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent transition-all ${
                      errors.contact_email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="contacto@empresa.com"
                    disabled={isLoading}
                  />
                  {errors.contact_email && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact_email.message}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="tel"
                    {...register('contact_phone')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white transition-all"
                    placeholder="+52 123 456 7890"
                    disabled={isLoading}
                  />
                </div>

                {/* Dirección */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <textarea
                    {...register('address')}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white transition-all resize-none"
                    placeholder="Calle Principal #123, Colonia Centro, Ciudad"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Configuración de Suscripción */}
            <div>
              <h3 className="text-lg font-semibold text-[#18314F] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Configuración de Suscripción
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Máximo de Empleados */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de Empleados <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('max_employees', { valueAsNumber: true })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent transition-all ${
                      errors.max_employees ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="100"
                    min="1"
                    max="10000"
                    disabled={isLoading}
                  />
                  {errors.max_employees && (
                    <p className="mt-1 text-sm text-red-600">{errors.max_employees.message}</p>
                  )}
                </div>

                {/* Fecha de Inicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    {...register('subscription_start')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white transition-all"
                    disabled={isLoading}
                  />
                </div>

                {/* Fecha de Fin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    {...register('subscription_end')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                💡 Define el límite de empleados permitidos y el período de validez de la suscripción
              </p>
            </div>

            {/* Cuenta del Supervisor (solo al crear) */}
            {!isEdit && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#18314F] mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Cuenta del Supervisor
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Crea la cuenta de acceso para el supervisor de esta empresa (1 supervisor por empresa)
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email del Supervisor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email del Supervisor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('supervisor_email')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent transition-all ${
                        errors.supervisor_email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="supervisor@empresa.com"
                      disabled={isLoading}
                    />
                    {errors.supervisor_email && (
                      <p className="mt-1 text-sm text-red-600">{errors.supervisor_email.message}</p>
                    )}
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      {...register('supervisor_password')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent transition-all ${
                        errors.supervisor_password ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="Mínimo 6 caracteres"
                      disabled={isLoading}
                    />
                    {errors.supervisor_password && (
                      <p className="mt-1 text-sm text-red-600">{errors.supervisor_password.message}</p>
                    )}
                  </div>

                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('supervisor_first_name')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent transition-all ${
                        errors.supervisor_first_name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="Juan"
                      disabled={isLoading}
                    />
                    {errors.supervisor_first_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.supervisor_first_name.message}</p>
                    )}
                  </div>

                  {/* Apellido */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('supervisor_last_name')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent transition-all ${
                        errors.supervisor_last_name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      placeholder="Pérez"
                      disabled={isLoading}
                    />
                    {errors.supervisor_last_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.supervisor_last_name.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
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
                  {isEdit ? 'Actualizar Empresa' : 'Crear Empresa'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
