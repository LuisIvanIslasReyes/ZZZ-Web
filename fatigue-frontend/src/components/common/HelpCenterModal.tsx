/**
 * Help Center Modal Component
 * Modal reutilizable para mostrar el centro de ayuda
 */

import { Modal } from './Modal';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpCenterModal({ isOpen, onClose }: HelpCenterModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Centro de Ayuda"
      size="lg"
      footer={
        <button
          onClick={onClose}
          className="px-6 py-3 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-xl font-semibold transition-colors"
        >
          Cerrar
        </button>
      }
    >
      <div className="space-y-6">
        {/* Preguntas Frecuentes */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h4 className="text-lg font-semibold text-[#18314F] mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#C98A05]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Preguntas Frecuentes
          </h4>
          <div className="space-y-3">
            <details className="bg-white rounded-lg p-3 shadow-sm cursor-pointer group">
              <summary className="font-medium text-[#18314F] list-none flex justify-between items-center">
                ¿Cómo funciona el monitoreo de fatiga?
                <svg className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-600 text-sm mt-2 pt-2 border-t border-gray-100">
                El sistema utiliza sensores en tu dispositivo para medir indicadores fisiológicos como frecuencia cardíaca y patrones de movimiento. Estos datos se analizan para detectar señales de fatiga y enviarte alertas cuando es necesario tomar un descanso.
              </p>
            </details>
            <details className="bg-white rounded-lg p-3 shadow-sm cursor-pointer group">
              <summary className="font-medium text-[#18314F] list-none flex justify-between items-center">
                ¿Qué significan los niveles de alerta?
                <svg className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-600 text-sm mt-2 pt-2 border-t border-gray-100">
                <span className="text-green-600 font-medium">Verde:</span> Estado óptimo, sin fatiga detectada.<br/>
                <span className="text-yellow-600 font-medium">Amarillo:</span> Fatiga leve, considera tomar un breve descanso.<br/>
                <span className="text-red-600 font-medium">Rojo:</span> Fatiga alta, se recomienda un descanso inmediato.
              </p>
            </details>
            <details className="bg-white rounded-lg p-3 shadow-sm cursor-pointer group">
              <summary className="font-medium text-[#18314F] list-none flex justify-between items-center">
                ¿Mis datos son privados?
                <svg className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-gray-600 text-sm mt-2 pt-2 border-t border-gray-100">
                Sí, tus datos personales y de salud están protegidos. Solo tú y tu supervisor autorizado pueden ver tu información de fatiga. Puedes descargar o solicitar la eliminación de tus datos en cualquier momento.
              </p>
            </details>
          </div>
        </div>

        {/* Contacto y Soporte */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h4 className="text-lg font-semibold text-[#18314F] mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contacto y Soporte
          </h4>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              <strong>Soporte técnico:</strong> soporte@zzz-fatigue.com
            </p>
            <p className="text-gray-700">
              <strong>Horario de atención:</strong> Lunes a Viernes, 9:00 - 18:00
            </p>
            <p className="text-gray-600 mt-2">
              Si tienes problemas con tu dispositivo o la aplicación, contacta a tu supervisor o al equipo de soporte técnico.
            </p>
          </div>
        </div>

        {/* Información de Emergencia */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h4 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            En caso de emergencia
          </h4>
          <p className="text-sm text-red-700">
            Si experimentas síntomas graves como mareos intensos, dolor en el pecho o dificultad para respirar, detén tu actividad inmediatamente y busca atención médica.
          </p>
        </div>

        {/* Información de la App */}
        <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
          <p className="font-medium text-[#18314F]">ZZZ - Sistema de Monitoreo de Fatiga</p>
          <p>Versión 1.0.0</p>
          <p className="mt-1">© 2025 ZZZ Fatigue Management</p>
        </div>
      </div>
    </Modal>
  );
}
