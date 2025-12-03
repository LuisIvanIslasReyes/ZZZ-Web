/**
 * Supervisor Profile Page
 * Perfil y configuración del supervisor
 * Diseño ZZZ Admin Style
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { authService, meService, employeeProfileService } from '../../services';
import { Modal } from '../../components/common';
import { EditProfileModal } from '../../components/forms/EditProfileModal';
import toast from 'react-hot-toast';
import type { User } from '../../types/user.types';

export function SupervisorProfilePage() {
  const navigate = useNavigate();
  const { logout, refreshUser } = useAuth();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isDeleteAvatarModalOpen, setIsDeleteAvatarModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await meService.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar perfil');
    }
  };

  const handleSaveProfile = async (updatedUser: Partial<User>) => {
    try {
      setIsLoading(true);
      await employeeProfileService.updateMyProfile(updatedUser);
      const refreshedUser = await meService.getMe();
      setUser(refreshedUser);
      await refreshUser();
      toast.success('Perfil actualizado');
      setIsEditProfileModalOpen(false);
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      toast.error(error?.response?.data?.detail || 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
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

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato no permitido. Usa JPG, PNG, GIF o WEBP');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar 5MB');
      return;
    }

    try {
      setIsLoading(true);
      setImageError(false);
      await employeeProfileService.uploadAvatar(file);
      await loadUserData();
      await refreshUser();
      toast.success('Foto actualizada exitosamente');
    } catch (error: any) {
      console.error('Error al actualizar foto:', error);
      toast.error(error?.response?.data?.detail || 'Error al actualizar la foto');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-start gap-6">
          <div className="avatar placeholder relative">
            <div className="bg-[#18314F]/10 text-[#18314F] rounded-lg w-32 h-32 flex items-center justify-center overflow-hidden">
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
              Supervisor
            </p>
            <div className="flex gap-4">
              <button
                className="bg-[#18314F] hover:bg-[#18314F]/90 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
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
                className="bg-white hover:bg-gray-50 text-[#18314F] font-semibold py-2 px-6 rounded-lg border-2 border-[#18314F] transition-colors"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : user?.avatar_url ? 'Cambiar Foto' : 'Subir Foto'}
              </button>
              {user?.avatar_url && (
                <button 
                  className="bg-white hover:bg-red-50 text-red-600 font-semibold py-2 px-6 rounded-lg border-2 border-red-300 transition-colors"
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

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#18314F] mb-6">Información Personal</h3>
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
        </div>
      </div>

      {/* Account Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#18314F] mb-6">Configuración de Cuenta</h3>
        <button 
          className="bg-[#18314F] hover:bg-[#18314F]/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          onClick={() => setIsChangePasswordModalOpen(true)}
        >
          Cambiar Contraseña
        </button>
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
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleChangePassword}
              disabled={isLoading}
              className="px-6 py-3 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#18314F] focus:ring-2 focus:ring-[#18314F]/20"
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#18314F] focus:ring-2 focus:ring-[#18314F]/20"
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
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#18314F]/20 ${
                confirmTouched && confirmPassword && newPassword !== confirmPassword
                  ? 'border-red-500'
                  : 'border-gray-200 focus:border-[#18314F]'
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
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteAvatar}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
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
