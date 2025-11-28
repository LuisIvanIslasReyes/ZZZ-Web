/**
 * Device Form Modal Component
 * Modal para crear y asignar dispositivos (usado por supervisores)
 */

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { employeeService } from '../../services';
import type { Device, Employee } from '../../types';

const deviceSchema = z.object({
  device_identifier: z.string().min(3, 'El ID debe tener al menos 3 caracteres'),
  employee: z.coerce.number().refine(val => val > 0, {
    message: 'Debe seleccionar un empleado válido',
  }),
  is_active: z.boolean().optional(),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

interface DeviceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DeviceFormData) => Promise<void>;
  initialData?: Device | null;
  isLoading?: boolean;
}

export function DeviceFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: DeviceFormModalProps) {
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
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadEmployees();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      reset({
        device_identifier: initialData.device_identifier,
        employee: initialData.employee,
        is_active: initialData.is_active,
      });
    } else {
      reset({
        device_identifier: '',
        employee: undefined as any,
        is_active: true,
      });
    }
  }, [initialData, reset]);

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

  const onFormSubmit = async (data: DeviceFormData) => {
    // Encontrar el empleado seleccionado para obtener su supervisor
    const selectedEmployee = employees.find(emp => emp.id === Number(data.employee));
    
    if (!selectedEmployee) {
      console.error('No se encontró el empleado seleccionado');
      return;
    }

    // Asegurar que employee es un número válido y agregar supervisor
    const cleanData = {
      device_identifier: data.device_identifier.trim(),
      employee: Number(data.employee),
      supervisor: selectedEmployee.supervisor, // El supervisor del empleado
      is_active: data.is_active ?? true,
    };
    
    console.log('Datos de dispositivo a enviar:', cleanData);
    await onSubmit(cleanData);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#18314F] text-white px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {isEdit ? 'Editar Dispositivo' : 'Nuevo Dispositivo'}
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
            {isEdit ? 'Actualiza la información del dispositivo' : 'Asigna un nuevo dispositivo a un empleado'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="px-8 py-6">
          <div className="space-y-6">
            {/* Información del Dispositivo */}
            <div>
              <h3 className="text-lg font-semibold text-[#18314F] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Información del Dispositivo
              </h3>

              <div className="space-y-6">
                {/* Device Identifier */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Identificador de Dispositivo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('device_identifier')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent transition-all ${
                      errors.device_identifier ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="ESP32-001"
                    disabled={isLoading || isEdit}
                  />
                  {errors.device_identifier && (
                    <p className="mt-1 text-sm text-red-600">{errors.device_identifier.message}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    {isEdit 
                      ? 'El identificador del dispositivo no se puede cambiar'
                      : 'Identificador único del dispositivo (ej: ESP32-001, SENSOR-042)'}
                  </p>
                </div>

                {/* Employee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empleado Asignado <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('employee', { valueAsNumber: true })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent transition-all ${
                      errors.employee ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    disabled={isLoading || loadingEmployees}
                  >
                    <option value="">Seleccionar empleado</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.first_name} {emp.last_name} - {emp.email}
                      </option>
                    ))}
                  </select>
                  {errors.employee && (
                    <p className="mt-1 text-sm text-red-600">{errors.employee.message}</p>
                  )}
                  {loadingEmployees && (
                    <p className="mt-1 text-sm text-blue-600">Cargando empleados...</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    Cada empleado puede tener solo un dispositivo asignado
                  </p>
                </div>

                {/* Is Active */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('is_active')}
                      className="w-5 h-5 text-[#18314F] focus:ring-[#18314F] border-gray-300 rounded"
                      disabled={isLoading}
                    />
                    <span className="text-sm font-medium text-gray-700">Dispositivo activo y en uso</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-2">💡 Información importante:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Cada empleado solo puede tener un dispositivo asignado</li>
                    <li>El supervisor se asignará automáticamente según el empleado</li>
                    {!isEdit && <li>El identificador del dispositivo no se puede cambiar después de crearlo</li>}
                  </ul>
                </div>
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
              disabled={isLoading || loadingEmployees}
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
                  {isEdit ? 'Actualizar Dispositivo' : 'Crear Dispositivo'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
