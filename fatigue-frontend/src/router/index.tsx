/**
 * App Router Configuration
 * Configuración de rutas de la aplicación
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/auth/LoginPage';
import { MainLayout } from '../layouts/MainLayout';
import { 
  AdminDashboardPage,
  CompaniesPage,
  EmployeesListPage, 
  DevicesListPage, 
  AlertsListPage,
  AdminReportsPage,
  SettingsPage,
  SimulatorsPage,
  MLModelInfoPage,
  MachineLearningDashboard
} from '../pages/admin';
import { 
  SupervisorDashboardPage,
  SupervisorTeamOverviewPage,
  SupervisorTeamAlertsPage,
  SupervisorTeamReportsPage,
  SupervisorDevicesPage,
  BreaksManagementPage
} from '../pages/supervisor';
import { 
  EmployeeDashboardPage,
  EmployeeRecommendationsPage,
  EmployeeProfilePage,
  EmployeeAlertsPage,
  EmployeeDeviceMonitorPage,
  MyBreaksPage,
  HelpCenterPage
} from '../pages/employee';

// Pages - Placeholder components (crearemos después)
const NotFoundPage = () => <div>404 - Page Not Found</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboardPage />,
      },
      {
        path: 'companies',
        element: <CompaniesPage />,
      },
      {
        path: 'employees',
        element: <EmployeesListPage />,
      },
      {
        path: 'devices',
        element: <DevicesListPage />,
      },
      {
        path: 'alerts',
        element: <AlertsListPage />,
      },
      {
        path: 'simulators',
        element: <SimulatorsPage />,
      },
      {
        path: 'reports',
        element: <AdminReportsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'ml-model',
        element: <MLModelInfoPage />,
      },
      {
        path: 'machine-learning',
        element: <MachineLearningDashboard />,
      },
    ],
  },
  {
    path: '/supervisor',
    element: (
      <ProtectedRoute allowedRoles={['supervisor']}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <SupervisorDashboardPage />,
      },
      {
        path: 'team',
        element: <SupervisorTeamOverviewPage />,
      },
      {
        path: 'devices',
        element: <SupervisorDevicesPage />,
      },
      {
        path: 'alerts',
        element: <SupervisorTeamAlertsPage />,
      },
      {
        path: 'reports',
        element: <SupervisorTeamReportsPage />,
      },
      {
        path: 'breaks',
        element: <BreaksManagementPage />,
      },
    ],
  },
  {
    path: '/employee',
    element: (
      <ProtectedRoute allowedRoles={['employee']}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <EmployeeDashboardPage />,
      },
      {
        path: 'alerts',
        element: <EmployeeAlertsPage />,
      },
      {
        path: 'recommendations',
        element: <EmployeeRecommendationsPage />,
      },
      {
        path: 'profile',
        element: <EmployeeProfilePage />,
      },
      {
        path: 'device-monitor',
        element: <EmployeeDeviceMonitorPage />,
      },
      {
        path: 'breaks',
        element: <MyBreaksPage />,
      },
      {
        path: 'help',
        element: <HelpCenterPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
