/**
 * Login Page - Premium Design Navy Blue Two Column
 * Página de inicio de sesión con diseño profesional y sofisticado
 * Inspirado en ZZZ Admin - Sistema de Monitoreo Industrial
 */

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as any)?.from?.pathname || null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });

      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 overflow-auto">
      {/* Fondo Informativo - Navy Azul */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Sección Izquierda - Información */}
          <div className="text-white hidden lg:flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="mb-10 animate-fade-in">
                <h1 className="text-4xl font-bold mb-2">Zero to Zero-Fatigue Zone</h1>
                <p className="text-base text-white/70">Sistema de Monitoreo Inteligente</p>
              </div>

              {/* Descripción */}
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-3">Bienvenido</h2>
                <p className="text-white/80 text-sm leading-relaxed">
                  Plataforma integral para el monitoreo de fatiga laboral. Supervisa, analiza y previene con inteligencia artificial.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/30 transition-colors border border-emerald-500/30 group-hover:border-emerald-500/50">
                    <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Monitoreo en Tiempo Real</h3>
                    <p className="text-white/70 text-xs mt-1">Métricas fisiológicas continuas</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/30 transition-colors border border-amber-500/30 group-hover:border-amber-500/50">
                    <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Análisis Predictivo con IA</h3>
                    <p className="text-white/70 text-xs mt-1">Prevención de fatiga laboral</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/30 transition-colors border border-red-500/30 group-hover:border-red-500/50">
                    <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Sistema de Alertas Inteligente</h3>
                    <p className="text-white/70 text-xs mt-1">Notificaciones en tiempo real</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/30 transition-colors border border-cyan-500/30 group-hover:border-cyan-500/50">
                    <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Reportes Detallados</h3>
                    <p className="text-white/70 text-xs mt-1">Análisis y estadísticas avanzadas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
              <div className="text-center hover:transform hover:scale-105 transition-transform">
                <div className="text-4xl font-bold mb-2">60+</div>
                <p className="text-xs text-white/70">Empleados</p>
              </div>
              <div className="text-center hover:transform hover:scale-105 transition-transform">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <p className="text-xs text-white/70">Monitoreo</p>
              </div>
              <div className="text-center hover:transform hover:scale-105 transition-transform">
                <div className="text-4xl font-bold mb-2">99.8%</div>
                <p className="text-xs text-white/70">Uptime</p>
              </div>
            </div>
          </div>

        {/* Sección Derecha - Tarjeta Login Flotante */}
        <div className="lg:col-span-1 w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 backdrop-blur-md">
            {/* Logo móvil */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Zero to Zero-Fatigue Zone</h1>
                <p className="text-xs text-slate-600">Sistema de Monitoreo Inteligente</p>
              </div>
            </div>

            <div className="animate-fade-in">
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Iniciar Sesión</h2>
              <p className="text-slate-600 text-sm mb-8">
                Ingresa tus credenciales para acceder al sistema
              </p>

              {/* Error Alert */}
              {error && (
                <div className="mb-6 animate-scale-in bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex gap-3">
                  <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Usuario</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="ejemplo@zzz.com"
                      className="w-full px-4 py-3 pl-11 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      autoFocus
                    />
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>

                {/* Password */}
                <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pl-11 pr-11 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M15.171 13.576l1.414 1.414A10.015 10.015 0 0120 10c-1.274-4.057-5.064-7-9.542-7a9.958 9.958 0 00-2.238.3l1.41 1.41a4 4 0 014.814 4.814l2.727 2.727zM12.72 13.972l-1.473 1.473A2 2 0 0110 15a2 2 0 01-2-2 2 2 0 01.281-.956l-1.473-1.473A4 4 0 0012.72 13.972z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between animate-scale-in text-sm" style={{ animationDelay: '0.25s' }}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-slate-700 focus:ring-slate-500"
                    />
                    <span className="text-slate-700">Recordar sesión</span>
                  </label>
                  <a href="#" className="text-slate-700 hover:text-slate-900 font-medium">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-8 animate-scale-in disabled:opacity-70"
                  style={{ animationDelay: '0.3s' }}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <span>Iniciar Sesión</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <p className="text-center text-xs text-slate-500 mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                © 2025 Zero to Zero-fatigue Zone. Sistema de Monitoreo Industrial.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
