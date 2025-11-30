/**
 * Servicio de API para gestión de simuladores ESP32
 */
import api from './api';
import type {
  SimulatorSession,
  SimulatorSessionDetail,
  CreateSimulatorData,
  UpdateSimulatorConfigData,
  EmployeeForSimulator,
  SimulatorStats,
} from '../types/simulator.types';

const BASE_URL = '/simulators';

/**
 * Servicio de Simuladores
 */
export const simulatorService = {
  /**
   * Listar todas las sesiones de simuladores
   */
  async getAll(): Promise<SimulatorSession[]> {
    const response = await api.get<SimulatorSession[] | { results: SimulatorSession[] }>(`${BASE_URL}/`);
    // Manejar respuesta paginada o array directo
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && 'results' in response.data) {
      return response.data.results;
    }
    return [];
  },

  /**
   * Obtener detalle de una sesión
   */
  async getById(id: number): Promise<SimulatorSessionDetail> {
    const response = await api.get<SimulatorSessionDetail>(`${BASE_URL}/${id}/`);
    return response.data;
  },

  /**
   * Listar sesiones activas con estadísticas en tiempo real
   */
  async getActive(): Promise<SimulatorSession[]> {
    const response = await api.get<SimulatorSession[] | { results: SimulatorSession[] }>(`${BASE_URL}/active/`);
    // Manejar respuesta paginada o array directo
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && 'results' in response.data) {
      return response.data.results;
    }
    return [];
  },

  /**
   * Crear y arrancar un nuevo simulador
   */
  async create(data: CreateSimulatorData): Promise<SimulatorSessionDetail> {
    const response = await api.post<SimulatorSessionDetail>(`${BASE_URL}/`, data);
    return response.data;
  },

  /**
   * Detener un simulador específico
   */
  async stop(id: number): Promise<SimulatorSessionDetail> {
    const response = await api.post<SimulatorSessionDetail>(`${BASE_URL}/${id}/stop/`, {});
    return response.data;
  },

  /**
   * Reiniciar un simulador detenido
   */
  async restart(id: number): Promise<SimulatorSessionDetail> {
    const response = await api.post<SimulatorSessionDetail>(`${BASE_URL}/${id}/restart/`, {});
    return response.data;
  },

  /**
   * Eliminar un simulador
   */
  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/${id}/`);
  },

  /**
   * Actualizar configuración de un simulador en ejecución
   */
  async updateConfig(
    id: number,
    config: UpdateSimulatorConfigData
  ): Promise<SimulatorSessionDetail> {
    const response = await api.post<SimulatorSessionDetail>(
      `${BASE_URL}/${id}/update_config/`,
      config
    );
    return response.data;
  },

  /**
   * Obtener lista de empleados disponibles para asignar simuladores
   */
  async getAvailableEmployees(): Promise<EmployeeForSimulator[]> {
    const response = await api.get<EmployeeForSimulator[]>(
      `${BASE_URL}/available_employees/`
    );
    return response.data;
  },

  /**
   * Detener todos los simuladores activos
   */
  async stopAll(): Promise<{ message: string; count: number }> {
    const response = await api.post<{ message: string; count: number }>(
      `${BASE_URL}/stop_all/`
    );
    return response.data;
  },

  /**
   * Obtener estadísticas generales de simuladores
   */
  async getStats(): Promise<SimulatorStats> {
    const response = await api.get<SimulatorStats>(`${BASE_URL}/stats/`);
    return response.data;
  },
};

export default simulatorService;
