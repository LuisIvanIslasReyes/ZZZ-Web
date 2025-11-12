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
      const filtered = employees.filter(
        (emp) =>
          emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Error al cargar empleados');
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
      className: 'font-mono',
    },
    {
      key: 'first_name',
      label: 'Nombre',
      render: (emp) => `${emp.first_name} ${emp.last_name}`,
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'position',
      label: 'Puesto',
    },
    {
      key: 'department',
      label: 'Departamento',
    },
    {
      key: 'supervisor',
      label: 'Supervisor',
      render: (emp) => emp.supervisor_name || 'Sin asignar',
    },
    {
      key: 'is_active',
      label: 'Estado',
      render: (emp) => (
        <span className={`badge ${emp.is_active ? 'badge-success' : 'badge-error'}`}>
          {emp.is_active ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  const actions: TableAction<Employee>[] = [
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
          <h1 className="text-3xl font-bold">Empleados</h1>
          <p className="text-base-content/60">Gestión de empleados del sistema</p>
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
          Nuevo Empleado
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Total Empleados</div>
          <div className="stat-value text-primary">{employees.length}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Activos</div>
          <div className="stat-value text-success">
            {employees.filter((e) => e.is_active).length}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Inactivos</div>
          <div className="stat-value text-error">
            {employees.filter((e) => !e.is_active).length}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Departamentos</div>
          <div className="stat-value">
            {new Set(employees.map((e) => e.department)).size}
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
              placeholder="Buscar por nombre, email o ID..."
              className="flex-1"
            />
            <select className="select select-bordered">
              <option value="">Todos los departamentos</option>
              <option value="IT">IT</option>
              <option value="Operaciones">Operaciones</option>
              <option value="Recursos Humanos">Recursos Humanos</option>
            </select>
            <select className="select select-bordered">
              <option value="">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <Table
            data={filteredEmployees}
            columns={columns}
            actions={actions}
            keyExtractor={(emp) => emp.id}
            isLoading={isLoading}
            emptyMessage="No se encontraron empleados"
          />
        </div>
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">ID Empleado</span>
                </label>
                <p className="font-mono">{selectedEmployee.employee_id}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Estado</span>
                </label>
                <span className={`badge ${selectedEmployee.is_active ? 'badge-success' : 'badge-error'}`}>
                  {selectedEmployee.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <p>{selectedEmployee.email}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Teléfono</span>
                </label>
                <p>{selectedEmployee.phone || 'No especificado'}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Puesto</span>
                </label>
                <p>{selectedEmployee.position}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Departamento</span>
                </label>
                <p>{selectedEmployee.department}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Supervisor</span>
                </label>
                <p>{selectedEmployee.supervisor_name || 'Sin asignar'}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Fecha de ingreso</span>
                </label>
                <p>{new Date(selectedEmployee.hire_date).toLocaleDateString()}</p>
              </div>
            </div>
            {selectedEmployee.notes && (
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Notas</span>
                </label>
                <p className="text-sm text-base-content/70">{selectedEmployee.notes}</p>
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
              className="btn"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedEmployee(null);
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
        {selectedEmployee && (
          <p>
            ¿Estás seguro de que deseas eliminar al empleado{' '}
            <strong>
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
          onCancel={() => {
            setIsFormModalOpen(false);
            setSelectedEmployee(null);
          }}
          isLoading={isSubmitting}
          isEdit={!!selectedEmployee}
        />
      </Modal>
    </div>
  );
}
