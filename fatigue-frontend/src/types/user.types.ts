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
  role: UserRole;
  department?: string;
  phone_number?: string;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  department?: string;
  phone_number?: string;
}

export interface UpdateUserData {
  email?: string;
  first_name?: string;
  last_name?: string;
  department?: string;
  phone_number?: string;
  is_active?: boolean;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}
