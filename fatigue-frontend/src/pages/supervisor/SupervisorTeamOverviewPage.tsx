/**
 * Supervisor Team Overview Page
 * Vista general del equipo con detalles de cada empleado
 * Diseño ZZZ Admin Style
 */

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { employeeService } from '../../services';
import { LoadingSpinner } from '../../components/common';
import { EmployeeFormModal } from '../../components/forms';
import type { Employee } from '../../types';

export function SupervisorTeamOverviewPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'normal' | 'warning' | 'critical'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await employeeService.getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Error al cargar los empleados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEmployee = async (data: any) => {
    try {
      setIsSubmitting(true);
      await employeeService.createEmployee(data);
      toast.success('Empleado creado exitosamente');
      setIsModalOpen(false);
      setEditingEmployee(null);
      await loadEmployees();
    } catch (error: any) {
      console.error('Error creating employee:', error);
      toast.error(error?.response?.data?.message || 'Error al crear el empleado');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEmployee = async (data: any) => {
    if (!editingEmployee) return;
    try {
      setIsSubmitting(true);
      await employeeService.updateEmployee(editingEmployee.id, data);
      toast.success('Empleado actualizado exitosamente');
      setIsModalOpen(false);
      setEditingEmployee(null);
      await loadEmployees();
    } catch (error: any) {
      console.error('Error updating employee:', error);
      toast.error(error?.response?.data?.message || 'Error al actualizar el empleado');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (data: any) => {
    if (editingEmployee) {
      await handleUpdateEmployee(data);
    } else {
      await handleCreateEmployee(data);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const getRiskLevel = (fatigueScore: number) => {
    if (fatigueScore >= 70) return 'critical';
    if (fatigueScore >= 50) return 'warning';
    return 'normal';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'critical': return 'Crítico';
      case 'warning': return 'Advertencia';
      default: return 'Normal';
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    // Simular nivel de riesgo basado en algún criterio
    const riskLevel = getRiskLevel(Math.random() * 100); // En producción esto vendría del backend
    return matchesSearch && riskLevel === filterStatus;
  });

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Cargando equipo..." />;
  }

  const criticalCount = Math.floor(employees.length * 0.1);
  const warningCount = Math.floor(employees.length * 0.2);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#18314F] mb-1">Team Overview</h1>
          <p className="text-lg text-[#18314F]/70">Vista detallada de todos los miembros de tu equipo</p>
        </div>
        <button 
          className="bg-[#18314F] hover:bg-[#18314F]/90 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Empleado
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Total Empleados</span>
            <span className="bg-blue-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </span>
          </div>
          <span className="text-4xl font-bold text-[#18314F]">{employees.length}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Estado Normal</span>
            <span className="bg-green-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#22C55E"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
          </div>
          <span className="text-4xl font-bold text-green-600">{employees.length - criticalCount - warningCount}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">En Observación</span>
            <span className="bg-yellow-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#FACC15"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </span>
          </div>
          <span className="text-4xl font-bold text-yellow-600">{warningCount}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-base font-medium">Estado Crítico</span>
            <span className="bg-red-100 rounded-full p-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#EF4444"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
          </div>
          <span className="text-4xl font-bold text-red-600">{criticalCount}</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#18314F] focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filterStatus === 'all' 
                  ? 'bg-[#18314F] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterStatus('normal')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filterStatus === 'normal' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setFilterStatus('warning')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filterStatus === 'warning' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Advertencia
            </button>
            <button
              onClick={() => setFilterStatus('critical')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filterStatus === 'critical' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Crítico
            </button>
          </div>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => {
          const fatigueLevel = Math.floor(Math.random() * 100);
          const riskLevel = getRiskLevel(fatigueLevel);
          const heartRate = Math.floor(60 + Math.random() * 40);
          
          return (
            <div key={employee.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-[#18314F]/10 text-[#18314F] rounded-xl w-12 h-12 flex items-center justify-center">
                      <span className="font-bold text-lg">
                        {employee.first_name[0]}{employee.last_name[0]}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#18314F]">
                      {employee.first_name} {employee.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">ID: {employee.employee_id}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(riskLevel)}`}>
                  {getRiskLabel(riskLevel)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nivel de Fatiga</span>
                  <span className="font-semibold text-[#18314F]">{fatigueLevel}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      riskLevel === 'critical' ? 'bg-red-600' : 
                      riskLevel === 'warning' ? 'bg-yellow-500' : 
                      'bg-green-600'
                    }`}
                    style={{ width: `${fatigueLevel}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" fill="#EF4444" viewBox="0 0 24 24">
                      <path d="M12 21C12 21 4 13.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.36 16 21 16 21H12Z"/>
                    </svg>
                    <span className="text-sm text-gray-600">FC: {heartRate} BPM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${employee.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-600">
                      {employee.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                <button 
                  onClick={() => handleEdit(employee)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#18314F] font-medium py-2 px-4 rounded-xl transition-colors text-sm"
                >
                  Editar
                </button>
                <button className="flex-1 bg-[#18314F] hover:bg-[#18314F]/90 text-white font-medium py-2 px-4 rounded-xl transition-colors text-sm">
                  Ver Detalles
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <svg className="mx-auto mb-4" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#18314F">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-xl font-semibold text-[#18314F] mb-2">No se encontraron empleados</h3>
          <p className="text-gray-500">Intenta con otros filtros o términos de búsqueda</p>
        </div>
      )}

      {/* Employee Form Modal */}
      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingEmployee}
        isLoading={isSubmitting}
      />
    </div>
  );
}
