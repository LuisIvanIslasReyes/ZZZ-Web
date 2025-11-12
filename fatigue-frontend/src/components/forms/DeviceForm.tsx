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
  status: z.enum(['active', 'inactive', 'maintenance']).default('active'),
  battery_level: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

interface DeviceFormProps {
  initialData?: Partial<DeviceFormData>;
  onSubmit: (data: DeviceFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
}

export function DeviceForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isSubmitting = false,
}: DeviceFormProps) {
  const isEdit = !!initialData;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Device ID */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">ID Dispositivo *</span>
          </label>
          <input
            type="text"
            {...register('device_id')}
            className={`input input-bordered ${errors.device_id ? 'input-error' : ''}`}
            placeholder="ESP32-001"
            disabled={isLoading || isEdit}
          />
          {errors.device_id && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.device_id.message}</span>
            </label>
          )}
        </div>

        {/* Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nombre *</span>
          </label>
          <input
            type="text"
            {...register('name')}
            className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
            placeholder="Dispositivo Principal"
            disabled={isLoading}
          />
          {errors.name && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.name.message}</span>
            </label>
          )}
        </div>

        {/* Model */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Modelo</span>
          </label>
          <input
            type="text"
            {...register('model')}
            className="input input-bordered"
            placeholder="Mi Band 6"
            disabled={isLoading}
          />
        </div>

        {/* Manufacturer */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Fabricante</span>
          </label>
          <select
            {...register('manufacturer')}
            className="select select-bordered"
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
        <div className="form-control">
          <label className="label">
            <span className="label-text">Número de Serie</span>
          </label>
          <input
            type="text"
            {...register('serial_number')}
            className="input input-bordered"
            placeholder="SN123456789"
            disabled={isLoading}
          />
        </div>

        {/* Firmware Version */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Versión de Firmware</span>
          </label>
          <input
            type="text"
            {...register('firmware_version')}
            className="input input-bordered"
            placeholder="v1.2.3"
            disabled={isLoading}
          />
        </div>

        {/* Status */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Estado *</span>
          </label>
          <select
            {...register('status')}
            className="select select-bordered"
            disabled={isLoading}
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="maintenance">En Mantenimiento</option>
          </select>
        </div>

        {/* Battery Level */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nivel de Batería (%)</span>
          </label>
          <input
            type="number"
            {...register('battery_level', { valueAsNumber: true })}
            className="input input-bordered"
            placeholder="85"
            min="0"
            max="100"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Notas</span>
        </label>
        <textarea
          {...register('notes')}
          className="textarea textarea-bordered h-24"
          placeholder="Información adicional..."
          disabled={isLoading}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
          disabled={isLoading || isSubmitting}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading || isSubmitting}>
          {(isLoading || isSubmitting) ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Guardando...
            </>
          ) : (
            <>{isEdit ? 'Actualizar' : 'Crear'} Dispositivo</>
          )}
        </button>
      </div>
    </form>
  );
}
