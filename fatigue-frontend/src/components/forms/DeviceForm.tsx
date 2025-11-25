/**
 * Device Form Component
 * Formulario para crear y editar dispositivos
 */

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { employeeService } from '../../services';
import type { Employee } from '../../types';

const deviceSchema = z.object({
  device_identifier: z.string().min(3, 'El ID debe tener al menos 3 caracteres'),
  employee: z.number().min(1, 'Debe seleccionar un empleado'),
  is_active: z.boolean().optional(),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

interface DeviceFormProps {
  initialData?: Partial<DeviceFormData>;
  onSubmit: (data: DeviceFormData) => Promise<void>;
  isLoading?: boolean;
  formId?: string;
}

export function DeviceForm({
  initialData,
  onSubmit,
  isLoading = false,
  formId = 'device-form',
}: DeviceFormProps) {
  const isEdit = !!initialData;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
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

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Device Identifier */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Identificador de Dispositivo *
          </label>
          <input
            type="text"
            {...register('device_identifier')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white ${
              errors.device_identifier ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="ESP32-001"
            disabled={isLoading || isEdit}
          />
          {errors.device_identifier && (
            <p className="mt-1 text-sm text-red-600">{errors.device_identifier.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Identificador único del dispositivo (ej: ESP32-001)
          </p>
        </div>

        {/* Employee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Empleado *
          </label>
          <select
            {...register('employee', { valueAsNumber: true })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white ${
              errors.employee ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            disabled={isLoading || loadingEmployees || isEdit}
          >
            <option value="">Seleccionar empleado</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.first_name} {emp.last_name} ({emp.email})
              </option>
            ))}
          </select>
          {errors.employee && (
            <p className="mt-1 text-sm text-red-600">{errors.employee.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Cada empleado puede tener solo un dispositivo asignado
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Is Active */}
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('is_active')}
            id="is_active"
            className="w-5 h-5 accent-[#18314F] border-[#18314F] focus:ring-2 focus:ring-[#18314F] rounded transition-colors"
            disabled={isLoading}
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
            Dispositivo activo y en uso
          </label>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Información importante:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Cada empleado solo puede tener un dispositivo asignado</li>
                <li>El supervisor se asignará automáticamente según el empleado</li>
                <li>El identificador del dispositivo no se puede cambiar después de crearlo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
