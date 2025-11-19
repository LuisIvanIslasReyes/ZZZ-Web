/**
 * Device Form Component
 * Formulario para crear y editar dispositivos
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const deviceSchema = z.object({
  device_id: z.string().min(3, 'El ID debe tener al menos 3 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
  serial_number: z.string().optional(),
  firmware_version: z.string().optional(),
  employee: z.number().optional(),
  status: z.enum(['active', 'inactive', 'maintenance']).optional(),
  battery_level: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

interface DeviceFormProps {
  initialData?: Partial<DeviceFormData>;
  onSubmit: (data: DeviceFormData) => Promise<void>;
  isLoading?: boolean;
  isSubmitting?: boolean;
  formId?: string;
}

export function DeviceForm({
  initialData,
  onSubmit,
  isLoading = false,
  isSubmitting = false,
  formId = 'device-form',
}: DeviceFormProps) {
  const isEdit = !!initialData;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      status: 'active',
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Dispositivo *
          </label>
          <input
            type="text"
            {...register('device_id')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white ${
              errors.device_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="ESP32-001"
            disabled={isLoading || isEdit}
          />
          {errors.device_id && (
            <p className="mt-1 text-sm text-red-600">{errors.device_id.message}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre *
          </label>
          <input
            type="text"
            {...register('name')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white ${
              errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Dispositivo Principal"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modelo
          </label>
          <input
            type="text"
            {...register('model')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
            placeholder="Mi Band 6"
            disabled={isLoading}
          />
        </div>

        {/* Manufacturer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fabricante
          </label>
          <select
            {...register('manufacturer')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
            disabled={isLoading}
          >
            <option value="">Seleccionar...</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Fitbit">Fitbit</option>
            <option value="Garmin">Garmin</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Serial Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Serie
          </label>
          <input
            type="text"
            {...register('serial_number')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
            placeholder="SN123456789"
            disabled={isLoading}
          />
        </div>

        {/* Firmware Version */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Versión de Firmware
          </label>
          <input
            type="text"
            {...register('firmware_version')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
            placeholder="v1.2.3"
            disabled={isLoading}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado *
          </label>
          <select
            {...register('status')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
            disabled={isLoading}
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="maintenance">En Mantenimiento</option>
          </select>
        </div>

        {/* Battery Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nivel de Batería (%)
          </label>
          <input
            type="number"
            {...register('battery_level', { valueAsNumber: true })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
            placeholder="85"
            min="0"
            max="100"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas
        </label>
        <textarea
          {...register('notes')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white h-24 resize-none"
          placeholder="Información adicional..."
          disabled={isLoading}
        />
      </div>
    </form>
  );
}
