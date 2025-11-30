/**
 * Report Symptom Modal Component
 * Modal reutilizable para reportar síntomas
 */

import { useState } from 'react';
import { Modal } from './Modal';
import { symptomService } from '../../services/symptom.service';
import { SYMPTOM_TYPES, SYMPTOM_SEVERITIES } from '../../types/symptom.types';
import type { SymptomType, SymptomSeverity } from '../../types/symptom.types';
import toast from 'react-hot-toast';

interface ReportSymptomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ReportSymptomModal({ isOpen, onClose, onSuccess }: ReportSymptomModalProps) {
  const [symptomType, setSymptomType] = useState<SymptomType | ''>('');
  const [severity, setSeverity] = useState<SymptomSeverity | ''>('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!symptomType) {
      toast.error('Selecciona un tipo de síntoma');
      return;
    }
    if (!severity) {
      toast.error('Selecciona la severidad');
      return;
    }

    try {
      setIsLoading(true);
      await symptomService.reportSymptom({
        symptom_type: symptomType,
        severity: severity,
        description: description.trim() || undefined,
      });
      toast.success('Síntoma reportado exitosamente');
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      console.error('Error al reportar síntoma:', error);
      toast.error(error?.response?.data?.detail || 'Error al reportar el síntoma');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSymptomType('');
    setSeverity('');
    setDescription('');
    onClose();
  };

  const getSeverityColor = (sev: SymptomSeverity | '') => {
    switch (sev) {
      case 'mild': return 'bg-green-100 text-green-800 border-green-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'severe': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reportar Síntoma"
      size="md"
      footer={
        <>
          <button
            onClick={handleClose}
            className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !symptomType || !severity}
            className="px-5 py-2.5 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Enviando...' : 'Enviar Reporte'}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Tipo de síntoma */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de síntoma <span className="text-red-500">*</span>
          </label>
          <select
            value={symptomType}
            onChange={(e) => setSymptomType(e.target.value as SymptomType)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#18314F] focus:border-transparent bg-white"
          >
            <option value="">Selecciona un síntoma</option>
            {SYMPTOM_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Severidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Severidad <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {SYMPTOM_SEVERITIES.map((sev) => (
              <button
                key={sev.value}
                type="button"
                onClick={() => setSeverity(sev.value)}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  severity === sev.value
                    ? getSeverityColor(sev.value) + ' border-2'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
              >
                {sev.label}
              </button>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción adicional <span className="text-gray-400">(opcional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#18314F] focus:border-transparent resize-none"
            placeholder="Describe brevemente cómo te sientes..."
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{description.length}/500</p>
        </div>

        {/* Nota informativa */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Tu reporte será enviado a tu supervisor para que pueda tomar las medidas necesarias.
            Si experimentas síntomas severos, considera tomar un descanso inmediato.
          </p>
        </div>
      </div>
    </Modal>
  );
}
