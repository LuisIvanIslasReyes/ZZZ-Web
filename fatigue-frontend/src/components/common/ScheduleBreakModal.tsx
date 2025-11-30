/**
 * ScheduleBreakModal Component
 * Modal para programar un descanso - Empleado
 */

import { useState } from 'react';
import { Modal } from './Modal';
import { breakService } from '../../services/break.service';
import { BREAK_TYPES, BREAK_DURATIONS } from '../../types/break.types';
import type { BreakType, BreakDuration } from '../../types/break.types';
import toast from 'react-hot-toast';

interface ScheduleBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ScheduleBreakModal({ isOpen, onClose, onSuccess }: ScheduleBreakModalProps) {
  // Obtener fecha actual
  const today = new Date().toISOString().split('T')[0];
  
  const [breakType, setBreakType] = useState<BreakType>('rest');
  const [scheduledDate] = useState(today); // Fecha fija al día actual
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState<BreakDuration>(30);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!scheduledDate || !scheduledTime) {
      toast.error('Por favor selecciona fecha y hora');
      return;
    }

    try {
      setIsSubmitting(true);
      await breakService.scheduleBreak({
        break_type: breakType,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime + ':00', // Agregar segundos
        duration_minutes: duration,
        reason: reason || undefined,
      });

      toast.success('Descanso programado exitosamente');
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      console.error('Error al programar descanso:', error);
      toast.error(error?.response?.data?.detail || 'Error al programar el descanso');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setBreakType('rest');
    setScheduledTime('');
    setDuration(30);
    setReason('');
    onClose();
  };

  // Iconos SVG solid para cada tipo
  const getBreakIcon = (type: BreakType) => {
    switch (type) {
      case 'coffee':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 21V19H20V21H2ZM20 8V5H18V8H20ZM20 3C20.5523 3 21 3.44772 21 4V9C21 9.55228 20.5523 10 20 10H18V13C18 15.2091 16.2091 17 14 17H6C3.79086 17 2 15.2091 2 13V4C2 3.44772 2.44772 3 3 3H20ZM16 5H4V13C4 14.1046 4.89543 15 6 15H14C15.1046 15 16 14.1046 16 13V5Z"/>
          </svg>
        );
      case 'lunch':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3V21H17V13H14V7C14 4.79086 15.7909 3 18 3H19ZM7 3V9.5C7 10.8807 5.88071 12 4.5 12H4V21H2V3H4V9.5C4 9.77614 4.22386 10 4.5 10H5V3H7ZM12 3V21H10V15H9V3H11V13H10V3H12Z"/>
          </svg>
        );
      case 'rest':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.3807 2.01886C9.91573 3.38768 9 5.3369 9 7.5C9 11.6421 12.3579 15 16.5 15C18.6631 15 20.6123 14.0843 21.9811 12.6193C21.6613 17.8537 17.3149 22 12 22C6.47715 22 2 17.5228 2 12C2 6.68514 6.14629 2.33869 11.3807 2.01886Z"/>
          </svg>
        );
      case 'medical':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 2V8H5V11H11V17H14V11H20V8H14V2H11ZM4 20V22H20V20H4Z"/>
          </svg>
        );
      case 'personal':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C14.2091 2 16 3.79086 16 6C16 8.20914 14.2091 10 12 10C9.79086 10 8 8.20914 8 6C8 3.79086 9.79086 2 12 2ZM12 12C16.4183 12 20 13.7909 20 16V22H4V16C4 13.7909 7.58172 12 12 12Z"/>
          </svg>
        );
      case 'stretch':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 3C9 1.89543 9.89543 1 11 1H13C14.1046 1 15 1.89543 15 3V4H9V3ZM6.5 6.5C6.5 5.67157 7.17157 5 8 5H16C16.8284 5 17.5 5.67157 17.5 6.5C17.5 7.32843 16.8284 8 16 8H15V12L18 15V22H16V16L13 13V8H11V13L8 16V22H6V15L9 12V8H8C7.17157 8 6.5 7.32843 6.5 6.5Z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Programar Descanso"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tipo de descanso */}
        <div>
          <label className="block text-sm font-medium text-[#18314F] mb-2">
            Tipo de descanso
          </label>
          <div className="grid grid-cols-2 gap-2">
            {BREAK_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setBreakType(type.value)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  breakType === type.value
                    ? 'border-[#18314F] bg-[#18314F]/5 text-[#18314F]'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <span className={breakType === type.value ? 'text-[#18314F]' : 'text-gray-400'}>
                  {getBreakIcon(type.value)}
                </span>
                <span className="font-medium text-sm">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Fecha y Hora */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#18314F] mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={scheduledDate}
              readOnly
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#18314F] mb-2">
              Hora
            </label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-[#18314F] focus:ring-2 focus:ring-[#18314F]/20 transition-all"
              required
            />
          </div>
        </div>

        {/* Duración */}
        <div>
          <label className="block text-sm font-medium text-[#18314F] mb-2">
            Duración
          </label>
          <div className="flex flex-wrap gap-2">
            {BREAK_DURATIONS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDuration(d.value)}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                  duration === d.value
                    ? 'border-[#18314F] bg-[#18314F] text-white'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Razón (opcional) */}
        <div>
          <label className="block text-sm font-medium text-[#18314F] mb-2">
            Motivo <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe brevemente el motivo del descanso..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#18314F]/20 focus:border-[#18314F] transition-all resize-none"
          />
        </div>

        {/* Nota informativa */}
        <div className="flex items-start gap-3 p-4 bg-[#18314F]/5 border border-[#18314F]/20 rounded-lg">
          <svg className="w-5 h-5 text-[#18314F] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z"/>
          </svg>
          <p className="text-sm text-[#18314F]">
            Tu solicitud será revisada por tu supervisor. Recibirás una notificación cuando sea aprobada o rechazada.
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#18314F] text-white font-medium hover:bg-[#18314F]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Programando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM13 12V7H11V14H17V12H13Z"/>
                </svg>
                Programar Descanso
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
