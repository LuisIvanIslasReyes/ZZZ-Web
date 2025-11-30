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
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Sync form with user when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
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
    // Solo enviar los campos editables (no department ni position)
    await onSave({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
    });
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
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-[#18314F] hover:bg-[#18314F]/90 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 ml-2"
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
            <input
              name="first_name"
              type="text"
              value={form.first_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#18314F] focus:ring-2 focus:ring-[#18314F]/20"
              placeholder="Nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido</label>
            <input
              name="last_name"
              type="text"
              value={form.last_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#18314F] focus:ring-2 focus:ring-[#18314F]/20"
              placeholder="Apellido"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#18314F] focus:ring-2 focus:ring-[#18314F]/20"
            placeholder="Correo Electrónico"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#18314F] focus:ring-2 focus:ring-[#18314F]/20"
            placeholder="Teléfono"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Departamento</label>
          <input
            name="department"
            type="text"
            value={form.department}
            readOnly
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            placeholder="Departamento"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Puesto</label>
          <input
            name="position"
            type="text"
            value={form.position}
            readOnly
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            placeholder="Puesto"
          />
        </div>
      </form>
    </Modal>
  );
}
