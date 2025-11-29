import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts';
import type { ApiError } from '../../types';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });

      // Redirigir según el rol del usuario o a la página previa
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      const apiError = err as ApiError;
      // Mostrar mensaje amigable según el tipo de error
      if (apiError.status === 400 || apiError.status === 401) {
        setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
      } else {
        setError(apiError.message || 'Error al iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('supervisor@example.com');
    setPassword('cualquiera');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18314F] to-[#14223A]">
      <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto p-4 gap-8">
        {/* Panel izquierdo */}
        <div className="flex-1 flex flex-col justify-center text-white pr-0 md:pr-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="rounded-full bg-white/10 p-3">
              {/* Icono escudo */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L19 6V11C19 16.52 15.36 20.74 12 21C8.64 20.74 5 16.52 5 11V6L12 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <div>
              <h1 className="text-3xl font-bold leading-tight">ZZZ Admin</h1>
              <p className="text-base text-white/80">Zero to Zero-Fatigue Zone</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mt-4 mb-2">Panel de Control Administrativo</h2>
          <p className="text-white/80 mb-6">Sistema de monitoreo integral de fatiga para empleados industriales. Supervisa en tiempo real el estado de salud de tu equipo y previene riesgos laborales.</p>
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
              <span className="bg-green-600/20 rounded-full p-2">
                {/* Icono corazón */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21C12 21 4 13.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.36 16 21 16 21H12Z" fill="#22C55E"/></svg>
              </span>
              <div>
                <p className="font-semibold">Monitoreo en Tiempo Real</p>
                <p className="text-sm text-white/70">Métricas fisiológicas continuas</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
              <span className="bg-yellow-500/20 rounded-full p-2">
                {/* Icono IA */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#FACC15" strokeWidth="2"/><path d="M8 12H16" stroke="#FACC15" strokeWidth="2" strokeLinecap="round"/></svg>
              </span>
              <div>
                <p className="font-semibold">Análisis Predictivo con IA</p>
                <p className="text-sm text-white/70">Prevención de fatiga laboral</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
              <span className="bg-red-500/20 rounded-full p-2">
                {/* Icono alerta */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8V12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1" fill="#EF4444"/><path d="M21 18H3L12 4L21 18Z" stroke="#EF4444" strokeWidth="2" strokeLinejoin="round"/></svg>
              </span>
              <div>
                <p className="font-semibold">Sistema de Alertas Inteligente</p>
                <p className="text-sm text-white/70">Notificaciones en tiempo real</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
              <span className="bg-white/10 rounded-full p-2">
                {/* Icono reporte */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 17V15C8 13.8954 8.89543 13 10 13H14C15.1046 13 16 13.8954 16 15V17" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><rect x="4" y="4" width="16" height="16" rx="4" stroke="#fff" strokeWidth="2"/></svg>
              </span>
              <div>
                <p className="font-semibold">Reportes Detallados</p>
                <p className="text-sm text-white/70">Análisis y estadísticas avanzadas</p>
              </div>
            </div>
          </div>
          <div className="flex gap-12 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold">60+</p>
              <p className="text-sm text-white/70">Empleados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-sm text-white/70">Monitoreo</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">99.8%</p>
              <p className="text-sm text-white/70">Uptime</p>
            </div>
          </div>
        </div>
        {/* Tarjeta de login */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Iniciar Sesión</h2>
            <p className="text-gray-500 mb-6">Ingresa tus credenciales para acceder al panel administrativo</p>
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    {/* Icono usuario */}
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="supervisor@example.com"
                    autoComplete="username"
                    required
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    {/* Icono candado */}
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="form-checkbox rounded border-gray-300"
                  />
                  Recordar sesión
                </label>
                <button type="button" className="text-blue-600 hover:underline">¿Olvidaste tu contraseña?</button>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#18314F] text-white font-semibold py-2 rounded-lg shadow hover:bg-[#14223A] transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Iniciando Sesión
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>
            <div className="mt-8 text-center text-xs text-gray-400">
              © 2025 Zero to Zero-Fatigue Zone. Sistema de Monitoreo Industrial.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
