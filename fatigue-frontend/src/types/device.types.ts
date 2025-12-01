/**
 * Device Types
 * Interfaces y tipos relacionados con dispositivos IoT
 * Basado en el modelo real del backend: device_identifier, employee, supervisor, is_active
 */

export interface Device {
  id: number;
  device_identifier: string;
  employee: number;
  employee_name?: string; // Nombre del empleado (incluido en respuestas expandidas)
  employee_email?: string;
  supervisor: number;
  supervisor_name?: string;
  is_active: boolean;
  last_connection: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDeviceData {
  device_identifier: string;
  employee: number;
  supervisor: number;
  is_active?: boolean;
}

export interface UpdateDeviceData {
  device_identifier?: string;
  employee?: number;
  supervisor?: number;
  is_active?: boolean;
}
