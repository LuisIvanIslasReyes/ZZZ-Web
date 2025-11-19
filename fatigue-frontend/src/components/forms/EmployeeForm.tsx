/**
 * Employee Form Component
 * Formulario para crear y editar empleados
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const employeeSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional().or(z.literal('')),
  first_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  last_name: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  supervisor: z.number().optional(),
  is_active: z.boolean().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  initialData?: Partial<EmployeeFormData>;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  isLoading?: boolean;
  isEdit?: boolean;
  formId?: string;
}

export function EmployeeForm({
  initialData,
  onSubmit,
  isLoading = false,
  isEdit = false,
  formId = 'employee-form',
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      is_active: true,
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onFormSubmit = async (data: EmployeeFormData) => {
    // Si es edición y no hay password, eliminarlo del objeto
    if (isEdit && !data.password) {
      const { password, ...dataWithoutPassword } = data;
      await onSubmit(dataWithoutPassword as EmployeeFormData);
    } else {
      await onSubmit(data);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
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
            placeholder="empleado@ejemplo.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña {isEdit ? <span className="text-gray-500 font-normal">(dejar vacío para no cambiar)</span> : <span className="text-red-500">*</span>}
          </label>
          <input
            type="password"
            {...register('password')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent transition-all ${
              errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
            }`}
            placeholder={isEdit ? '••••••••' : 'Mínimo 6 caracteres'}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
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
          <select
            {...register('department')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white transition-all appearance-none cursor-pointer"
            disabled={isLoading}
          >
            <option value="">Seleccionar...</option>
            <option value="IT">IT</option>
            <option value="Operaciones">Operaciones</option>
            <option value="Recursos Humanos">Recursos Humanos</option>
            <option value="Producción">Producción</option>
            <option value="Logística">Logística</option>
            <option value="Mantenimiento">Mantenimiento</option>
          </select>
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Puesto
          </label>
          <input
            type="text"
            {...register('position')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white transition-all"
            placeholder="Operador de máquina"
            disabled={isLoading}
          />
        </div>

        {/* Is Active */}
        {isEdit && (
          <div className="flex items-center pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                {...register('is_active')}
                className="w-5 h-5 text-[#18314F] border-gray-300 rounded focus:ring-2 focus:ring-[#18314F]"
                disabled={isLoading}
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#18314F] transition-colors">
                Empleado activo
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Actions - No los incluimos aquí porque se manejan en el footer del modal */}
    </form>
  );
}
