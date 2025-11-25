/**
 * Main Layout
 * Layout principal con sidebar y header para usuarios autenticados - Diseño ZZZ Admin
 */

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactElement;
  roles?: string[];
}

const navigationItems: NavItem[] = [
  // Admin routes - Solo gestión de empresas
  { 
    name: 'Empresas', 
    path: '/admin/companies', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    roles: ['admin'] 
  },
  { 
    name: 'Configuración', 
    path: '/admin/settings', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    roles: ['admin'] 
  },
  
  // Supervisor routes
  { 
    name: 'Dashboard', 
    path: '/supervisor/dashboard', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>, 
    roles: ['supervisor'] 
  },
  { 
    name: 'Empleados', 
    path: '/supervisor/team', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, 
    roles: ['supervisor'] 
  },
  { 
    name: 'Dispositivos',
    path: '/supervisor/devices',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    roles: ['supervisor']
  },
  { 
    name: 'Alertas', 
    path: '/supervisor/alerts', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>, 
    roles: ['supervisor'] 
  },
  { 
    name: 'Reportes', 
    path: '/supervisor/reports', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, 
    roles: ['supervisor'] 
  },
  
  // Employee routes
  { 
    name: 'Dashboard', 
    path: '/employee/dashboard', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>, 
    roles: ['employee'] 
  },
  { 
    name: 'Mis Métricas', 
    path: '/employee/metrics', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, 
    roles: ['employee'] 
  },
  { 
    name: 'Alertas', 
    path: '/employee/alerts', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>, 
    roles: ['employee'] 
  },
  { 
    name: 'Recomendaciones', 
    path: '/employee/recommendations', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>, 
    roles: ['employee'] 
  },
  { 
    name: 'Mi Perfil', 
    path: '/employee/profile', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, 
    roles: ['employee'] 
  },
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

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'supervisor':
        return 'Supervisor';
      case 'employee':
        return 'Empleado';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#0f1729] text-white shadow-2xl z-40 transition-all duration-300 ${
          isSidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        {/* Logo/Title */}
        <div className={`p-5 border-b border-white/10 ${!isSidebarOpen ? 'px-3' : ''}`}>
          <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            {isSidebarOpen && (
              <>
                <div className="flex-1">
                  <h1 className="text-xl font-bold">ZZZ Admin</h1>
                  <p className="text-xs text-blue-200">Zero to Zero-Fatigue</p>
                </div>
                <button
                  className="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20 border-white/20 flex-shrink-0"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  title="Contraer sidebar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </>
            )}
          </div>
          {/* Botón expandir cuando está colapsado */}
          {!isSidebarOpen && (
            <button
              className="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20 border-white/20 w-full mt-3"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title="Expandir sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* User Info */}
        {user && (
          <div className={`p-5 border-b border-white/10 ${!isSidebarOpen ? 'px-3' : ''}`}>
            <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'}`}>
              <div className="avatar placeholder flex-shrink-0">
                <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-xl w-11 h-11">
                  <span className="text-lg font-bold">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </span>
                </div>
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-sm">
                    {user.first_name} {user.last_name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`badge badge-xs ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
            {!isSidebarOpen && (
              <p className="text-[10px] text-center text-blue-200 mt-2 uppercase font-bold tracking-wide">
                {user.role === 'admin' ? 'AP' : user.role === 'supervisor' ? 'SV' : 'EP'}
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="p-3 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          <ul className={`menu space-y-1 ${!isSidebarOpen ? 'p-0' : ''}`}>
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg transition-all ${
                      isSidebarOpen ? 'px-4 py-3' : 'px-3 py-3 justify-center'
                    } ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }`
                  }
                  title={!isSidebarOpen ? item.name : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className={`absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#0f1729] ${isSidebarOpen ? 'p-4' : 'p-3'}`}>
          <button
            className={`btn btn-ghost text-white hover:bg-red-500/20 border-white/10 ${
              isSidebarOpen ? 'btn-block justify-start' : 'btn-circle mx-auto'
            }`}
            onClick={handleLogout}
            title={!isSidebarOpen ? 'Cerrar Sesión' : undefined}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isSidebarOpen && <span className="ml-3">Cerrar Sesión</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 min-h-screen bg-base-200 ${
          isSidebarOpen ? 'ml-72' : 'ml-20'
        }`}
      >
        {/* Page Content */}
        <main className="p-6 md:p-8 lg:p-10 max-w-[1600px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
