/**
 * Employees List Page
 * Página de listado y gestión de empleados
 */

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { employeeService } from '../../services';
import { Table, Modal, SearchBar } from '../../components/common';
import { EmployeeForm } from '../../components/forms';
import type { Column, TableAction } from '../../components/common';
import type { Employee, CreateEmployeeData, UpdateEmployeeData } from '../../types';

export function EmployeesListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = Array.isArray(employees) 
        ? employees.filter(
            (emp) =>
              emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await employeeService.getAllEmployees();
      const employeesArray = Array.isArray(data) ? data : [];
      setEmployees(employeesArray);
      setFilteredEmployees(employeesArray);
    } catch (error: any) {
      console.error('Error loading employees:', error);
      toast.error(
        error.response?.status === 401 
          ? 'No autorizado. Por favor, inicia sesión nuevamente.' 
          : 'Error al cargar empleados'
      );
      setEmployees([]);
      setFilteredEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedEmployee(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateEmployeeData | UpdateEmployeeData) => {
    try {
      setIsSubmitting(true);
      if (selectedEmployee) {
        // Editar
        await employeeService.updateEmployee(selectedEmployee.id, data as UpdateEmployeeData);
        toast.success('Empleado actualizado correctamente');
      } else {
        // Crear
        await employeeService.createEmployee(data as CreateEmployeeData);
        toast.success('Empleado creado correctamente');
      }
      setIsFormModalOpen(false);
      setSelectedEmployee(null);
      loadEmployees();
    } catch (error: any) {
      console.error('Error saving employee:', error);
      toast.error(error.response?.data?.message || 'Error al guardar empleado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEmployee) return;

    try {
      await employeeService.deleteEmployee(selectedEmployee.id);
      toast.success('Empleado eliminado correctamente');
      setIsDeleteModalOpen(false);
      setSelectedEmployee(null);
      loadEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Error al eliminar empleado');
    }
  };

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const columns: Column<Employee>[] = [
    {
      key: 'employee_id',
      label: 'ID Empleado',
      className: 'font-mono text-[#18314F] font-semibold',
    },
    {
      key: 'first_name',
      label: 'Nombre',
      render: (emp) => (
        <span className="text-[#18314F] font-medium">
          {emp.first_name} {emp.last_name}
        </span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (emp) => <span className="text-gray-600">{emp.email}</span>,
    },
    {
      key: 'position',
      label: 'Puesto',
      render: (emp) => <span className="text-gray-700">{emp.position || 'sd'}</span>,
    },
    {
      key: 'department',
      label: 'Departamento',
      render: (emp) => <span className="text-gray-700">{emp.department || 'N/A'}</span>,
    },
    {
      key: 'supervisor',
      label: 'Supervisor',
      render: (emp) => (
        <span className="text-gray-600">
          {emp.supervisor_name || 'Admin Principal'}
        </span>
      ),
    },
    {
      key: 'is_active',
      label: 'Estado',
      render: (emp) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          emp.is_active 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {emp.is_active ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  const actions: TableAction<Employee>[] = [
    {
      label: 'Ver',
      onClick: handleViewDetails,
      className: 'text-blue-600 hover:text-blue-800 p-2',
      icon: (
        <svg
          width="20"
          height="20"
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
      className: 'text-gray-600 hover:text-gray-800 p-2',
      icon: (
        <svg
          width="20"
          height="20"
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
      className: 'text-red-600 hover:text-red-800 p-2',
      icon: (
        <svg
          width="20"
          height="20"
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
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-[#18314F] mb-1">Empleados</h1>
          <p className="text-lg text-[#18314F]/70">Gestión de empleados del sistema</p>
        </div>
        <button 
          className="bg-[#18314F] hover:bg-[#18314F]/90 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-all"
          onClick={handleCreate}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Empleado
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Empleados */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Total Empleados</span>
            <span className="bg-blue-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
          </div>
          <div className="text-4xl font-bold text-[#18314F]">{employees.length}</div>
        </div>

        {/* Activos */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Activos</span>
            <span className="bg-green-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#22C55E">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="text-4xl font-bold text-green-600">
            {employees.filter((e) => e.is_active).length}
          </div>
        </div>

        {/* Inactivos */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Inactivos</span>
            <span className="bg-red-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#EF4444">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="text-4xl font-bold text-red-600">
            {employees.filter((e) => !e.is_active).length}
          </div>
        </div>

        {/* Departamentos */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Departamentos</span>
            <span className="bg-purple-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#A855F7">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
          </div>
          <div className="text-4xl font-bold text-[#18314F]">
            {new Set(employees.map((e) => e.department).filter(Boolean)).size}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por nombre, email o ID..."
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18314F] bg-white text-gray-700">
            <option value="">Todos los departamentos</option>
            <option value="Logística">Logística</option>
            <option value="Producción">Producción</option>
            <option value="Operaciones">Operaciones</option>
            <option value="Recursos Humanos">Recursos Humanos</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18314F] bg-white text-gray-700">
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <Table
          data={filteredEmployees}
          columns={columns}
          actions={actions}
          keyExtractor={(emp) => emp.id}
          isLoading={isLoading}
          emptyMessage="No se encontraron empleados"
        />
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
        title={selectedEmployee ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}` : 'Empleado'}
        size="lg"
      >
        {selectedEmployee && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Empleado
                </label>
                <p className="font-mono text-[#18314F] font-semibold text-lg">{selectedEmployee.employee_id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  selectedEmployee.is_active 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {selectedEmployee.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{selectedEmployee.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <p className="text-gray-900">{selectedEmployee.phone || 'No especificado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Puesto
                </label>
                <p className="text-gray-900">{selectedEmployee.position}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento
                </label>
                <p className="text-gray-900">{selectedEmployee.department}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supervisor
                </label>
                <p className="text-gray-900">{selectedEmployee.supervisor_name || 'Sin asignar'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de ingreso
                </label>
                <p className="text-gray-900">{new Date(selectedEmployee.hire_date).toLocaleDateString()}</p>
              </div>
            </div>
            {selectedEmployee.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas
                </label>
                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">{selectedEmployee.notes}</p>
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
          setSelectedEmployee(null);
        }}
        title="Confirmar eliminación"
        size="sm"
        footer={
          <>
            <button
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedEmployee(null);
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
        {selectedEmployee && (
          <p className="text-gray-700">
            ¿Estás seguro de que deseas eliminar al empleado{' '}
            <strong className="text-[#18314F]">
              {selectedEmployee.first_name} {selectedEmployee.last_name}
            </strong>
            ? Esta acción no se puede deshacer.
          </p>
        )}
      </Modal>

      {/* Create/Edit Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedEmployee(null);
        }}
        title={selectedEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setIsFormModalOpen(false);
                setSelectedEmployee(null);
              }}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="employee-form"
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
                <>{selectedEmployee ? 'Actualizar' : 'Crear'} Empleado</>
              )}
            </button>
          </>
        }
      >
        <EmployeeForm
          initialData={selectedEmployee ? {
            email: selectedEmployee.email,
            first_name: selectedEmployee.first_name,
            last_name: selectedEmployee.last_name,
            phone: selectedEmployee.phone,
            department: selectedEmployee.department,
            position: selectedEmployee.position,
            supervisor: selectedEmployee.supervisor,
            is_active: selectedEmployee.is_active,
          } : undefined}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
          isEdit={!!selectedEmployee}
          formId="employee-form"
        />
      </Modal>
    </div>
  );
}
