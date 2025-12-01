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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Diseño elegante con rojo sólido */}
        <div className="bg-[#DC2626] p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 rounded-full p-4">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">ALERTA MÉDICA</h2>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {/* Síntoma reportado */}
          <div className="bg-[#DC2626]/5 border border-[#DC2626]/20 p-4 rounded-xl">
            <p className="text-[#18314F] font-medium text-sm mb-1">Has reportado:</p>
            <p className="text-[#DC2626] font-bold text-lg">{symptomName}</p>
          </div>

          {/* Recomendaciones */}
          <div className="space-y-3">
            {/* Descanso */}
            <div className="flex items-start gap-3 p-4 bg-[#18314F]/5 border border-[#18314F]/10 rounded-xl">
              <div className="bg-[#18314F]/10 rounded-full p-2 flex-shrink-0">
                <svg className="w-5 h-5 text-[#18314F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#18314F]">Tómate 10 minutos de descanso</p>
                <p className="text-[#18314F]/70 text-sm">Es importante que te detengas ahora</p>
              </div>
            </div>

            {/* Médico */}
            <div className="flex items-start gap-3 p-4 bg-[#DC2626]/5 border border-[#DC2626]/20 rounded-xl">
              <div className="bg-[#DC2626]/10 rounded-full p-2 flex-shrink-0">
                <svg className="w-5 h-5 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#DC2626]">Acude al médico de inmediato</p>
                <p className="text-[#DC2626]/70 text-sm">Este síntoma requiere atención profesional</p>
              </div>
            </div>

            {/* Supervisor notificado */}
            <div className="flex items-start gap-3 p-4 bg-[#18314F]/5 border border-[#18314F]/10 rounded-xl">
              <div className="bg-[#18314F]/10 rounded-full p-2 flex-shrink-0">
                <svg className="w-5 h-5 text-[#18314F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#18314F]">Tu supervisor ha sido notificado</p>
                <p className="text-[#18314F]/70 text-sm">Recibirás seguimiento pronto</p>
              </div>
            </div>
          </div>

          {/* Botón */}
          <button
            onClick={onClose}
            className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold py-3.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
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
  );
}
