/**
 * Auth Debug Component
 * Componente temporal para debug de autenticación
 * BORRAR EN PRODUCCIÓN
 */

import { useAuth } from '../../contexts/AuthContext';

export function AuthDebug() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  // Solo mostrar en desarrollo
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-base-200 p-4 rounded-lg shadow-lg text-xs max-w-sm z-50 opacity-90">
      <h3 className="font-bold mb-2 text-sm">🔍 Auth Debug Info</h3>
      <div className="space-y-1">
        <div>
          <strong>Status:</strong>{' '}
          {isLoading ? '⏳ Loading...' : isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
        </div>
        <div>
          <strong>User:</strong> {user ? `${user.first_name} ${user.last_name} (${user.role})` : 'null'}
        </div>
        <div>
          <strong>Email:</strong> {user?.email || 'N/A'}
        </div>
        <div>
          <strong>Access Token:</strong>{' '}
          {accessToken ? `${accessToken.substring(0, 20)}...` : '❌ NO TOKEN'}
        </div>
        <div>
          <strong>Refresh Token:</strong>{' '}
          {refreshToken ? `${refreshToken.substring(0, 20)}...` : '❌ NO TOKEN'}
        </div>
      </div>
      <button
        className="btn btn-xs btn-error mt-2 w-full"
        onClick={() => {
          console.log('=== AUTH DEBUG INFO ===');
          console.log('User:', user);
          console.log('Is Authenticated:', isAuthenticated);
          console.log('Is Loading:', isLoading);
          console.log('Access Token:', accessToken);
          console.log('Refresh Token:', refreshToken);
          console.log('======================');
        }}
      >
        Log to Console
      </button>
    </div>
  );
}
