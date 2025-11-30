/**
 * Supervisor Devices Page
 * Página de visualización de dispositivos del equipo del supervisor
 * Diseño ZZZ Admin Style
 */

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { deviceService } from '../../services';
import { LoadingSpinner, Modal } from '../../components/common';
import { DeviceFormModal } from '../../components/forms';
import type { Device } from '../../types';

export function SupervisorDevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    let filtered = devices;

    // Filtrar por búsqueda
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(
        (device) =>
          device.device_identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (device.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
          (device.employee_email?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter((device) => 
        statusFilter === 'active' ? device.is_active : !device.is_active
      );
    }

    setFilteredDevices(filtered);
  }, [searchTerm, statusFilter, devices]);

  const loadDevices = async () => {
    try {
      setIsLoading(true);
      // Los supervisores solo ven dispositivos de su equipo
      const response = await deviceService.getDevices();
      const data = Array.isArray(response) ? response : response.results || [];
      setDevices(data);
      setFilteredDevices(data);
    } catch (error) {
      console.error('Error loading devices:', error);
      toast.error('Error al cargar dispositivos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDevice = async (data: any) => {
    try {
      setIsSubmitting(true);
      await deviceService.createDevice(data);
      toast.success('Dispositivo creado exitosamente');
      setIsFormModalOpen(false);
      setEditingDevice(null);
      await loadDevices();
    } catch (error: any) {
      console.error('Error creating device:', error);
      toast.error(error?.response?.data?.message || 'Error al crear el dispositivo');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDevice = async (data: any) => {
    if (!editingDevice) return;
    try {
      setIsSubmitting(true);
      await deviceService.updateDevice(editingDevice.id, data);
      toast.success('Dispositivo actualizado exitosamente');
      setIsFormModalOpen(false);
      setEditingDevice(null);
      await loadDevices();
    } catch (error: any) {
      console.error('Error updating device:', error);
      toast.error(error?.response?.data?.message || 'Error al actualizar el dispositivo');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitDevice = async (data: any) => {
    if (editingDevice) {
      await handleUpdateDevice(data);
    } else {
      await handleCreateDevice(data);
    }
  };

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingDevice(null);
  };

  const handleViewDetails = (device: Device) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Cargando dispositivos..." />;
  }

  const activeDevices = devices.filter((d) => d.is_active).length;
  const inactiveDevices = devices.filter((d) => !d.is_active).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#18314F] mb-1">Dispositivos del Equipo</h1>
          <p className="text-lg text-[#18314F]/70">Monitoreo de dispositivos asignados a tu equipo</p>
        </div>
        <button 
          className="bg-[#18314F] hover:bg-[#18314F]/90 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
          onClick={() => setIsFormModalOpen(true)}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Dispositivo
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Dispositivos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-semibold">Total Dispositivos</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-[#18314F]">{devices.length}</span>
        </div>

        {/* Activos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-semibold">Activos</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#22C55E">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-[#18314F]">{activeDevices}</span>
            <span className="text-green-600 font-semibold text-sm mb-1">
              {devices.length > 0 ? Math.round((activeDevices / devices.length) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Inactivos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-semibold">Inactivos</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#EF4444">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-[#18314F]">{inactiveDevices}</span>
            <span className="text-red-600 font-semibold text-sm mb-1">
              {devices.length > 0 ? Math.round((inactiveDevices / devices.length) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar por identificador, empleado o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-lg focus:border-[#18314F] focus:ring-2 focus:ring-[#18314F]/20 transition-all"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select 
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#18314F] focus:ring-2 focus:ring-[#18314F]/20 bg-white transition-all"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Devices Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-[#18314F] mb-6">Dispositivos del Equipo</h2>
        
        {filteredDevices.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-lg">No se encontraron dispositivos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">ID Dispositivo</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Empleado</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Última Conexión</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="font-mono text-sm font-medium text-[#18314F]">
                          {device.device_identifier}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-900 font-medium">
                        {device.employee_name || 'Sin asignar'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600 text-sm">
                        {device.employee_email || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        device.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {device.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600 text-sm">
                        {device.last_connection
                          ? new Date(device.last_connection).toLocaleString()
                          : 'Nunca'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                          onClick={() => handleEdit(device)}
                        >
                          Editar
                        </button>
                        <button
                          className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                          onClick={() => handleViewDetails(device)}
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Device Details Modal */}
      <Modal
        isOpen={isModalOpen && selectedDevice !== null}
        onClose={handleCloseModal}
        title="Detalles del Dispositivo"
        footer={
          <button
            onClick={handleCloseModal}
            className="px-6 py-3 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-xl font-semibold transition-colors"
          >
            Cerrar
          </button>
        }
      >
        {selectedDevice && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Identificador
              </label>
              <p className="mt-1 font-mono text-[#18314F] font-medium">
                {selectedDevice.device_identifier}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </label>
              <p className="mt-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedDevice.is_active 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {selectedDevice.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Empleado
              </label>
              <p className="mt-1 text-[#18314F] font-medium">
                {selectedDevice.employee_name || 'Sin asignar'}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </label>
              <p className="mt-1 text-gray-700">
                {selectedDevice.employee_email || '-'}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Supervisor
              </label>
              <p className="mt-1 text-gray-700">
                {selectedDevice.supervisor_name || '-'}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Última Conexión
              </label>
              <p className="mt-1 text-gray-700">
                {selectedDevice.last_connection
                  ? new Date(selectedDevice.last_connection).toLocaleString()
                  : 'Nunca'}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Creado
              </label>
              <p className="mt-1 text-gray-700">
                {new Date(selectedDevice.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Última Actualización
              </label>
              <p className="mt-1 text-gray-700">
                {new Date(selectedDevice.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Device Form Modal */}
      <DeviceFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleSubmitDevice}
        initialData={editingDevice}
        isLoading={isSubmitting}
      />
    </div>
  );
}
