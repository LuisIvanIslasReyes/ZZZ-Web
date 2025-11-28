/**
 * Employee Types
 * Interfaces para empleados (users con rol employee)
 * NOTA: Los supervisores ahora son la empresa. El campo supervisor se asigna automáticamente.
 */

export interface Employee {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string; // Nombre completo
  employee_id: string; // Se puede construir como `EMP-${id}`
  role: 'employee';
  supervisor?: number; // ID del supervisor (asignado automáticamente por empresa)
  supervisor_name?: string;
  phone?: string;
  department?: string;
  position?: string;
  hire_date: string;
  is_active: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEmployeeData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  // supervisor se asigna automáticamente según la empresa del supervisor que crea el empleado
  phone?: string;
  department?: string;
  position?: string;
}

export interface UpdateEmployeeData {
  email?: string;
  first_name?: string;
  last_name?: string;
  // supervisor no se puede cambiar manualmente
  phone?: string;
  department?: string;
  position?: string;
  is_active?: boolean;
}
