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
  SettingsPage
} from '../pages/admin';
import { 
  SupervisorDashboardPage,
  SupervisorTeamOverviewPage,
  SupervisorTeamAlertsPage,
  SupervisorTeamReportsPage,
  SupervisorDevicesPage
} from '../pages/supervisor';
import { 
  EmployeeDashboardPage,
  EmployeeMetricsPage,
  EmployeeRecommendationsPage,
  EmployeeProfilePage
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
        path: 'reports',
        element: <AdminReportsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
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
        path: 'metrics',
        element: <EmployeeMetricsPage />,
      },
      {
        path: 'recommendations',
        element: <EmployeeRecommendationsPage />,
      },
      {
        path: 'profile',
        element: <EmployeeProfilePage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
