/**
 * Medical Alert Modal
 * Modal de alerta médica que aparece automáticamente cuando se reporta un síntoma severo
 * Diseño Enterprise UI
 */

import { useEffect, useState } from 'react';

interface MedicalAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  symptomName: string;
}

export function MedicalAlertModal({ isOpen, onClose, symptomName }: MedicalAlertModalProps) {
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCountdown(15);
      
      // Countdown cada segundo
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        clearInterval(countdownInterval);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm" style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <div 
        className="flex min-h-screen items-center justify-center p-4"
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            onClose();
          }
        }}
      >
        <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full transform transition-all">
          {/* Header - Mismo estilo que tus modales */}
          <div className="flex flex-col items-center justify-center px-8 py-6 border-b border-gray-200 bg-[#18314F] rounded-t-lg">
            {/* Icono de warning rojo sin círculo */}
            <svg className="w-16 h-16 text-[#DC2626] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-2xl font-bold text-white">ALERTA MÉDICA</h3>
          </div>

          {/* Body - Mismo padding que tus modales */}
          <div className="px-8 py-6">
            <div className="space-y-5">
              {/* Texto principal */}
              <p className="text-[#18314F]">
                Has reportado <span className="font-semibold">{symptomName}</span>, te recomendamos que hagas lo siguiente:
              </p>

              {/* Lista de recomendaciones */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-[#18314F] font-bold">•</span>
                  <p className="text-[#18314F] flex-1">
                    <span className="font-semibold">Tómate 10 minutos de descanso.</span> Es importante que te detengas ahora.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-[#18314F] font-bold">•</span>
                  <p className="text-[#18314F] flex-1">
                    <span className="font-semibold">Acude al médico de inmediato.</span> Este síntoma requiere atención profesional.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-[#18314F] font-bold">•</span>
                  <p className="text-[#18314F] flex-1">
                    <span className="font-semibold">Tu supervisor ha sido notificado.</span> Recibirás seguimiento pronto.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Mismo estilo que tus modales */}
          <div className="flex flex-col items-center gap-3 px-8 py-5 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <button
              onClick={onClose}
              className="w-full px-5 py-2.5 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Entendido - Iré al médico
            </button>
            <p className="text-center text-sm text-gray-500">
              Este mensaje se cerrará en <span className="font-semibold text-[#18314F]">{countdown}</span> segundos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
