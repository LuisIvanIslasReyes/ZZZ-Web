/**
 * Types Index
 * Exportación centralizada de todos los tipos
 */

// User types
export type { 
  User, 
  CreateUserData, 
  UpdateUserData, 
  ChangePasswordData 
} from './user.types';
export { UserRole } from './user.types';

// Employee types
export type {
  Employee,
  CreateEmployeeData,
  UpdateEmployeeData
} from './employee.types';

// Device types
export type { 
  Device,
  CreateDeviceData, 
  UpdateDeviceData 
} from './device.types';
export { DeviceStatus } from './device.types';

// Metrics types
export type { 
  SensorData, 
  ProcessedMetrics, 
  MetricsFilters,
  MetricsStats 
} from './metrics.types';

// Alert types
export type { 
  FatigueAlert,
  CreateAlertData, 
  UpdateAlertData,
  AlertFilters,
  AlertStats 
} from './alert.types';
export { AlertSeverity, AlertStatus } from './alert.types';

// Recommendation types
export type { 
  RoutineRecommendation,
  CreateRecommendationData, 
  UpdateRecommendationData,
  RecommendationFilters,
  RecommendationStats 
} from './recommendation.types';
export { RecommendationType, RecommendationStatus } from './recommendation.types';

// API types
export type { 
  ApiResponse, 
  PaginatedResponse, 
  ApiError,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  DashboardStats,
  EmployeeMetricsSummary,
  TimeSeriesDataPoint,
  ChartData
} from './api.types';
