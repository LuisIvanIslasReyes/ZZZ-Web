/**
 * Employee Recommendations Page
 * Recomendaciones personalizadas para el empleado
 * Diseño ZZZ Admin Style
 */

export function EmployeeRecommendationsPage() {
  const recommendations = [
    {
      id: 1,
      icon: '💤',
      title: 'Mejora tu Descanso',
      description: 'Intenta dormir al menos 8 horas por noche. Tu promedio actual es de 7.2 horas.',
      priority: 'high',
      category: 'Sueño',
    },
    {
      id: 2,
      icon: '🧘',
      title: 'Pausas Activas',
      description: 'Toma descansos de 5 minutos cada hora. Realiza estiramientos suaves.',
      priority: 'medium',
      category: 'Actividad',
    },
    {
      id: 3,
      icon: '💧',
      title: 'Hidratación Adecuada',
      description: 'Mantén una botella de agua cerca. Meta: 2 litros al día.',
      priority: 'medium',
      category: 'Nutrición',
    },
    {
      id: 4,
      icon: '🍎',
      title: 'Alimentación Saludable',
      description: 'Incluye más frutas y verduras en tu dieta diaria.',
      priority: 'low',
      category: 'Nutrición',
    },
    {
      id: 5,
      icon: '🚶',
      title: 'Actividad Física',
      description: 'Realiza al menos 30 minutos de ejercicio moderado al día.',
      priority: 'high',
      category: 'Actividad',
    },
    {
      id: 6,
      icon: '🧠',
      title: 'Manejo del Estrés',
      description: 'Practica técnicas de respiración y meditación para reducir el estrés.',
      priority: 'medium',
      category: 'Mental',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta Prioridad';
      case 'medium': return 'Prioridad Media';
      default: return 'Prioridad Baja';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#18314F] mb-1">My Recommendations</h1>
        <p className="text-lg text-[#18314F]/70">Recomendaciones personalizadas para mejorar tu bienestar</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-md p-2 flex gap-2">
        <button className="flex-1 py-3 bg-[#18314F] text-white rounded-xl font-semibold">Todas</button>
        <button className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold">Sueño</button>
        <button className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold">Actividad</button>
        <button className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold">Nutrición</button>
        <button className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold">Mental</button>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="text-5xl">{rec.icon}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-[#18314F]">{rec.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(rec.priority)}`}>
                    {getPriorityLabel(rec.priority)}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{rec.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Categoría: {rec.category}</span>
                  <div className="flex gap-2">
                    <button className="bg-[#18314F] hover:bg-[#18314F]/90 text-white font-medium py-2 px-4 rounded-xl transition-colors text-sm">
                      Marcar como Completada
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-[#18314F] font-medium py-2 px-4 rounded-xl transition-colors text-sm">
                      Más Info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#18314F] mb-6">Progreso de Recomendaciones</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Completadas esta semana</span>
              <span className="text-sm font-bold text-[#18314F]">4 de 6</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-600 h-3 rounded-full" style={{ width: '67%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total completadas este mes</span>
              <span className="text-sm font-bold text-[#18314F]">15 de 24</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full" style={{ width: '62%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
