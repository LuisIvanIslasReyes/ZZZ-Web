import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts';
import type { ApiError } from '../../types';
import LogoBlanco from '../../assets/logo/LogoBlanco.png';

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

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a1628]">
      {/* Fondo con gradiente y elementos decorativos */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#18314F] via-[#0f2137] to-[#0a1628]" />
      
      {/* Círculos decorativos con blur - Estilo glassmorphism */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#18314F]/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#18314F]/25 rounded-full blur-[120px]" />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-[#1e3a5f]/20 rounded-full blur-[100px]" />
      
      {/* Patrón de grid sutil */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header con logo */}
        <header className="p-8">
          <div className="flex items-center gap-3">
            <img src={LogoBlanco} alt="ZZZ" className="h-20 w-auto" />
            <span className="text-white font-bold text-xl tracking-tight">Zero to Zero-Fatigue Zone</span>
          </div>
        </header>

        {/* Contenido central */}
        <main className="flex-1 flex items-center justify-center px-4 pb-20">
          <div className="w-full max-w-md">
            
            {/* Título principal */}
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Bienvenido
              </h1>
              <p className="text-white/60 text-lg">
                Sistema de Monitoreo de Fatiga Industrial
              </p>
            </div>

            {/* Card de login con glassmorphism */}
            <div className="relative">
              {/* Borde con gradiente */}
              <div className="absolute -inset-[1px] bg-gradient-to-b from-white/20 to-white/5 rounded-2xl" />
              
              <div className="relative bg-white/[0.08] backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
                
                {/* Error Alert */}
                {error && (
                  <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl mb-6">
                    <svg className="h-5 w-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#3b82f6]/50 focus:ring-2 focus:ring-[#3b82f6]/20 transition-all"
                      placeholder="ejemplo@zzz.com"
                      autoComplete="username"
                      required
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#3b82f6]/50 focus:ring-2 focus:ring-[#3b82f6]/20 transition-all"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Options row */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 border border-white/20 rounded-md bg-white/5 peer-checked:bg-[#18314F] peer-checked:border-[#3b82f6] transition-all">
                          <svg className="w-5 h-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">Recordarme</span>
                    </label>
                    <button type="button" className="text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full relative group mt-2"
                    disabled={isLoading}
                  >
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-[#18314F] to-[#1e3a5f] rounded-xl opacity-50 group-hover:opacity-70 transition-opacity blur-sm" />
                    <div className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-[#18314F] to-[#1e3a5f] text-white font-semibold py-3.5 px-6 rounded-xl transition-all group-hover:shadow-lg group-hover:shadow-[#18314F]/30 disabled:opacity-50">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Ingresando...</span>
                        </>
                      ) : (
                        <>
                          <span>Iniciar Sesión</span>
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </div>
                  </button>
                </form>
              </div>
            </div>

            {/* Features pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/10 rounded-full">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-white/60 text-sm">Monitoreo 24/7</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/10 rounded-full">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-white/60 text-sm">IA Predictiva</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/10 rounded-full">
                <div className="w-2 h-2 bg-sky-400 rounded-full" />
                <span className="text-white/60 text-sm">Alertas en tiempo real</span>
              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="p-8 text-center">
          <p className="text-white/30 text-sm">
            © 2025 ZZZ · Zero to Zero-Fatigue Zone
          </p>
        </footer>

      </div>
    </div>
  );
}
