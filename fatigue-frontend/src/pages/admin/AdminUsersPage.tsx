/**
 * Admin Users Management Page
 * Gestión de usuarios administradores (solo superusuarios)
 */

import { useState, useEffect } from 'react';
import { adminUsersService } from '../../services';
import type { AdminUser, CreateAdminUserData, UpdateAdminUserData } from '../../types';
import { LoadingSpinner, Modal } from '../../components/common';
import { toast } from 'react-hot-toast';

export function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await adminUsersService.getAdminUsers();
      setAdmins(data);
    } catch (error) {
      console.error('Error cargando administradores:', error);
      toast.error('Error al cargar usuarios administradores');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (admin: AdminUser) => {
    if (!window.confirm(`¿Eliminar al administrador ${admin.full_name}?`)) {
      return;
    }

    try {
      await adminUsersService.deleteAdminUser(admin.id);
      toast.success('Administrador eliminado exitosamente');
      loadAdmins();
    } catch (error) {
      console.error('Error eliminando administrador:', error);
      toast.error('Error al eliminar administrador');
    }
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Usuarios Administradores</h1>
        <p className="text-gray-600">Gestión de usuarios con permisos administrativos</p>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-96">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full md:w-auto bg-[#18314F] hover:bg-[#18314F]/90 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Administrador
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Administradores</p>
          <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Superusuarios</p>
          <p className="text-2xl font-bold text-purple-600">
            {admins.filter(a => a.is_superuser).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Staff</p>
          <p className="text-2xl font-bold text-blue-600">
            {admins.filter(a => a.is_staff).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Activos</p>
          <p className="text-2xl font-bold text-green-600">
            {admins.filter(a => a.is_active).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Permisos
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Último Acceso
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg">No se encontraron administradores</p>
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{admin.full_name}</p>
                        <p className="text-sm text-gray-500">{admin.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {admin.is_superuser && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                            SUPER
                          </span>
                        )}
                        {admin.is_staff && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                            STAFF
                          </span>
                        )}
                        {!admin.is_superuser && !admin.is_staff && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                            BÁSICO
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {admin.is_active ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Activo
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {admin.last_login
                        ? new Date(admin.last_login).toLocaleDateString('es-ES')
                        : 'Nunca'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setShowCreateModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(admin)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <AdminUserModal
          admin={selectedAdmin}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedAdmin(null);
          }}
          onSuccess={() => {
            setShowCreateModal(false);
            setSelectedAdmin(null);
            loadAdmins();
          }}
        />
      )}
    </div>
  );
}

// Modal Component
interface AdminUserModalProps {
  admin: AdminUser | null;
  onClose: () => void;
  onSuccess: () => void;
}

function AdminUserModal({ admin, onClose, onSuccess }: AdminUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateAdminUserData>({
    email: admin?.email || '',
    password: '',
    password_confirm: '',
    first_name: admin?.first_name || '',
    last_name: admin?.last_name || '',
    is_active: admin?.is_active ?? true,
    is_staff: admin?.is_staff ?? false,
    is_superuser: admin?.is_superuser ?? false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!admin && formData.password !== formData.password_confirm) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (!admin && formData.password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      setLoading(true);
      
      if (admin) {
        // Actualizar
        const updateData: UpdateAdminUserData = {
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          is_active: formData.is_active,
          is_staff: formData.is_staff,
          is_superuser: formData.is_superuser,
        };
        await adminUsersService.updateAdminUser(admin.id, updateData);
        toast.success('Administrador actualizado exitosamente');
      } else {
        // Crear
        await adminUsersService.createAdminUser(formData);
        toast.success('Administrador creado exitosamente');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error guardando administrador:', error);
      const errorMsg = error.response?.data?.error || 
                      error.response?.data?.message ||
                      'Error al guardar administrador';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={admin ? 'Editar Administrador' : 'Nuevo Administrador'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Información Personal */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Información Personal</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Contraseña (solo crear) */}
        {!admin && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Seguridad</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password_confirm}
                  onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Permisos */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Permisos y Estado</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 text-[#18314F] border-gray-300 rounded focus:ring-[#18314F]"
              />
              <div>
                <span className="font-medium text-gray-900">Usuario Activo</span>
                <p className="text-xs text-gray-500">El usuario puede acceder al sistema</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_staff}
                onChange={(e) => setFormData({ ...formData, is_staff: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">Staff</span>
                <p className="text-xs text-gray-500">Acceso al panel de administración</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_superuser}
                onChange={(e) => setFormData({ ...formData, is_superuser: e.target.checked })}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <div>
                <span className="font-medium text-gray-900">Superusuario</span>
                <p className="text-xs text-gray-500">Permisos totales en el sistema</p>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : admin ? 'Actualizar' : 'Crear Administrador'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
