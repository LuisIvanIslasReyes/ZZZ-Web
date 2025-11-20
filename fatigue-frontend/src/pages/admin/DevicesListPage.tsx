/**
 * Devices List Page
 * Página de listado y gestión de dispositivos
 */

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { deviceService } from '../../services';
import { Table, Modal, SearchBar } from '../../components/common';
import { DeviceForm } from '../../components/forms';
import type { Column, TableAction } from '../../components/common';
import type { Device } from '../../types';

export function DevicesListPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDevices(devices);
    } else {
      const filtered = devices.filter(
        (device) =>
          device.device_identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (device.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
          (device.employee_email?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
      setFilteredDevices(filtered);
    }
  }, [searchTerm, devices]);

  const loadDevices = async () => {
    try {
      setIsLoading(true);
      const data = await deviceService.getAllDevices();
      setDevices(data);
      setFilteredDevices(data);
    } catch (error) {
      console.error('Error loading devices:', error);
      toast.error('Error al cargar dispositivos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedDevice(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (device: Device) => {
    setSelectedDevice(device);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (selectedDevice) {
        // Editar dispositivo existente
        await deviceService.updateDevice(selectedDevice.id, data);
        toast.success('Dispositivo actualizado correctamente');
      } else {
        // Crear nuevo dispositivo
        await deviceService.createDevice(data);
        toast.success('Dispositivo creado correctamente');
      }
      setIsFormModalOpen(false);
      setSelectedDevice(null);
      loadDevices();
    } catch (error: any) {
      console.error('Error saving device:', error);
      toast.error(error.response?.data?.detail || 'Error al guardar dispositivo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (device: Device) => {
    setSelectedDevice(device);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDevice) return;

    try {
      await deviceService.deleteDevice(selectedDevice.id);
      toast.success('Dispositivo eliminado correctamente');
      setIsDeleteModalOpen(false);
      setSelectedDevice(null);
      loadDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
      toast.error('Error al eliminar dispositivo');
    }
  };

  const handleViewDetails = (device: Device) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const getActiveStatusBadge = (isActive: boolean) => {
    return isActive ? 'badge-success' : 'badge-error';
  };

  const getActiveStatusLabel = (isActive: boolean) => {
    return isActive ? 'Activo' : 'Inactivo';
  };

  const columns: Column<Device>[] = [
    {
      key: 'device_identifier',
      label: 'ID Dispositivo',
      className: 'font-mono',
    },
    {
      key: 'employee_name',
      label: 'Empleado',
      render: (device) => device.employee_name || 'Sin asignar',
    },
    {
      key: 'employee_email',
      label: 'Email',
      render: (device) => device.employee_email || '-',
    },
    {
      key: 'is_active',
      label: 'Estado',
      render: (device) => (
        <span className={`badge ${getActiveStatusBadge(device.is_active)}`}>
          {getActiveStatusLabel(device.is_active)}
        </span>
      ),
    },
    {
      key: 'last_connection',
      label: 'Última conexión',
      render: (device) =>
        device.last_connection
          ? new Date(device.last_connection).toLocaleString()
          : 'Nunca',
    },
  ];

  const actions: TableAction<Device>[] = [
    {
      label: 'Ver',
      onClick: handleViewDetails,
      className: 'btn btn-ghost btn-sm',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
    },
    {
      label: 'Editar',
      onClick: handleEdit,
      className: 'btn btn-ghost btn-sm',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      label: 'Eliminar',
      onClick: handleDelete,
      className: 'btn btn-ghost btn-sm text-error',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#18314F]">Dispositivos</h1>
          <p className="text-gray-600 mt-1">Gestión de dispositivos de monitoreo</p>
        </div>
        <button 
          className="px-6 py-3 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md"
          onClick={handleCreate}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nuevo Dispositivo
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Dispositivos</p>
              <p className="text-3xl font-bold text-[#18314F] mt-2">{devices.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-[#18314F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Activos</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {devices.filter((d) => d.is_active).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Inactivos</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {devices.filter((d) => !d.is_active).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por identificador, empleado o email..."
            className="flex-1"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white">
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <Table
          data={filteredDevices}
          columns={columns}
          actions={actions}
          keyExtractor={(device) => device.id}
          isLoading={isLoading}
          emptyMessage="No se encontraron dispositivos"
        />
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDevice(null);
        }}
        title={selectedDevice ? `Dispositivo ${selectedDevice.device_identifier}` : 'Dispositivo'}
        size="lg"
      >
        {selectedDevice && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Identificador</span>
                </label>
                <p className="font-mono">{selectedDevice.device_identifier}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Estado</span>
                </label>
                <span className={`badge ${getActiveStatusBadge(selectedDevice.is_active)}`}>
                  {getActiveStatusLabel(selectedDevice.is_active)}
                </span>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Empleado</span>
                </label>
                <p>{selectedDevice.employee_name || 'Sin asignar'}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <p className="text-sm">{selectedDevice.employee_email || '-'}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Supervisor</span>
                </label>
                <p>{selectedDevice.supervisor_name || '-'}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Última Conexión</span>
                </label>
                <p className="text-sm">
                  {selectedDevice.last_connection
                    ? new Date(selectedDevice.last_connection).toLocaleString()
                    : 'Nunca'}
                </p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Creado</span>
                </label>
                <p className="text-sm">{new Date(selectedDevice.created_at).toLocaleString()}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Actualizado</span>
                </label>
                <p className="text-sm">{new Date(selectedDevice.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDevice(null);
        }}
        title="Confirmar eliminación"
        size="sm"
        footer={
          <>
            <button
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedDevice(null);
              }}
            >
              Cancelar
            </button>
            <button 
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              onClick={confirmDelete}
            >
              Eliminar
            </button>
          </>
        }
      >
        {selectedDevice && (
          <p className="text-gray-700">
            ¿Estás seguro de que deseas eliminar el dispositivo{' '}
            <strong className="text-[#18314F]">{selectedDevice.device_identifier}</strong>? Esta acción no se puede deshacer.
          </p>
        )}
      </Modal>

      {/* Create/Edit Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedDevice(null);
        }}
        title={selectedDevice ? 'Editar Dispositivo' : 'Nuevo Dispositivo'}
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setIsFormModalOpen(false);
                setSelectedDevice(null);
              }}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="device-form"
              className="px-6 py-3 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Guardando...
                </span>
              ) : (
                <>{selectedDevice ? 'Actualizar' : 'Crear'} Dispositivo</>
              )}
            </button>
          </>
        }
      >
        <DeviceForm
          initialData={selectedDevice || undefined}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          formId="device-form"
        />
      </Modal>
    </div>
  );
}
