/**
 * Employee Profile Page
 * Perfil y configuración del empleado
 * Diseño ZZZ Admin Style
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { authService, meService, employeeExportService, employeeProfileService, deviceService, recommendationService } from '../../services';
import { Modal, HelpCenterModal, ReportSymptomModal } from '../../components/common';
import { EditProfileModal } from '../../components/forms/EditProfileModal';
import toast from 'react-hot-toast';
import type { User } from '../../types/user.types';
import type { Device } from '../../types/device.types';
import type { RoutineRecommendation } from '../../types/recommendation.types';

export function EmployeeProfilePage() {
  const navigate = useNavigate();
  const { logout, refreshUser } = useAuth();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isHelpCenterModalOpen, setIsHelpCenterModalOpen] = useState(false);
  const [isDeleteAvatarModalOpen, setIsDeleteAvatarModalOpen] = useState(false);
  const [isReportSymptomModalOpen, setIsReportSymptomModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [recommendations, setRecommendations] = useState<RoutineRecommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Guardar cambios del perfil (real, PATCH a /auth/me/)
  const handleSaveProfile = async (updatedUser: Partial<User>) => {
    try {
      setIsLoading(true);
      console.log('🔄 Guardando perfil...', updatedUser);
      await employeeProfileService.updateMyProfile(updatedUser);
      // Recargar el perfil completo desde el backend
      const refreshedUser = await meService.getMe();
      console.log('✅ Perfil recargado:', refreshedUser);
      setUser(refreshedUser);
      // Actualizar también el contexto global de autenticación para que se refleje en el sidebar
      await refreshUser();
      toast.success('Perfil actualizado');
      setIsEditProfileModalOpen(false);
    } catch (error: any) {
      console.error('❌ Error al actualizar perfil:', error);
      toast.error(error?.response?.data?.detail || 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadUserData();
    loadRecommendations();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await meService.getMe();
      setUser(userData);
      
      // Cargar dispositivo del empleado
      const devices = await deviceService.getDevicesByEmployee(userData.id);
      if (devices && devices.length > 0) {
        setDevice(devices[0]);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar perfil');
    }
  };

  const loadRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      const response = await recommendationService.getRecommendations({
        page_size: 3,
        ordering: '-created_at'
      });
      setRecommendations(response.results || []);
    } catch (error) {
      console.error('Error al cargar recomendaciones:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

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
      await authService.changePassword(oldPassword, newPassword, confirmPassword);
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

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo (JPG, PNG, GIF, WEBP)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato no permitido. Usa JPG, PNG, GIF o WEBP');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar 5MB');
      return;
    }

    try {
      setIsLoading(true);
      setImageError(false); // Resetear error de imagen
      await employeeProfileService.uploadAvatar(file);
      await loadUserData();
      await refreshUser();
      toast.success('Foto actualizada exitosamente');
    } catch (error: any) {
      console.error('Error al actualizar foto:', error);
      toast.error(error?.response?.data?.detail || 'Error al actualizar la foto');
    } finally {
      setIsLoading(false);
      // Limpiar el input para permitir subir la misma imagen de nuevo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleViewHistory = () => {
    navigate('/employee/metrics');
  };

  const handleScheduleBreak = () => {
    toast.info('Funcionalidad de programar descanso próximamente');
  };

  const handleReportSymptom = () => {
    setIsReportSymptomModalOpen(true);
  };

  const handleDeleteAvatar = async () => {
    if (!user?.avatar_url) return;

    try {
      setIsLoading(true);
      setIsDeleteAvatarModalOpen(false);
      await employeeProfileService.deleteAvatar();
      setImageError(false);
      await loadUserData();
      await refreshUser();
      toast.success('Foto eliminada exitosamente');
    } catch (error: any) {
      console.error('Error al eliminar foto:', error);
      toast.error(error?.response?.data?.detail || 'Error al eliminar la foto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpCenter = () => {
    setIsHelpCenterModalOpen(true);
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
          <div className="avatar placeholder relative">
            <div className="bg-[#18314F]/10 text-[#18314F] rounded-2xl w-32 h-32 flex items-center justify-center overflow-hidden">
              {user?.avatar_url && !imageError ? (
                <img 
                  src={user.avatar_url} 
                  alt="Foto de perfil" 
                  className="w-full h-full object-cover"
                  onError={() => {
                    console.error('Error cargando imagen:', user.avatar_url);
                    setImageError(true);
                  }}
                  onLoad={() => setImageError(false)}
                />
              ) : (
                <span className="font-bold text-5xl">
                  {user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}` : '--'}
                </span>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-[#18314F] mb-2">
              {user ? user.full_name : 'Cargando...'}
            </h2>
            <p className="text-gray-600 mb-4">
              {user ? ` Departamento: ${user.department}` : ''}
            </p>
            <div className="flex gap-4">
              <button
                className="bg-[#18314F] hover:bg-[#18314F]/90 text-white font-medium py-2 px-6 rounded-xl transition-colors"
                onClick={() => setIsEditProfileModalOpen(true)}
              >
                Editar Perfil
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <button 
                className="bg-white hover:bg-gray-50 text-[#18314F] font-medium py-2 px-6 rounded-xl border-2 border-[#18314F] transition-colors"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : user?.avatar_url ? 'Cambiar Foto' : 'Subir Foto'}
              </button>
              {user?.avatar_url && (
                <button 
                  className="bg-white hover:bg-red-50 text-red-600 font-medium py-2 px-6 rounded-xl border-2 border-red-300 transition-colors"
                  onClick={() => setIsDeleteAvatarModalOpen(true)}
                  disabled={isLoading}
                >
                  Eliminar Foto
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />

      {/* Recomendaciones Personalizadas */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[#18314F] flex items-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Recomendaciones Personalizadas
            </h3>
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
              {recommendations.length} nuevas
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-start gap-3 mb-3">
                  {rec.priority === 'high' ? (
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </div>
                  ) : rec.recommendation_type === 'break' ? (
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z"/>
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#18314F] mb-1">{rec.title}</h4>
                    <p className="text-sm text-gray-700">{rec.description}</p>
                  </div>
                </div>
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                  rec.priority === 'high' 
                    ? 'bg-blue-100 text-blue-800' 
                    : rec.status === 'recommended'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {rec.priority === 'high' ? 'Alta prioridad' : rec.status === 'recommended' ? 'Recomendado' : 'Pendiente'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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
        {device ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">ID del Dispositivo</p>
              <p className="text-lg font-semibold text-[#18314F]">{device.device_identifier}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Modelo</p>
              <p className="text-lg font-semibold text-[#18314F]">ESP32 Wearable</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Última Conexión</p>
              <p className="text-lg font-semibold text-[#18314F]">
                {device.last_connection 
                  ? new Date(device.last_connection).toLocaleString('es-ES', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Nunca'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Estado</p>
              <p className={`text-lg font-semibold ${
                device.is_active ? 'text-green-600' : 'text-gray-400'
              }`}>
                {device.is_active ? 'Activo' : 'Inactivo'}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
            <svg className="w-12 h-12 text-yellow-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-yellow-800 font-semibold mb-1">No tienes un dispositivo asignado</p>
            <p className="text-yellow-700 text-sm">Contacta a tu supervisor para que te asigne un dispositivo</p>
          </div>
        )}
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-[#18314F] mb-6">Acciones Rápidas</h3>
        <div className="space-y-3">
          <button
            onClick={handleViewHistory}
            className="w-full bg-[#18314F] hover:bg-[#18314F]/90 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Ver Mi Historial
          </button>
          <button
            onClick={handleScheduleBreak}
            className="w-full bg-white hover:bg-gray-50 text-[#18314F] font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm border-2 border-gray-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Programar Descanso
          </button>
          <button
            onClick={handleReportSymptom}
            className="w-full bg-white hover:bg-gray-50 text-[#18314F] font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm border-2 border-gray-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Reportar Síntoma
          </button>
          <button
            onClick={handleHelpCenter}
            className="w-full bg-white hover:bg-gray-50 text-[#18314F] font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm border-2 border-gray-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Centro de Ayuda
          </button>
        </div>
      </div>

      {/* Actions de Cuenta */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-[#18314F] mb-6">Configuración de Cuenta</h3>
        <div className="flex flex-wrap gap-4">
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
          setConfirmTouched(false);
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
                setConfirmTouched(false);
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
              onBlur={() => setConfirmTouched(true)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#18314F] focus:border-transparent ${
                confirmTouched && confirmPassword && newPassword !== confirmPassword
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Confirma tu nueva contraseña"
            />
            {confirmTouched && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-red-500 text-sm mt-1">Las contraseñas no coinciden</p>
            )}
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

      {/* Help Center Modal */}
      <HelpCenterModal 
        isOpen={isHelpCenterModalOpen} 
        onClose={() => setIsHelpCenterModalOpen(false)} 
      />

      {/* Report Symptom Modal */}
      <ReportSymptomModal
        isOpen={isReportSymptomModalOpen}
        onClose={() => setIsReportSymptomModalOpen(false)}
      />

      {/* Delete Avatar Confirmation Modal */}
      <Modal
        isOpen={isDeleteAvatarModalOpen}
        onClose={() => setIsDeleteAvatarModalOpen(false)}
        title="Eliminar foto"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setIsDeleteAvatarModalOpen(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteAvatar}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Eliminando...' : 'Confirmar'}
            </button>
          </>
        }
      >
        <p className="text-gray-700">
          ¿Estás seguro de eliminar tu foto de perfil actual?
        </p>
      </Modal>
    </div>
  );
}
