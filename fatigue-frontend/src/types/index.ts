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

// Company types
export type {
  Company,
  CompanyDetail,
  CompanyStats,
  CompanyGlobalStats,
  CompanyCreateInput,
  CompanyUpdateInput
} from './company.types';

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

// Report types
export type {
  ReportPeriod,
  EmployeeReportStats,
  AlertStats as ReportAlertStats,
  RecommendationStats as ReportRecommendationStats,
  DailyMetric,
  EmployeeReport,
  TeamReportEmployee,
  TeamReport,
  ExecutiveSummary,
  ReportType,
  ReportFormat,
  ReportRequest
} from './report.types';

// Simulator types
export type {
  SimulatorSession,
  SimulatorSessionDetail,
  CreateSimulatorData,
  UpdateSimulatorConfigData,
  SimulatorLiveStats,
  EmployeeForSimulator,
  SimulatorStats,
  SimulatorConfig
} from './simulator.types';
export { FATIGUE_PROFILES, ACTIVITY_MODES } from './simulator.types';

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
