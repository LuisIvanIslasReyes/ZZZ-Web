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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="mx-auto max-w-xl w-full bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          {/* Header Azul */}
          <div className="bg-[#18314F] text-white px-6 py-5 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Enviar Notificación al Equipo
              </h2>
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="text-white/80 hover:text-white transition-colors disabled:opacity-50 p-1 hover:bg-white/10 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-white/70 text-sm mt-1">Envía un mensaje importante a todos los miembros de tu equipo</p>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label htmlFor="notification-title" className="block text-sm font-semibold text-gray-700 mb-2">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#18314F]/20 focus:border-[#18314F] focus:outline-none transition-all disabled:opacity-50 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="notification-message" className="block text-sm font-semibold text-gray-700 mb-2">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#18314F]/20 focus:border-[#18314F] focus:outline-none transition-all disabled:opacity-50 disabled:bg-gray-100 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prioridad
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPriority('low')}
                  disabled={isLoading}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    priority === 'low'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mx-auto mb-1.5 ${priority === 'low' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={`text-sm font-medium ${priority === 'low' ? 'text-green-700' : 'text-gray-600'}`}>Baja</span>
                  <p className={`text-xs mt-0.5 ${priority === 'low' ? 'text-green-600' : 'text-gray-400'}`}>Información</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('medium')}
                  disabled={isLoading}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    priority === 'medium'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mx-auto mb-1.5 ${priority === 'medium' ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                  <span className={`text-sm font-medium ${priority === 'medium' ? 'text-amber-700' : 'text-gray-600'}`}>Media</span>
                  <p className={`text-xs mt-0.5 ${priority === 'medium' ? 'text-amber-600' : 'text-gray-400'}`}>Recordatorio</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('high')}
                  disabled={isLoading}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    priority === 'high'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mx-auto mb-1.5 ${priority === 'high' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                  <span className={`text-sm font-medium ${priority === 'high' ? 'text-red-700' : 'text-gray-600'}`}>Alta</span>
                  <p className={`text-xs mt-0.5 ${priority === 'high' ? 'text-red-600' : 'text-gray-400'}`}>Urgente</p>
                </button>
              </div>
            </div>

            {/* Vista Previa - Estilo elegante con borde lateral */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Vista previa</p>
              <div className={`bg-white rounded-lg p-4 border border-gray-200 border-l-4 ${
                priority === 'high' ? 'border-l-red-500' :
                priority === 'medium' ? 'border-l-amber-500' :
                'border-l-green-500'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    priority === 'high' ? 'bg-red-100' :
                    priority === 'medium' ? 'bg-amber-100' :
                    'bg-green-100'
                  }`}>
                    <svg className={`w-4 h-4 ${
                      priority === 'high' ? 'text-red-600' :
                      priority === 'medium' ? 'text-amber-600' :
                      'text-green-600'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{title || 'Título de la notificación'}</p>
                    <p className="text-sm text-gray-600 mt-1">{message || 'Tu mensaje aparecerá aquí...'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim() || !message.trim()}
              className="flex-1 px-4 py-3 bg-[#18314F] text-white font-semibold rounded-lg hover:bg-[#18314F]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
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
