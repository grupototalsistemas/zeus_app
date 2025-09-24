'use client';

import { Chamado } from '@/types/chamado.type';
import React from 'react';

interface ChamadoModalHeaderProps {
  chamado: Chamado;
}

export const ChamadoModalHeader: React.FC<ChamadoModalHeaderProps> = ({
  chamado,
}) => {
  return (
    <div className="sticky top-0 z-10 h-auto flex-shrink-0 border-b border-gray-200 bg-white p-2 md:p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="w-3/4 md:w-full">
        <h2 className="flex flex-col text-lg font-semibold text-gray-900 md:flex-row md:text-2xl dark:text-white">
          <span className="text-sm font-light md:text-lg">Chamado: </span>
          &nbsp;#
          {chamado?.protocolo || 'N/A'}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {chamado?.titulo}
        </p>
      </div>
    </div>
  );
};
