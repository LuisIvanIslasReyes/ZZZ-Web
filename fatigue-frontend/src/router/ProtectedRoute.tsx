/**
 * Protected Route Component
 * Componente para proteger rutas que requieren autenticación
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir a login preservando la ruta intentada
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se especifican roles permitidos, verificar que el usuario tenga uno de ellos
  if (allowedRoles && user && !allowedRoles.includes(user.role as UserRole)) {
    // Redirigir al dashboard correspondiente según el rol
    const dashboardPath = 
      user.role === 'admin' ? '/admin/dashboard' :
      user.role === 'supervisor' ? '/supervisor/dashboard' :
      '/employee/dashboard';
    
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
}
