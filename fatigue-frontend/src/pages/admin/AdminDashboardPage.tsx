/**
 * Admin Dashboard Page
 * Dashboard principal para administradores - Redirige a Empresas
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir automáticamente a la página de empresas
    navigate('/admin/companies', { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-64">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}
