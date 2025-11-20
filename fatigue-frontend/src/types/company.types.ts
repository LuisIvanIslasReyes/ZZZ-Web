// types/company.types.ts
export interface Company {
  id: number;
  name: string;
  contact_email: string;
  contact_phone: string | null;
  address: string | null;
  is_active: boolean;
  subscription_start: string;
  subscription_end: string | null;
  max_employees: number;
  employee_count: number;
  supervisor_count: number;
  is_subscription_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyDetail extends Company {
  supervisors: {
    id: number;
    email: string;
    full_name: string;
    is_active: boolean;
  }[];
}

export interface CompanyStats {
  id: number;
  name: string;
  employee_count: number;
  supervisor_count: number;
  active_devices: number;
  active_alerts: number;
  avg_fatigue_index: number;
  is_subscription_active: boolean;
  subscription_end: string | null;
}

export interface CompanyGlobalStats {
  total_companies: number;
  active_companies: number;
  total_supervisors: number;
  total_employees: number;
}

export interface CompanyCreateInput {
  name: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  is_active?: boolean;
  subscription_start?: string;
  subscription_end?: string | null;
  max_employees?: number;
}

export interface CompanyUpdateInput {
  name?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  is_active?: boolean;
  subscription_start?: string;
  subscription_end?: string | null;
  max_employees?: number;
}
