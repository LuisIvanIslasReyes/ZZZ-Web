/**
 * Employee Profile Page
 * Perfil y configuración del empleado
 * Diseño ZZZ Admin Style
 */

export function EmployeeProfilePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#18314F] mb-1">My Profile</h1>
        <p className="text-lg text-[#18314F]/70">Información personal y configuración de cuenta</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-start gap-6">
          <div className="avatar placeholder">
            <div className="bg-[#18314F]/10 text-[#18314F] rounded-2xl w-32 h-32 flex items-center justify-center">
              <span className="font-bold text-5xl">JD</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-[#18314F] mb-2">John Doe</h2>
            <p className="text-gray-600 mb-4">ID: EMP-2024-001 | Departamento: Producción</p>
            <div className="flex gap-4">
              <button className="bg-[#18314F] hover:bg-[#18314F]/90 text-white font-medium py-2 px-6 rounded-xl transition-colors">
                Editar Perfil
              </button>
              <button className="bg-white hover:bg-gray-50 text-[#18314F] font-medium py-2 px-6 rounded-xl border-2 border-[#18314F] transition-colors">
                Cambiar Foto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Information Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-[#18314F] mb-6">Información Personal</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">Nombre Completo</label>
              <p className="text-lg text-[#18314F]">John Doe</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Email</label>
              <p className="text-lg text-[#18314F]">john.doe@company.com</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Teléfono</label>
              <p className="text-lg text-[#18314F]">+52 555 123 4567</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Fecha de Nacimiento</label>
              <p className="text-lg text-[#18314F]">15/03/1990</p>
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-[#18314F] mb-6">Información Laboral</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">Departamento</label>
              <p className="text-lg text-[#18314F]">Producción</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Puesto</label>
              <p className="text-lg text-[#18314F]">Operador de Línea</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Turno</label>
              <p className="text-lg text-[#18314F]">Turno A (06:00 - 14:00)</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Fecha de Ingreso</label>
              <p className="text-lg text-[#18314F]">01/01/2020</p>
            </div>
          </div>
        </div>
      </div>

      {/* Device Information */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-[#18314F] mb-6">Información del Dispositivo</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">ID del Dispositivo</p>
            <p className="text-lg font-semibold text-[#18314F]">DEV-001</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Modelo</p>
            <p className="text-lg font-semibold text-[#18314F]">FatigueWatch Pro</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Firmware</p>
            <p className="text-lg font-semibold text-[#18314F]">v2.4.1</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Estado</p>
            <p className="text-lg font-semibold text-green-600">Activo</p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-[#18314F] mb-6">Preferencias y Notificaciones</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-[#18314F]">Notificaciones por Email</p>
              <p className="text-sm text-gray-600">Recibe alertas y actualizaciones por correo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#18314F]"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-[#18314F]">Alertas en Dispositivo</p>
              <p className="text-sm text-gray-600">Vibración cuando se detecta fatiga alta</p>
            </div>
            <label className="relative inline-flex items-cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#18314F]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-[#18314F]">Recordatorios de Descanso</p>
              <p className="text-sm text-gray-600">Sugerencias automáticas de pausas</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#18314F]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-[#18314F] mb-6">Acciones de Cuenta</h3>
        <div className="flex gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors">
            Cambiar Contraseña
          </button>
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-xl transition-colors">
            Descargar Mis Datos
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-xl transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
