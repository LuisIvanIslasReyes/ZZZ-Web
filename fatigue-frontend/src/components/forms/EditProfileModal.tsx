import { useState, useEffect } from 'react';
import type { User } from '../../types/user.types';
import { Modal } from '../common';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (updatedUser: Partial<User>) => void;
}

export function EditProfileModal({ isOpen, onClose, user, onSave }: EditProfileModalProps) {
  const [form, setForm] = useState<Partial<User>>({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    position: user?.position || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Sync form with user when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setForm({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        position: user.position || '',
      });
    }
  }, [isOpen, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    await onSave(form);
    setIsSaving(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Perfil"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-colors"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 ml-2"
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
          <input
            name="full_name"
            type="text"
            value={form.full_name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#18314F] focus:border-transparent"
            placeholder="Nombre Completo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#18314F] focus:border-transparent"
            placeholder="Correo Electrónico"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#18314F] focus:border-transparent"
            placeholder="Teléfono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
          <input
            name="department"
            type="text"
            value={form.department}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#18314F] focus:border-transparent"
            placeholder="Departamento"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Puesto</label>
          <input
            name="position"
            type="text"
            value={form.position}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#18314F] focus:border-transparent"
            placeholder="Puesto"
          />
        </div>
      </form>
    </Modal>
  );
}
