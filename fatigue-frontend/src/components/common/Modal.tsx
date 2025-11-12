/**
 * Modal Component
 * Componente modal reutilizable
 */

import { type ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (isOpen) {
      modal.showModal();
    } else {
      modal.close();
    }
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <dialog
      ref={modalRef}
      className="modal"
      onClose={onClose}
      onClick={(e) => {
        // Cerrar al hacer clic fuera del modal
        if (e.target === modalRef.current) {
          onClose();
        }
      }}
    >
      <div className={`modal-box ${sizeClasses[size]} w-11/12`}>
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-4">{title}</h3>
        <div className="py-4">{children}</div>
        {footer && <div className="modal-action">{footer}</div>}
      </div>
    </dialog>
  );
}
