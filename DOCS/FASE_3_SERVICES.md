# FASE 3: SERVICES LAYER - INTEGRACIÓN CON API
**Duración:** 2-3 días  
**Prioridad:** 🔴 Crítica  
**Prerequisito:** FASE 2 completada

---

## 📋 Objetivos de la Fase

- Implementar servicios para todos los endpoints del backend
- Crear capa de abstracción sobre Axios
- Implementar authService con login/logout/refresh
- Crear services para users, devices, metrics, alerts, recommendations

---

## ✅ Tareas Detalladas

### 3.1 Servicio de Autenticación

**Crear `src/services/authService.ts`:**

```typescript
import api, { handleApiError } from './api';
import type { LoginResponse, User, ChangePasswordDTO } from '@types/user.types';

export const authService = {
  /**
   * POST /api/auth/login/
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login/', {
        email,
        password,
      });
      
      // Guardar tokens y usuario
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * POST /api/auth/logout/
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Limpiar storage siempre
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  /**
   * GET /api/auth/me/
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/me/');
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * POST /api/auth/change-password/
   */
  async changePassword(data: ChangePasswordDTO): Promise<void> {
    try {
      await api.post('/auth/change-password/', data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtener usuario del localStorage
   */
  getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Verificar si hay sesión activa
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};
```

### 3.2 Servicio de Usuarios

**Crear `src/services/userService.ts`:**

```typescript
import api, { handleApiError } from './api';
import type {
  User,
  Supervisor,
  Employee,
  CreateUserDTO,
  UpdateUserDTO,
} from '@types/user.types';
import type { PaginatedResponse } from '@types/api.types';

export const userService = {
  // ==================== Admin - Supervisores ====================
  
  async getSupervisors(): Promise<Supervisor[]> {
    try {
      const response = await api.get<PaginatedResponse<Supervisor>>('/admin/supervisors/');
      return response.data.results;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getSupervisor(id: number): Promise<Supervisor> {
    try {
      const response = await api.get<Supervisor>(`/admin/supervisors/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async createSupervisor(data: CreateUserDTO): Promise<Supervisor> {
    try {
      const response = await api.post<Supervisor>('/admin/supervisors/', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateSupervisor(id: number, data: UpdateUserDTO): Promise<Supervisor> {
    try {
      const response = await api.put<Supervisor>(`/admin/supervisors/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteSupervisor(id: number): Promise<void> {
    try {
      await api.delete(`/admin/supervisors/${id}/`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // ==================== Supervisor - Empleados ====================
  
  async getEmployees(): Promise<Employee[]> {
    try {
      const response = await api.get<PaginatedResponse<Employee>>('/supervisor/employees/');
      return response.data.results;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getEmployee(id: number): Promise<Employee> {
    try {
      const response = await api.get<Employee>(`/supervisor/employees/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async createEmployee(data: CreateUserDTO): Promise<Employee> {
    try {
      const response = await api.post<Employee>('/supervisor/employees/', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateEmployee(id: number, data: UpdateUserDTO): Promise<Employee> {
    try {
      const response = await api.put<Employee>(`/supervisor/employees/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteEmployee(id: number): Promise<void> {
    try {
      await api.delete(`/supervisor/employees/${id}/`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // ==================== Stats ====================
  
  async getAdminStats(): Promise<any> {
    try {
      const response = await api.get('/admin/stats/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
```

### 3.3 Servicio de Dispositivos

**Crear `src/services/deviceService.ts`:**

```typescript
import api, { handleApiError } from './api';
import type { Device, CreateDeviceDTO, UpdateDeviceDTO } from '@types/device.types';
import type { PaginatedResponse } from '@types/api.types';

export const deviceService = {
  async getDevices(): Promise<Device[]> {
    try {
      const response = await api.get<PaginatedResponse<Device>>('/devices/');
      return response.data.results;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getDevice(id: number): Promise<Device> {
    try {
      const response = await api.get<Device>(`/devices/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async createDevice(data: CreateDeviceDTO): Promise<Device> {
    try {
      const response = await api.post<Device>('/devices/', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateDevice(id: number, data: UpdateDeviceDTO): Promise<Device> {
    try {
      const response = await api.patch<Device>(`/devices/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteDevice(id: number): Promise<void> {
    try {
      await api.delete(`/devices/${id}/`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
```

### 3.4 Servicio de Métricas

**Crear `src/services/metricsService.ts`:**

```typescript
import api, { handleApiError } from './api';
import type { ProcessedMetrics, MetricsStatistics } from '@types/metrics.types';
import type { PaginatedResponse } from '@types/api.types';

export const metricsService = {
  async getMetrics(params?: {
    employee?: number;
    device?: number;
    date_from?: string;
    date_to?: string;
  }): Promise<ProcessedMetrics[]> {
    try {
      const response = await api.get<PaginatedResponse<ProcessedMetrics>>('/processed-metrics/', {
        params,
      });
      return response.data.results;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getLatestMetrics(employeeId?: number): Promise<ProcessedMetrics | null> {
    try {
      const response = await api.get<ProcessedMetrics>('/processed-metrics/latest/', {
        params: employeeId ? { employee: employeeId } : undefined,
      });
      return response.data;
    } catch (error) {
      console.error('Error getting latest metrics:', error);
      return null;
    }
  },

  async getMetricsByEmployee(employeeId: number, params?: {
    date_from?: string;
    date_to?: string;
  }): Promise<ProcessedMetrics[]> {
    try {
      const response = await api.get<PaginatedResponse<ProcessedMetrics>>(
        '/processed-metrics/by_employee/',
        { params: { employee: employeeId, ...params } }
      );
      return response.data.results;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getStatistics(params?: {
    employee?: number;
    date_from?: string;
    date_to?: string;
  }): Promise<MetricsStatistics> {
    try {
      const response = await api.get<MetricsStatistics>('/processed-metrics/statistics/', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
```

### 3.5 Servicio de Alertas

**Crear `src/services/alertService.ts`:**

```typescript
import api, { handleApiError } from './api';
import type {
  FatigueAlert,
  CreateAlertDTO,
  ResolveAlertDTO,
  AlertStatistics,
  AlertFilters,
} from '@types/alert.types';
import type { PaginatedResponse } from '@types/api.types';

export const alertService = {
  async getAlerts(filters?: AlertFilters): Promise<FatigueAlert[]> {
    try {
      const response = await api.get<PaginatedResponse<FatigueAlert>>('/alerts/', {
        params: filters,
      });
      return response.data.results;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getAlert(id: number): Promise<FatigueAlert> {
    try {
      const response = await api.get<FatigueAlert>(`/alerts/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async createAlert(data: CreateAlertDTO): Promise<FatigueAlert> {
    try {
      const response = await api.post<FatigueAlert>('/alerts/', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async resolveAlert(id: number, data?: ResolveAlertDTO): Promise<FatigueAlert> {
    try {
      const response = await api.post<FatigueAlert>(`/alerts/${id}/resolve/`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async unresolveAlert(id: number): Promise<FatigueAlert> {
    try {
      const response = await api.post<FatigueAlert>(`/alerts/${id}/unresolve/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getActiveAlerts(): Promise<FatigueAlert[]> {
    try {
      const response = await api.get<PaginatedResponse<FatigueAlert>>('/alerts/active/');
      return response.data.results;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getStatistics(days: number = 7): Promise<AlertStatistics> {
    try {
      const response = await api.get<AlertStatistics>('/alerts/statistics/', {
        params: { days },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
```

### 3.6 Servicio de Recomendaciones

**Crear `src/services/recommendationService.ts`:**

```typescript
import api, { handleApiError } from './api';
import type {
  RoutineRecommendation,
  CreateRecommendationDTO,
  ApplyRecommendationDTO,
  RecommendationStatistics,
  RecommendationFilters,
} from '@types/recommendation.types';
import type { PaginatedResponse } from '@types/api.types';

export const recommendationService = {
  async getRecommendations(filters?: RecommendationFilters): Promise<RoutineRecommendation[]> {
    try {
      const response = await api.get<PaginatedResponse<RoutineRecommendation>>(
        '/recommendations/',
        { params: filters }
      );
      return response.data.results;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getRecommendation(id: number): Promise<RoutineRecommendation> {
    try {
      const response = await api.get<RoutineRecommendation>(`/recommendations/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async createRecommendation(data: CreateRecommendationDTO): Promise<RoutineRecommendation> {
    try {
      const response = await api.post<RoutineRecommendation>('/recommendations/', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async applyRecommendation(
    id: number,
    data?: ApplyRecommendationDTO
  ): Promise<RoutineRecommendation> {
    try {
      const response = await api.post<RoutineRecommendation>(
        `/recommendations/${id}/apply/`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getPending(): Promise<RoutineRecommendation[]> {
    try {
      const response = await api.get<PaginatedResponse<RoutineRecommendation>>(
        '/recommendations/pending/'
      );
      return response.data.results;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getStatistics(days: number = 30): Promise<RecommendationStatistics> {
    try {
      const response = await api.get<RecommendationStatistics>('/recommendations/statistics/', {
        params: { days },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
```

### 3.7 Servicio de Dashboard

**Crear `src/services/dashboardService.ts`:**

```typescript
import api, { handleApiError } from './api';
import type {
  OverviewStats,
  EmployeeDashboard,
  SupervisorDashboard,
  AdminDashboard,
} from '@types/dashboard.types';

export const dashboardService = {
  async getOverview(): Promise<OverviewStats> {
    try {
      const response = await api.get<OverviewStats>('/dashboard/overview/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getEmployeeDashboard(): Promise<EmployeeDashboard> {
    try {
      const response = await api.get<EmployeeDashboard>('/dashboard/employee_dashboard/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getSupervisorDashboard(): Promise<SupervisorDashboard> {
    try {
      const response = await api.get<SupervisorDashboard>('/dashboard/supervisor_dashboard/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getAdminDashboard(): Promise<AdminDashboard> {
    try {
      const response = await api.get<AdminDashboard>('/dashboard/admin_dashboard/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
```

---

## 📝 Checklist de Completitud

- [ ] `authService.ts` - Login, logout, getCurrentUser, changePassword
- [ ] `userService.ts` - CRUD supervisores y empleados, stats
- [ ] `deviceService.ts` - CRUD dispositivos
- [ ] `metricsService.ts` - Obtener métricas, latest, by_employee, statistics
- [ ] `alertService.ts` - CRUD alertas, resolve/unresolve, active, statistics
- [ ] `recommendationService.ts` - CRUD recomendaciones, apply, pending, statistics
- [ ] `dashboardService.ts` - Overview, dashboards por rol
- [ ] Todos los services usando tipos TypeScript
- [ ] Manejo de errores en todos los métodos
- [ ] localStorage management en authService

---

## 🧪 Prueba de Integración

**Crear `src/test-services.ts`:**

```typescript
import { authService } from '@services/authService';
import { userService } from '@services/userService';

// Probar login
async function testLogin() {
  try {
    const response = await authService.login('admin@example.com', 'admin123');
    console.log('Login exitoso:', response);
    
    const user = await authService.getCurrentUser();
    console.log('Usuario actual:', user);
    
    const isAuth = authService.isAuthenticated();
    console.log('Autenticado:', isAuth);
  } catch (error) {
    console.error('Error en login:', error);
  }
}

// Ejecutar después de hacer login manual
// testLogin();
```

---

## 🎯 Resultado Esperado

✅ Todos los services implementados y funcionales  
✅ Integración completa con backend Django  
✅ Manejo de errores centralizado  
✅ TypeScript types aplicados correctamente  
✅ authService manejando tokens JWT  

---

## 🚀 Siguiente Fase

**FASE 4: Custom Hooks y Utils**

