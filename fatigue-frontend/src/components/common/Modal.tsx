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
      document.body.style.overflow = 'hidden';
    } else {
      modal.close();
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm" style={{ minHeight: '100vh', minWidth: '100vw' }}>
      {/* Modal Content Container */}
      <div 
        className="flex min-h-screen items-center justify-center p-4"
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            onClose();
          }
        }}
      >
        <div className={`relative bg-white rounded-lg shadow-2xl ${sizeClasses[size]} w-full transform transition-all`}>
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-[#18314F] rounded-t-lg">
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <button
              type="button"
              className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-[#18314F]/80 rounded-lg"
              onClick={onClose}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-8 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
