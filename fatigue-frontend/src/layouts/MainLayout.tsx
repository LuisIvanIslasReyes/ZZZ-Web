/**
 * Main Layout
 * Layout principal con sidebar y header para usuarios autenticados
 */

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';

interface NavItem {
  name: string;
  path: string;
  icon: string;
  roles?: string[];
}

const navigationItems: NavItem[] = [
  // Admin routes
  { name: 'Dashboard', path: '/admin/dashboard', icon: '📊', roles: ['admin'] },
  { name: 'Empleados', path: '/admin/employees', icon: '👥', roles: ['admin'] },
  { name: 'Dispositivos', path: '/admin/devices', icon: '⌚', roles: ['admin'] },
  { name: 'Alertas', path: '/admin/alerts', icon: '🚨', roles: ['admin'] },
  { name: 'Reportes', path: '/admin/reports', icon: '📈', roles: ['admin'] },
  { name: 'Configuración', path: '/admin/settings', icon: '⚙️', roles: ['admin'] },
  
  // Supervisor routes
  { name: 'Dashboard', path: '/supervisor/dashboard', icon: '📊', roles: ['supervisor'] },
  { name: 'Mi Equipo', path: '/supervisor/team', icon: '👥', roles: ['supervisor'] },
  { name: 'Alertas', path: '/supervisor/alerts', icon: '🚨', roles: ['supervisor'] },
  { name: 'Reportes', path: '/supervisor/reports', icon: '📈', roles: ['supervisor'] },
  
  // Employee routes
  { name: 'Dashboard', path: '/employee/dashboard', icon: '📊', roles: ['employee'] },
  { name: 'Mis Métricas', path: '/employee/metrics', icon: '📈', roles: ['employee'] },
  { name: 'Recomendaciones', path: '/employee/recommendations', icon: '💡', roles: ['employee'] },
  { name: 'Mi Perfil', path: '/employee/profile', icon: '👤', roles: ['employee'] },
];

export function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const filteredNavItems = navigationItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role || '')
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'badge-error';
      case 'supervisor':
        return 'badge-warning';
      case 'employee':
        return 'badge-info';
      default:
        return 'badge-ghost';
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-base-100 shadow-xl z-40 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo/Title */}
        <div className="p-4 border-b border-base-300">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <h1 className="text-xl font-bold text-primary">
                Fatiga Monitor
              </h1>
            )}
            <button
              className="btn btn-ghost btn-sm btn-circle"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-base-300">
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-10">
                  <span className="text-xl">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </span>
                </div>
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {user.first_name} {user.last_name}
                  </p>
                  <div className={`badge badge-sm ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-2">
          <ul className="menu">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? 'active' : ''
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && <span>{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300">
          <button
            className={`btn btn-ghost ${isSidebarOpen ? 'btn-block' : 'btn-circle'}`}
            onClick={handleLogout}
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Header */}
        <header className="bg-base-100 shadow-sm sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {filteredNavItems.find((item) => 
                    window.location.pathname.includes(item.path)
                  )?.name || 'Dashboard'}
                </h2>
                <p className="text-sm text-base-content/60">
                  Sistema de Detección de Fatiga Laboral
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="dropdown dropdown-end">
                  <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                      <span className="text-xl">🔔</span>
                      <span className="badge badge-sm badge-primary indicator-item">3</span>
                    </div>
                  </button>
                  <div className="dropdown-content mt-3 z-[1] card card-compact w-64 bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h3 className="font-bold">Notificaciones</h3>
                      <p className="text-sm text-base-content/60">
                        3 nuevas alertas pendientes
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Menu */}
                <div className="dropdown dropdown-end">
                  <button className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                      <span className="text-sm font-bold">
                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                      </span>
                    </div>
                  </button>
                  <ul className="dropdown-content mt-3 z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a>Mi Perfil</a></li>
                    <li><a>Configuración</a></li>
                    <li><a onClick={handleLogout}>Cerrar Sesión</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
