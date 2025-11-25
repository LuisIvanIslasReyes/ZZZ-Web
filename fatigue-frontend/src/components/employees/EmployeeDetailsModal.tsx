/**
 * Employee Details Modal Component
 * Modal para mostrar detalles completos de un empleado
 */

import { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { employeeService } from '../../services/employee.service';
import type { Employee } from '../../types';

interface EmployeeDetailsModalProps {
  employeeId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeeDetailsModal({ employeeId, isOpen, onClose }: EmployeeDetailsModalProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && employeeId) {
      loadEmployeeDetails();
    }
  }, [isOpen, employeeId]);

  const loadEmployeeDetails = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployeeById(employeeId);
      console.log('[EmployeeDetailsModal] Datos recibidos del endpoint:', data);
      setEmployee(data);
    } catch (error) {
      console.error('Error loading employee details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Empleado" size="md">
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <span className="loading loading-spinner loading-lg text-[#18314F]"></span>
        </div>
      ) : employee ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-[#18314F]">
              {employee.first_name[0]}{employee.last_name[0]}
            </div>
            <div>
              <div className="text-lg font-semibold text-[#18314F]">{employee.full_name}</div>
              <div className="text-sm text-gray-500">ID: {employee.employee_id}</div>
              <div className="text-xs mt-1 px-2 py-1 rounded bg-green-100 text-green-700 inline-block">
                {employee.is_active ? 'Activo' : 'Inactivo'}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500">Departamento</div>
              <div className="font-medium text-gray-800">{employee.department || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Posición</div>
              <div className="font-medium text-gray-800">{employee.position || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Email</div>
              <div className="font-medium text-gray-800 break-all">{employee.email}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Teléfono</div>
              <div className="font-medium text-gray-800">{employee.phone || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Supervisor</div>
              <div className="font-medium text-gray-800">{employee.supervisor_name || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Rol</div>
              <div className="font-medium text-gray-800">{employee.role}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Fecha de Alta</div>
              <div className="font-medium text-gray-800">{employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Creado</div>
              <div className="font-medium text-gray-800">{employee.created_at ? new Date(employee.created_at).toLocaleDateString() : '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Actualizado</div>
              <div className="font-medium text-gray-800">{employee.updated_at ? new Date(employee.updated_at).toLocaleDateString() : '-'}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">No se encontraron datos del empleado.</div>
      )}
    </Modal>
  );
}
