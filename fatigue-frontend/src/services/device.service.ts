/**
 * Device Service
 * Servicio para gestión de dispositivos IoT
 */

import api from './api';
import type { Device, CreateDeviceData, UpdateDeviceData } from '../types/device.types';
import type { PaginatedResponse } from '../types/api.types';

class DeviceService {
  private readonly BASE_PATH = '/devices';

  /**
   * Obtener todos los dispositivos (paginado)
   */
  async getDevices(params?: {
    page?: number;
    page_size?: number;
    employee?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<Device>> {
    const response = await api.get<PaginatedResponse<Device>>(`${this.BASE_PATH}/`, { params });
    return response.data;
  }

  /**
   * Obtener todos los dispositivos (sin paginación)
   */
  async getAllDevices(): Promise<Device[]> {
    const response = await api.get<Device[]>(`${this.BASE_PATH}/all/`);
    return response.data;
  }

  /**
   * Obtener dispositivo por ID
   */
  async getDevice(id: number): Promise<Device> {
    const response = await api.get<Device>(`${this.BASE_PATH}/${id}/`);
    return response.data;
  }

  /**
   * Crear nuevo dispositivo
   */
  async createDevice(deviceData: CreateDeviceData): Promise<Device> {
    const response = await api.post<Device>(`${this.BASE_PATH}/`, deviceData);
    return response.data;
  }

  /**
   * Actualizar dispositivo
   */
  async updateDevice(id: number, deviceData: UpdateDeviceData): Promise<Device> {
    const response = await api.patch<Device>(`${this.BASE_PATH}/${id}/`, deviceData);
    return response.data;
  }

  /**
   * Eliminar dispositivo
   */
  async deleteDevice(id: number): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}/`);
  }

  /**
   * Obtener dispositivos por empleado
   */
  async getDevicesByEmployee(employeeId: number): Promise<Device[]> {
    const response = await api.get<PaginatedResponse<Device>>(`${this.BASE_PATH}/`, {
      params: { employee: employeeId, page_size: 100 }
    });
    return response.data.results;
  }

  /**
   * Obtener dispositivos activos
   */
  async getActiveDevices(): Promise<Device[]> {
    const response = await api.get<PaginatedResponse<Device>>(`${this.BASE_PATH}/`, {
      params: { status: 'active', page_size: 1000 }
    });
    return response.data.results;
  }

  /**
   * Actualizar batería del dispositivo
   */
  async updateBattery(id: number, batteryLevel: number): Promise<Device> {
    const response = await api.patch<Device>(`${this.BASE_PATH}/${id}/`, {
      battery_level: batteryLevel
    });
    return response.data;
  }

  /**
   * Obtener estadísticas de dispositivos
   */
  async getDeviceStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    maintenance: number;
    low_battery: number;
  }> {
    const response = await api.get(`${this.BASE_PATH}/stats/`);
    return response.data;
  }
}

export default new DeviceService();
