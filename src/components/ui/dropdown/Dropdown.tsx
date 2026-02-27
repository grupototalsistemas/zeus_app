'use client';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openUpwards, setOpenUpwards] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.dropdown-toggle')
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Calcular posição e decidir se abre para cima ou para baixo
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const parentElement = dropdownRef.current.parentElement;

      if (parentElement) {
        const parentRect = parentElement.getBoundingClientRect();
        const dropdownHeight = 100; // Altura estimada do dropdown
        const spaceBelow = window.innerHeight - parentRect.bottom;
        const spaceAbove = parentRect.top;

        // Se houver menos espaço abaixo que a altura do dropdown e mais espaço acima, abrir para cima
        const shouldOpenUpwards =
          spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
        setOpenUpwards(shouldOpenUpwards);

        // Calcular posição fixed
        const top = shouldOpenUpwards
          ? parentRect.top - dropdownHeight - 8 // 8px de margem
          : parentRect.bottom + 8;

        const right = window.innerWidth - parentRect.right;

        setPosition({ top, right });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        right: `${position.right}px`,
      }}
      className={`shadow-theme-lg dark:bg-gray-dark z-50 rounded-xl border border-gray-200 bg-white dark:border-gray-800 ${className}`}
    >
      {children}
    </div>
  );
};
