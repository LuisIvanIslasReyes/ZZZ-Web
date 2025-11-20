/**
 * User Types
 * Interfaces y tipos relacionados con usuarios del sistema
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
  supervisor: number | null;
  department?: string;
  position?: string;
  phone?: string;
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
  company?: number | null;
  supervisor?: number | null;
  department?: string;
  position?: string;
  phone?: string;
}

export interface UpdateUserData {
  email?: string;
  first_name?: string;
  last_name?: string;
  company?: number | null;
  supervisor?: number | null;
  department?: string;
  position?: string;
  phone?: string;
  is_active?: boolean;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}
