/**
 * User Types
 * Interfaces y tipos relacionados con usuarios del sistema
 * NOTA: Los supervisores ahora representan empresas (1 supervisor = 1 empresa)
 */

export type UserRole = 'admin' | 'supervisor' | 'employee';

export const UserRole = {
  ADMIN: 'admin' as const,
  SUPERVISOR: 'supervisor' as const,
  EMPLOYEE: 'employee' as const
};

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole;
  role_display: string;
  company: number | null;
  company_name: string | null;
  supervisor: number | null; // Solo para empleados, asignado automáticamente
  department?: string;
  position?: string;
  phone?: string;
  avatar?: string | null; // Ruta relativa de la imagen
  avatar_url?: string | null; // URL completa para mostrar
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  password_confirm?: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  company?: number | null; // Requerido para supervisors y employees
  // supervisor se asigna automáticamente para employees
  department?: string;
  position?: string;
  phone?: string;
}

export interface UpdateUserData {
  email?: string;
  first_name?: string;
  last_name?: string;
  company?: number | null;
  // supervisor no se actualiza manualmente
  department?: string;
  position?: string;
  phone?: string;
  is_active?: boolean;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

// Admin User Types
export interface AdminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAdminUserData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface UpdateAdminUserData {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
}
