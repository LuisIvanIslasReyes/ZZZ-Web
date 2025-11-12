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
          device.device_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (device.model?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
          (device.assigned_to_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'inactive':
        return 'badge-error';
      case 'maintenance':
        return 'badge-warning';
      default:
        return 'badge-ghost';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'maintenance':
        return 'Mantenimiento';
      default:
        return status;
    }
  };

  const columns: Column<Device>[] = [
    {
      key: 'device_id',
      label: 'ID Dispositivo',
      className: 'font-mono',
    },
    {
      key: 'model',
      label: 'Modelo',
    },
    {
      key: 'manufacturer',
      label: 'Fabricante',
    },
    {
      key: 'assigned_to_name',
      label: 'Asignado a',
      render: (device) => device.assigned_to_name || 'Sin asignar',
    },
    {
      key: 'status',
      label: 'Estado',
      render: (device) => (
        <span className={`badge ${getStatusColor(device.status)}`}>
          {getStatusLabel(device.status)}
        </span>
      ),
    },
    {
      key: 'battery_level',
      label: 'Batería',
      render: (device) => {
        const battery = device.battery_level;
        if (battery === null || battery === undefined) return 'N/A';
        
        let color = 'success';
        if (battery < 20) color = 'error';
        else if (battery < 50) color = 'warning';

        return (
          <div className="flex items-center gap-2">
            <progress
              className={`progress progress-${color} w-20`}
              value={battery}
              max="100"
            ></progress>
            <span className="text-xs">{battery}%</span>
          </div>
        );
      },
    },
    {
      key: 'last_sync',
      label: 'Última sincronización',
      render: (device) =>
        device.last_sync
          ? new Date(device.last_sync).toLocaleString()
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dispositivos</h1>
          <p className="text-base-content/60">Gestión de dispositivos de monitoreo</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Total Dispositivos</div>
          <div className="stat-value text-primary">{devices.length}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Activos</div>
          <div className="stat-value text-success">
            {devices.filter((d) => d.status === 'active').length}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">En Mantenimiento</div>
          <div className="stat-value text-warning">
            {devices.filter((d) => d.status === 'maintenance').length}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Asignados</div>
          <div className="stat-value">
            {devices.filter((d) => d.assigned_to).length}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por ID, modelo o asignado..."
              className="flex-1"
            />
            <select className="select select-bordered">
              <option value="">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="maintenance">En Mantenimiento</option>
            </select>
            <select className="select select-bordered">
              <option value="">Todos los fabricantes</option>
              <option value="Xiaomi">Xiaomi</option>
              <option value="Fitbit">Fitbit</option>
              <option value="Garmin">Garmin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <Table
            data={filteredDevices}
            columns={columns}
            actions={actions}
            keyExtractor={(device) => device.id}
            isLoading={isLoading}
            emptyMessage="No se encontraron dispositivos"
          />
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDevice(null);
        }}
        title={selectedDevice ? `Dispositivo ${selectedDevice.device_id}` : 'Dispositivo'}
        size="lg"
      >
        {selectedDevice && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">ID Dispositivo</span>
                </label>
                <p className="font-mono">{selectedDevice.device_id}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Estado</span>
                </label>
                <span className={`badge ${getStatusColor(selectedDevice.status)}`}>
                  {getStatusLabel(selectedDevice.status)}
                </span>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Modelo</span>
                </label>
                <p>{selectedDevice.model}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Fabricante</span>
                </label>
                <p>{selectedDevice.manufacturer}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Número de Serie</span>
                </label>
                <p className="font-mono text-sm">{selectedDevice.serial_number}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Versión Firmware</span>
                </label>
                <p>{selectedDevice.firmware_version}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Asignado a</span>
                </label>
                <p>{selectedDevice.assigned_to_name || 'Sin asignar'}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Nivel de Batería</span>
                </label>
                <div className="flex items-center gap-2">
                  <progress
                    className={`progress progress-${
                      selectedDevice.battery_level && selectedDevice.battery_level < 20
                        ? 'error'
                        : selectedDevice.battery_level && selectedDevice.battery_level < 50
                        ? 'warning'
                        : 'success'
                    } w-32`}
                    value={selectedDevice.battery_level || 0}
                    max="100"
                  ></progress>
                  <span>{selectedDevice.battery_level}%</span>
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Fecha de Compra</span>
                </label>
                <p>{selectedDevice.purchase_date ? new Date(selectedDevice.purchase_date).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Última Sincronización</span>
                </label>
                <p>
                  {selectedDevice.last_sync
                    ? new Date(selectedDevice.last_sync).toLocaleString()
                    : 'Nunca'}
                </p>
              </div>
            </div>
            {selectedDevice.notes && (
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Notas</span>
                </label>
                <p className="text-sm text-base-content/70">{selectedDevice.notes}</p>
              </div>
            )}
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
              className="btn"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedDevice(null);
              }}
            >
              Cancelar
            </button>
            <button className="btn btn-error" onClick={confirmDelete}>
              Eliminar
            </button>
          </>
        }
      >
        {selectedDevice && (
          <p>
            ¿Estás seguro de que deseas eliminar el dispositivo{' '}
            <strong>{selectedDevice.device_id}</strong>? Esta acción no se puede deshacer.
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
      >
        <DeviceForm
          initialData={selectedDevice || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormModalOpen(false);
            setSelectedDevice(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}
