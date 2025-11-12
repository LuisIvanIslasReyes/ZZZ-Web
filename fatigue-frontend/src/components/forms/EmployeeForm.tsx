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
  is_active: z.boolean().default(true),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  initialData?: Partial<EmployeeFormData>;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function EmployeeForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData,
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
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email *</span>
          </label>
          <input
            type="email"
            {...register('email')}
            className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
            placeholder="empleado@ejemplo.com"
            disabled={isLoading}
          />
          {errors.email && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.email.message}</span>
            </label>
          )}
        </div>

        {/* Password */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Contraseña {isEdit ? '(dejar vacío para no cambiar)' : '*'}
            </span>
          </label>
          <input
            type="password"
            {...register('password')}
            className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
            placeholder={isEdit ? '••••••••' : 'Mínimo 6 caracteres'}
            disabled={isLoading}
          />
          {errors.password && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.password.message}</span>
            </label>
          )}
        </div>

        {/* First Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nombre *</span>
          </label>
          <input
            type="text"
            {...register('first_name')}
            className={`input input-bordered ${errors.first_name ? 'input-error' : ''}`}
            placeholder="Juan"
            disabled={isLoading}
          />
          {errors.first_name && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.first_name.message}</span>
            </label>
          )}
        </div>

        {/* Last Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Apellido *</span>
          </label>
          <input
            type="text"
            {...register('last_name')}
            className={`input input-bordered ${errors.last_name ? 'input-error' : ''}`}
            placeholder="Pérez"
            disabled={isLoading}
          />
          {errors.last_name && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.last_name.message}</span>
            </label>
          )}
        </div>

        {/* Phone */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Teléfono</span>
          </label>
          <input
            type="tel"
            {...register('phone')}
            className="input input-bordered"
            placeholder="+52 123 456 7890"
            disabled={isLoading}
          />
        </div>

        {/* Department */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Departamento</span>
          </label>
          <select
            {...register('department')}
            className="select select-bordered"
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
        <div className="form-control">
          <label className="label">
            <span className="label-text">Puesto</span>
          </label>
          <input
            type="text"
            {...register('position')}
            className="input input-bordered"
            placeholder="Operador de máquina"
            disabled={isLoading}
          />
        </div>

        {/* Is Active */}
        {isEdit && (
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-4">
              <input
                type="checkbox"
                {...register('is_active')}
                className="checkbox checkbox-primary"
                disabled={isLoading}
              />
              <span className="label-text">Empleado activo</span>
            </label>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Guardando...
            </>
          ) : (
            <>{isEdit ? 'Actualizar' : 'Crear'} Empleado</>
          )}
        </button>
      </div>
    </form>
  );
}
