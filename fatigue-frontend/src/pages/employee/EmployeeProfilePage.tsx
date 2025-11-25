/**
 * Employee Profile Page
 * Perfil y configuración del empleado
 * Diseño ZZZ Admin Style
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { authService, meService, employeeExportService } from '../../services';
import { Modal } from '../../components/common';
import { EditProfileModal } from '../../components/forms/EditProfileModal';
import toast from 'react-hot-toast';
import type { User } from '../../types/user.types';

export function EmployeeProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    // Guardar cambios del perfil (dummy, solo frontend)
    const handleSaveProfile = async (updatedUser: Partial<User>) => {
      // Aquí deberías llamar a un servicio real para actualizar el perfil
      setUser((prev) => ({ ...prev, ...updatedUser } as User));
      toast.success('Perfil actualizado');
      setIsEditProfileModalOpen(false);
    };
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // console.log('🔄 Cargando perfil del usuario...');
    meService.getMe()
      .then((userData) => {
        // console.log('✅ Usuario cargado:', userData);
        setUser(userData);
      })
      .catch((error) => {
        // console.error('❌ Error al cargar perfil:', error);
        toast.error('Error al cargar perfil');
      });
  }, []);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      setIsLoading(true);
      await authService.changePassword(oldPassword, newPassword);
      toast.success('Contraseña cambiada exitosamente');
      setIsChangePasswordModalOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadData = async () => {
    try {
      setIsLoading(true);
      toast('Preparando descarga de tus datos...');
      const blob = await employeeExportService.exportMyData();
      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mis_datos.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setIsDownloadModalOpen(false);
      toast.success('Descarga iniciada');
    } catch (error) {
      toast.error('Error al descargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada exitosamente');
      navigate('/login');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#18314F] mb-1">Mi Perfil</h1>
        <p className="text-lg text-[#18314F]/70">Información personal y configuración de cuenta</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-start gap-6">
          <div className="avatar placeholder">
            <div className="bg-[#18314F]/10 text-[#18314F] rounded-2xl w-32 h-32 flex items-center justify-center">
              <span className="font-bold text-5xl">
                {user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}` : '--'}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-[#18314F] mb-2">
              {user ? user.full_name : 'Cargando...'}
            </h2>
            <p className="text-gray-600 mb-4">
              {user ? `ID: ${user.username}${user.department ? ` | Departamento: ${user.department}` : ''}` : ''}
            </p>
            <div className="flex gap-4">
              <button
                className="bg-[#18314F] hover:bg-[#18314F]/90 text-white font-medium py-2 px-6 rounded-xl transition-colors"
                onClick={() => setIsEditProfileModalOpen(true)}
              >
                Editar Perfil
              </button>
                    {/* Edit Profile Modal */}
                    <EditProfileModal
                      isOpen={isEditProfileModalOpen}
                      onClose={() => setIsEditProfileModalOpen(false)}
                      user={user}
                      onSave={handleSaveProfile}
                    />
              <button className="bg-white hover:bg-gray-50 text-[#18314F] font-medium py-2 px-6 rounded-xl border-2 border-[#18314F] transition-colors">
                Cambiar Foto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Information Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-[#18314F] mb-6">Información Personal</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">Nombre Completo</label>
              <p className="text-lg text-[#18314F]">{user?.full_name || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Email</label>
              <p className="text-lg text-[#18314F]">{user?.email || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Teléfono</label>
              <p className="text-lg text-[#18314F]">{user?.phone || '-'}</p>
            </div>
            {/* <div>
              <label className="text-sm text-gray-600 font-medium">Usuario</label>
              <p className="text-lg text-[#18314F]">{user?.username || '-'}</p>
            </div> */}
          </div>
        </div>

        {/* Work Information */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-[#18314F] mb-6">Información Laboral</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">Departamento</label>
              <p className="text-lg text-[#18314F]">{user?.department || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Puesto</label>
              <p className="text-lg text-[#18314F]">{user?.position || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Rol</label>
              <p className="text-lg text-[#18314F]">{user?.role || '-'}</p>
            </div>
            {/* <div>
              <label className="text-sm text-gray-600 font-medium">Empresa</label>
              <p className="text-lg text-[#18314F]">{user?.company_name || '-'}</p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Device Information */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-[#18314F] mb-6">Información del Dispositivo</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">ID del Dispositivo</p>
            <p className="text-lg font-semibold text-[#18314F]">DEV-001</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Modelo</p>
            <p className="text-lg font-semibold text-[#18314F]">FatigueWatch Pro</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Firmware</p>
            <p className="text-lg font-semibold text-[#18314F]">v2.4.1</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Estado</p>
            <p className="text-lg font-semibold text-green-600">Activo</p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-[#18314F] mb-6">Preferencias y Notificaciones</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-[#18314F]">Notificaciones por Email</p>
              <p className="text-sm text-gray-600">Recibe alertas y actualizaciones por correo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#18314F]"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-[#18314F]">Alertas en Dispositivo</p>
              <p className="text-sm text-gray-600">Vibración cuando se detecta fatiga alta</p>
            </div>
            <label className="relative inline-flex items-cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#18314F]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-[#18314F]">Recordatorios de Descanso</p>
              <p className="text-sm text-gray-600">Sugerencias automáticas de pausas</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#18314F]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-[#18314F] mb-6">Acciones de Cuenta</h3>
        <div className="flex gap-4">
          <button 
            className="bg-[#18314F] hover:bg-[#18314F]/90 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm"
            onClick={() => setIsChangePasswordModalOpen(true)}
          >
            Cambiar Contraseña
          </button>
          <button 
            className="bg-[#C98A05] hover:bg-[#A87404] text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm"
            onClick={() => setIsDownloadModalOpen(true)}
          >
            Descargar Mis Datos
          </button>
          {/* <button 
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button> */}
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={isChangePasswordModalOpen}
        onClose={() => {
          setIsChangePasswordModalOpen(false);
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }}
        title="Cambiar Contraseña"
        footer={
          <>
            <button
              onClick={() => {
                setIsChangePasswordModalOpen(false);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleChangePassword}
              disabled={isLoading}
              className="px-6 py-3 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Cambiar Contraseña'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña Actual
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#18314F] focus:border-transparent"
              placeholder="Ingresa tu contraseña actual"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#18314F] focus:border-transparent"
              placeholder="Ingresa tu nueva contraseña"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#18314F] focus:border-transparent"
              placeholder="Confirma tu nueva contraseña"
            />
          </div>
          <p className="text-sm text-gray-500">
            La contraseña debe tener al menos 8 caracteres.
          </p>
        </div>
      </Modal>

      {/* Download Data Modal */}
      <Modal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        title="Descargar Mis Datos"
        footer={
          <>
            <button
              onClick={() => setIsDownloadModalOpen(false)}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDownloadData}
              disabled={isLoading}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Descargando...' : 'Descargar'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Se descargará un archivo con toda tu información personal y métricas registradas en el sistema.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> El archivo incluirá:
            </p>
            <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">
              <li>Información personal</li>
              <li>Historial de métricas</li>
              <li>Alertas recibidas</li>
              <li>Recomendaciones aplicadas</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}
