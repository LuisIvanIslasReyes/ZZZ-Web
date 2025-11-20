# FASE 2: TYPES Y CONFIGURACIÓN DE API
**Duración:** 2-3 días  
**Prioridad:** 🔴 Crítica  
**Prerequisito:** FASE 1 completada

---

## 📋 Objetivos de la Fase

- Definir todos los TypeScript types alineados con el backend
- Configurar Axios con interceptors
- Crear servicio base de API
- Implementar manejo de errores centralizado
- Preparar infraestructura para autenticación JWT

---

## ✅ Tareas Detalladas

### 2.1 Definir Types de Usuario

**Crear `src/types/user.types.ts`:**

```typescript
/**
 * Types para usuarios del sistema
 * Alineados con apps/users/models.py del backend
 */

export type UserRole = 'admin' | 'supervisor' | 'employee';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
  
  // Relaciones (opcionales)
  supervisor?: number | null; // ID del supervisor (solo para employees)
  admin?: number | null; // ID del admin (solo para supervisors)
}

export interface Admin extends User {
  role: 'admin';
}

export interface Supervisor extends User {
  role: 'supervisor';
  admin?: number;
  employee_count?: number; // Calculado en el backend
}

export interface Employee extends User {
  role: 'employee';
  supervisor?: number;
  device?: number; // ID del dispositivo asignado
}

// DTOs para creación/actualización
export interface CreateUserDTO {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

export interface UpdateUserDTO {
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
}

export interface ChangePasswordDTO {
  old_password: string;
  new_password: string;
  new_password2: string;
}

// Responses de autenticación
export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface TokenRefreshResponse {
  access: string;
}
```

### 2.2 Definir Types de Dispositivos

**Crear `src/types/device.types.ts`:**

```typescript
/**
 * Types para dispositivos IoT
 * Alineados con apps/devices/models.py del backend
 */

export interface Device {
  id: number;
  device_identifier: string;
  employee: number; // ID del empleado
  employee_name?: string; // Computed en el backend
  supervisor: number; // ID del supervisor
  supervisor_name?: string; // Computed en el backend
  is_active: boolean;
  last_connection: string | null;
  battery_level: number | null;
  signal_strength: number | null;
  firmware_version: string | null;
  calibration_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDeviceDTO {
  device_identifier: string;
  employee: number;
  is_active?: boolean;
  notes?: string;
}

export interface UpdateDeviceDTO {
  device_identifier?: string;
  employee?: number;
  is_active?: boolean;
  battery_level?: number;
  signal_strength?: number;
  firmware_version?: string;
  calibration_date?: string;
  notes?: string;
}

export interface DeviceStatus {
  is_active: boolean;
  is_connected: boolean;
  battery_level: number | null;
  signal_strength: number | null;
  last_connection: string | null;
  status: 'online' | 'offline' | 'low_battery' | 'needs_calibration';
}
```

### 2.3 Definir Types de Métricas

**Crear `src/types/metrics.types.ts`:**

```typescript
/**
 * Types para datos de sensores y métricas
 * Alineados con apps/sensors/models.py del backend
 */

// Datos crudos de sensores (raramente usado en frontend)
export interface SensorData {
  id: number;
  device: number;
  timestamp: string;
  heart_rate: number;
  spo2: number;
  temperature: number;
  accel_x: number;
  accel_y: number;
  accel_z: number;
  created_at: string;
}

// Métricas procesadas (PRINCIPAL para el frontend)
export interface ProcessedMetrics {
  id: number;
  device: number;
  employee: number;
  employee_name?: string;
  window_start: string;
  window_end: string;
  
  // Heart Rate metrics
  hr_avg: number;
  hr_max: number;
  hr_min: number;
  hrv_rmssd: number | null;
  hrv_sdnn: number | null;
  hr_trend: 'stable' | 'increasing' | 'decreasing';
  
  // SpO2 metrics
  spo2_avg: number;
  spo2_min: number;
  spo2_variance: number;
  desaturation_count: number;
  
  // Temperature metrics
  temp_avg: number;
  temp_max: number;
  temp_min: number;
  
  // Movement metrics
  activity_level: number;
  movement_variance: number;
  movement_entropy: number | null;
  posture_angle: number | null;
  
  // Combined features
  fatigue_index: number; // 0-100, calculado por ML
  hr_activity_ratio: number;
  recovery_time: number | null;
  
  created_at: string;
}

// Response de endpoints de histórico
export interface MetricsHistory {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProcessedMetrics[];
}

// Estadísticas de métricas
export interface MetricsStatistics {
  avg_fatigue: number;
  max_fatigue: number;
  min_fatigue: number;
  avg_heart_rate: number;
  avg_spo2: number;
  total_alerts: number;
  time_in_high_fatigue: number; // minutos
  data_points: number;
}

// Para tiempo real (polling)
export interface RealtimeMetrics {
  employee_id: number;
  employee_name: string;
  current_fatigue: number;
  current_hr: number;
  current_spo2: number;
  activity_level: number;
  last_update: string;
  status: 'normal' | 'warning' | 'danger' | 'critical';
  trend: 'improving' | 'stable' | 'worsening';
}
```

### 2.4 Definir Types de Alertas

**Crear `src/types/alert.types.ts`:**

```typescript
/**
 * Types para sistema de alertas
 * Alineados con apps/analytics/models.py del backend
 */

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export type AlertType = 
  | 'high_fatigue'
  | 'low_spo2'
  | 'high_hr'
  | 'inactivity'
  | 'slow_recovery'
  | 'abnormal_temperature'
  | 'device_offline';

export interface FatigueAlert {
  id: number;
  employee: number;
  employee_name?: string;
  supervisor: number;
  supervisor_name?: string;
  timestamp: string;
  severity: AlertSeverity;
  alert_type: AlertType;
  message: string;
  fatigue_index: number;
  heart_rate: number | null;
  spo2: number | null;
  temperature: number | null;
  is_resolved: boolean;
  resolved_at: string | null;
  resolved_by: number | null;
  resolved_by_name?: string;
  resolution_notes: string | null;
  created_at: string;
  
  // Computed fields
  time_to_resolve?: string | null; // "2h 15m"
  is_active?: boolean;
}

export interface CreateAlertDTO {
  employee: number;
  severity: AlertSeverity;
  alert_type: AlertType;
  message: string;
  fatigue_index: number;
  heart_rate?: number;
  spo2?: number;
  temperature?: number;
}

export interface ResolveAlertDTO {
  resolution_notes?: string;
}

export interface AlertStatistics {
  total: number;
  active: number;
  resolved: number;
  by_severity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  avg_resolution_time_minutes: number | null;
  resolution_rate: number; // percentage
}

export interface AlertFilters {
  is_resolved?: boolean;
  severity?: AlertSeverity;
  alert_type?: AlertType;
  employee?: number;
  date_from?: string;
  date_to?: string;
}
```

### 2.5 Definir Types de Recomendaciones

**Crear `src/types/recommendation.types.ts`:**

```typescript
/**
 * Types para sistema de recomendaciones
 * Alineados con apps/analytics/models.py del backend
 */

export type RecommendationType = 
  | 'break'
  | 'task_redistribution'
  | 'shift_rotation'
  | 'work_pace_adjustment'
  | 'environment_change';

export interface RoutineRecommendation {
  id: number;
  supervisor: number;
  supervisor_name?: string;
  employee: number;
  employee_name?: string;
  recommendation_type: RecommendationType;
  description: string;
  priority: number; // 1-5, 5 = highest
  based_on_data: Record<string, any>; // JSON con métricas
  is_applied: boolean;
  applied_at: string | null;
  applied_by: number | null;
  applied_by_name?: string;
  application_notes: string | null;
  effectiveness_score: number | null; // 0-100
  created_at: string;
  
  // Computed fields
  time_to_apply?: string | null; // "1d 3h"
  status?: 'pending' | 'applied' | 'expired';
}

export interface CreateRecommendationDTO {
  employee: number;
  recommendation_type: RecommendationType;
  description: string;
  priority: number;
  based_on_data?: Record<string, any>;
}

export interface ApplyRecommendationDTO {
  application_notes?: string;
}

export interface RecommendationStatistics {
  total: number;
  pending: number;
  applied: number;
  by_type: Record<RecommendationType, number>;
  avg_application_time_hours: number | null;
  avg_effectiveness_score: number | null;
  application_rate: number; // percentage
}

export interface RecommendationFilters {
  is_applied?: boolean;
  priority?: number;
  recommendation_type?: RecommendationType;
  employee?: number;
  date_from?: string;
  date_to?: string;
}
```

### 2.6 Definir Types de Dashboard

**Crear `src/types/dashboard.types.ts`:**

```typescript
/**
 * Types para dashboards y estadísticas
 */

export interface OverviewStats {
  total_employees: number;
  active_employees: number;
  total_devices: number;
  active_devices: number;
  total_alerts: number;
  active_alerts: number;
  avg_fatigue: number;
  system_health: 'excellent' | 'good' | 'warning' | 'critical';
}

export interface EmployeeDashboard {
  employee: Employee;
  current_metrics: ProcessedMetrics | null;
  today_stats: {
    avg_fatigue: number;
    max_fatigue: number;
    avg_heart_rate: number;
    min_spo2: number;
    time_in_high_fatigue: number;
    alerts_count: number;
  };
  recent_alerts: FatigueAlert[];
  recommendations: RoutineRecommendation[];
}

export interface SupervisorDashboard {
  supervisor: Supervisor;
  team_summary: {
    total_employees: number;
    active_employees: number;
    avg_team_fatigue: number;
    employees_in_danger: number;
    active_alerts: number;
    pending_recommendations: number;
  };
  employees_status: Array<{
    employee: Employee;
    current_fatigue: number;
    status: 'normal' | 'warning' | 'danger' | 'critical';
    last_update: string;
    device_status: 'online' | 'offline';
  }>;
  recent_alerts: FatigueAlert[];
  pending_recommendations: RoutineRecommendation[];
}

export interface AdminDashboard {
  system_overview: OverviewStats;
  supervisors_summary: Array<{
    supervisor: Supervisor;
    employee_count: number;
    active_alerts: number;
    avg_team_fatigue: number;
  }>;
  recent_alerts: FatigueAlert[];
  system_trends: {
    fatigue_trend: 'improving' | 'stable' | 'worsening';
    alert_trend: 'decreasing' | 'stable' | 'increasing';
  };
}
```

### 2.7 Configuración Base de Axios

**Crear `src/services/api.ts`:**

```typescript
/**
 * Configuración base de Axios para comunicación con el backend
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

// Crear instancia de Axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Agregar token JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Manejar errores y refresh de token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si es error 401 y no es el endpoint de login/refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/login/') || 
          originalRequest.url?.includes('/auth/refresh/')) {
        // No intentar refresh en login/refresh
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Intentar refresh del token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Reintentar request original con nuevo token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Si refresh falla, limpiar storage y redirigir a login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper para manejar errores de API
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Error del servidor
      const data = error.response.data;
      if (typeof data === 'string') {
        return data;
      }
      if (data.detail) {
        return data.detail;
      }
      if (data.message) {
        return data.message;
      }
      // Si hay errores de validación
      if (typeof data === 'object') {
        const messages = Object.entries(data)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        return messages || 'Error en la solicitud';
      }
      return 'Error en el servidor';
    } else if (error.request) {
      // Request fue hecho pero no hay respuesta
      return 'No se pudo conectar con el servidor';
    } else {
      // Error al configurar el request
      return error.message;
    }
  }
  return 'Error desconocido';
};

export default api;
```

### 2.8 Crear Types de API Responses

**Crear `src/types/api.types.ts`:**

```typescript
/**
 * Types genéricos para responses de la API
 */

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: any;
}

export interface SuccessResponse {
  message: string;
  success: boolean;
}
```

---

## 📝 Checklist de Completitud

- [ ] `user.types.ts` creado con todos los types de usuario
- [ ] `device.types.ts` creado con types de dispositivos
- [ ] `metrics.types.ts` creado con types de métricas y sensores
- [ ] `alert.types.ts` creado con types de alertas
- [ ] `recommendation.types.ts` creado con types de recomendaciones
- [ ] `dashboard.types.ts` creado con types de dashboards
- [ ] `api.types.ts` creado con types genéricos
- [ ] `api.ts` creado con configuración de Axios
- [ ] Interceptors de request configurados (auto-inject token)
- [ ] Interceptors de response configurados (auto-refresh token)
- [ ] Helper `handleApiError` implementado
- [ ] Todos los types compilando sin errores TypeScript

---

## 🧪 Verificación

**Crear archivo de prueba `src/test-types.ts`:**

```typescript
import type { User, Employee } from '@types/user.types';
import type { ProcessedMetrics } from '@types/metrics.types';
import type { FatigueAlert } from '@types/alert.types';

// Verificar que los types compilan correctamente
const testUser: User = {
  id: 1,
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  role: 'employee',
  is_active: true,
  is_staff: false,
  is_superuser: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

console.log('Types verificados correctamente');
```

**Ejecutar verificación:**
```bash
npm run build
```

No debe haber errores de TypeScript.

---

## 🎯 Resultado Esperado

Al finalizar esta fase debes tener:

✅ Todos los TypeScript types definidos y alineados con el backend  
✅ Axios configurado con interceptors para JWT  
✅ Auto-refresh de tokens implementado  
✅ Manejo centralizado de errores  
✅ Infraestructura lista para crear services  

---

## 🚀 Siguiente Fase

**FASE 3: Services Layer - API Integration**

