/**
 * Employee Recommendations Page
 * Recomendaciones personalizadas para el empleado
 * Diseño ZZZ Admin Style
 */

export function EmployeeRecommendationsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#18314F] mb-1">My Recommendations</h1>
        <p className="text-lg text-[#18314F]/70">Recomendaciones personalizadas para mejorar tu bienestar</p>
      </div>

      {/* Content Placeholder */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-center justify-center h-[400px] text-gray-400">
          <p className="text-center">Las recomendaciones personalizadas estarán disponibles próximamente</p>
        </div>
      </div>
    </div>
  );
}
