/**
 * Send Notification Modal
 * Modal para enviar notificaciones al equipo
 */

import { useState, useEffect } from 'react';

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: {
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
  }) => Promise<void>;
  isLoading?: boolean;
}

export function SendNotificationModal({
  isOpen,
  onClose,
  onSend,
  isLoading = false
}: SendNotificationModalProps) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) return;

    await onSend({ title, message, priority });
    
    setTitle('');
    setMessage('');
    setPriority('medium');
  };

  const handleClose = () => {
    if (!isLoading) {
      setTitle('');
      setMessage('');
      setPriority('medium');
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
      onClick={handleBackdropClick}
    >
      <div className="mx-auto max-w-xl w-full bg-white rounded-2xl shadow-xl" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#18314F]">
              Enviar Notificación al Equipo
            </h2>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="notification-title" className="block text-sm font-medium text-gray-700 mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                id="notification-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Recordatorio de descanso"
                required
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#18314F] focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="notification-message" className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje <span className="text-red-500">*</span>
              </label>
              <textarea
                id="notification-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                required
                rows={4}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#18314F] focus:border-transparent disabled:opacity-50 resize-none"
              />
            </div>

            <div>
              <label htmlFor="notification-priority" className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                id="notification-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#18314F] focus:border-transparent disabled:opacity-50"
              >
                <option value="low">🟢 Baja - Información</option>
                <option value="medium">🟡 Media - Recordatorio</option>
                <option value="high">🔴 Alta - Urgente</option>
              </select>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-2">Vista previa:</p>
              <div className={`p-3 rounded-lg ${
                priority === 'high' ? 'bg-red-100 border border-red-200' :
                priority === 'medium' ? 'bg-yellow-100 border border-yellow-200' :
                'bg-blue-100 border border-blue-200'
              }`}>
                <p className="font-semibold text-sm text-gray-900">{title || 'Título de la notificación'}</p>
                <p className="text-sm text-gray-700 mt-1">{message || 'Tu mensaje aparecerá aquí...'}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim() || !message.trim()}
              className="flex-1 px-4 py-2 bg-[#18314F] text-white font-medium rounded-xl hover:bg-[#18314F]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Enviar Notificación
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
