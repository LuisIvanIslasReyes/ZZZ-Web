/**
 * Settings Page
 * Página de configuración del sistema
 */

import { useState } from 'react';
import { useAuth } from '../../contexts';
import toast from 'react-hot-toast';
import { authService } from '../../services';
import { exportMyData } from '../../services/admin.service';
  // Handler para exportar datos del admin
  const handleExportMyData = async () => {
    try {
      toast.loading('Generando archivo...');
      const blob = await exportMyData();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mis_datos_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success('Datos exportados correctamente');
    } catch (error) {
      toast.dismiss();
      toast.error('Error al exportar datos');
    }
  };

interface PasswordData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export function SettingsPage() {
    // Estado para modales
  const { user } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      setIsChangingPassword(true);
      await authService.changePassword(
        passwordData.old_password,
        passwordData.new_password,
        passwordData.confirm_password
      );
      toast.success('Contraseña actualizada correctamente');
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.detail || 'Error al cambiar la contraseña');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">Administra la configuración de tu cuenta y del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile & Password Section with gray background */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-6">
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Información del Perfil</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                    {user?.first_name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                    {user?.last_name}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  {user?.email}
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Cambiar Contraseña</h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={passwordData.old_password}
                  onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
                  required
                  disabled={isChangingPassword}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
                  required
                  minLength={6}
                  disabled={isChangingPassword}
                />
                <p className="mt-1 text-sm text-gray-500">Mínimo 6 caracteres</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
                  required
                  minLength={6}
                  disabled={isChangingPassword}
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full px-6 py-3 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isChangingPassword ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Actualizar Contraseña
                  </>
                )}
              </button>
            </form>
          </div>
          </div>

          {/* System Settings - Solo para Admin */}
          {user?.role === 'admin' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Configuración del Sistema</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Notificaciones de Alertas</h3>
                    <p className="text-sm text-gray-500">Recibir notificaciones cuando se generen alertas críticas</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#18314F]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Reportes Automáticos</h3>
                    <p className="text-sm text-gray-500">Generar reportes semanales automáticamente</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#18314F]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Monitoreo en Tiempo Real</h3>
                    <p className="text-sm text-gray-500">Actualizar métricas cada 30 segundos</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#18314F]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#18314F] to-[#1e3a5f] rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-gray-600">
                  Rol: <span className="font-medium text-gray-900">
                    {user?.role === 'admin' ? 'Administrador' : user?.role === 'supervisor' ? 'Supervisor' : 'Empleado'}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-600 font-medium">Cuenta activa</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <button
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                onClick={handleExportMyData}
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar mis datos
              </button>

              {/*
              <button
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                onClick={() => setHelpOpen(true)}
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Centro de ayuda
              </button>
              */}

              {/*
              <button
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                onClick={() => setAboutOpen(true)}
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Acerca de la aplicación
              </button>
              */}
                  {/*
                  <Modal isOpen={helpOpen} onClose={() => setHelpOpen(false)} title="Centro de ayuda" size="md">
                    <div className="space-y-4">
                      <p className="text-gray-700">
                        ¿Tienes dudas sobre el sistema ZZZ?
                      </p>
                      <ul className="list-disc pl-6 text-gray-600 text-sm space-y-1">
                        <li>Consulta la documentación oficial en <a href="https://zzz-docs.example.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">docs internas</a>.</li>
                        <li>Contacta a soporte: <span className="font-medium">soporte@zzz.com</span></li>
                        <li>Revisa el manual de usuario en la sección de ayuda del dashboard.</li>
                        <li>Para problemas técnicos, reporta vía ticket en el portal de administración.</li>
                      </ul>
                    </div>
                  </Modal>

                  <Modal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} title="Acerca de la aplicación" size="md">
                    <div className="space-y-4">
                      <p className="text-gray-700 font-medium">Zero to Zero-Fatigue Zone (ZZZ)</p>
                      <p className="text-gray-600 text-sm">
                        Plataforma IoT empresarial para monitoreo y predicción de fatiga laboral en tiempo real.<br />
                        <span className="font-semibold">Versión:</span> 1.0.0<br />
                        <span className="font-semibold">Última actualización:</span> Nov 2025
                      </p>
                      <p className="text-gray-600 text-sm">
                        Desarrollado por el equipo ZZZ. Todos los derechos reservados.<br />
                        Para más información visita <a href="https://zzz.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">zzz.com</a>
                      </p>
                    </div>
                  </Modal>
                  */}
            </div>
          </div>

          {/* System Info */}
          <div className="bg-gradient-to-br from-[#18314F] via-[#0f2137] to-[#0a1628] p-6 rounded-lg shadow-sm border border-gray-700 text-white">
            <h3 className="font-semibold mb-4">Sistema ZZZ</h3>
            <p className="text-sm text-blue-100 mb-4">
              Zero to Zero-Fatigue
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-200">Versión:</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Última actualización:</span>
                <span className="font-medium">Nov 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
