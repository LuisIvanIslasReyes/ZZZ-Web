/**
 * Medical Alert Modal
 * Modal de alerta médica que aparece automáticamente cuando se reporta un síntoma severo
 */

import { useEffect } from 'react';

interface MedicalAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  symptomName: string;
}

export function MedicalAlertModal({ isOpen, onClose, symptomName }: MedicalAlertModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Auto-cerrar después de 15 segundos
      const timer = setTimeout(() => {
        onClose();
      }, 15000);
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-pulse-slow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con color de alerta */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-2xl p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-white rounded-full p-4">
              <svg className="w-16 h-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">⚠️ ALERTA MÉDICA</h2>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-800 font-semibold text-lg">
              Has reportado: <span className="uppercase">{symptomName}</span>
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold text-yellow-900 text-lg">Tómate 10 minutos de descanso</p>
                <p className="text-yellow-800 text-sm">Es importante que te detengas ahora</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-200">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="font-bold text-red-900 text-lg">Acude al médico de inmediato</p>
                <p className="text-red-800 text-sm">Este síntoma requiere atención profesional</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border border-blue-200">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold text-blue-900">Tu supervisor ha sido notificado</p>
                <p className="text-blue-800 text-sm">Recibirás seguimiento pronto</p>
              </div>
            </div>
          </div>

          {/* Botón */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Entendido - Iré al médico
          </button>

          <p className="text-center text-sm text-gray-500">
            Este mensaje se cerrará automáticamente en 15 segundos
          </p>
        </div>
      </div>
    </div>
  );
}
