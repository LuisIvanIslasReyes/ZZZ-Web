/**
 * Device Types
 * Interfaces y tipos relacionados con dispositivos IoT
 */

export type DeviceStatus = 'active' | 'inactive' | 'maintenance';

export const DeviceStatus = {
  ACTIVE: 'active' as const,
  INACTIVE: 'inactive' as const,
  MAINTENANCE: 'maintenance' as const
};

export interface Device {
  id: number;
  device_id: string; // device_identifier en backend
  device_identifier?: string; // Alias
  name: string;
  model?: string; // Campos adicionales para UI
  manufacturer?: string;
  serial_number?: string;
  firmware_version?: string;
  purchase_date?: string;
  employee?: number; // ID del empleado
  employee_name?: string; // Nombre del empleado (incluido en respuestas expandidas)
  assigned_to?: number; // Alias de employee
  assigned_to_name?: string; // Alias de employee_name
  supervisor?: number; // ID del supervisor
  status: DeviceStatus;
  is_active?: boolean;
  battery_level?: number;
  last_sync?: string;
  last_connection?: string; // Alias para last_sync
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDeviceData {
  device_id: string;
  name: string;
  employee: number;
  status?: DeviceStatus;
}

export interface UpdateDeviceData {
  name?: string;
  employee?: number;
  status?: DeviceStatus;
  battery_level?: number;
}
