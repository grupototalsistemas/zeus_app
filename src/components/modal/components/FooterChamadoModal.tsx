'use client';

import { useEtapaMovimento } from '@/hooks/useEtapaMovimento';
import { usePessoa } from '@/hooks/usePessoa';
import { usePrioridade } from '@/hooks/usePrioridade';
import { Chamado } from '@/types/chamado.type';

import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import React, { useEffect, useState } from 'react';

interface ChamadoModalFooterProps {
  chamado: Chamado;
  onClose: () => void;
  onUpdateChamado: (update: any) => void;
}

export const ChamadoModalFooter: React.FC<ChamadoModalFooterProps> = ({
  chamado,
  onClose,
  onUpdateChamado,
}) => {
  const { prioridadesFormatadas } = usePrioridade();
  const { pessoasFormatadas } = usePessoa();
  const { etapasFormatadas } = useEtapaMovimento();

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleUpdateStatus = (value: string) => {
    const aux_chamado = { ...chamado };
    const mov = aux_chamado.movimentos || [];
    if (mov.length > 0) {
      mov[mov.length - 1].etapaId = Number(value);
      onUpdateChamado({ movimentos: mov });
    }
  };

  const FooterContent = () => (
    <>
      <div className="flex w-full flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
        <Label className="flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
          Opções Rápidas:
        </Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:flex md:space-x-3">
          <Select
            onChange={(value) =>
              onUpdateChamado({ prioridadeId: Number(value) })
            }
            options={prioridadesFormatadas}
            placeholder="Alterar Prioridade"
          />
          <Select
            onChange={(value) => onUpdateChamado({ usuarioId: Number(value) })}
            options={pessoasFormatadas}
            placeholder="Alterar Responsável"
          />
          <Select
            onChange={handleUpdateStatus}
            options={etapasFormatadas}
            placeholder="Alterar Status"
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-3 pt-3 md:flex-row-reverse md:pt-0">
        <button
          onClick={onClose}
          className="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none md:w-auto md:py-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-gray-500"
        >
          Fechar
        </button>
        <button className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none md:w-auto md:py-2 dark:focus:ring-blue-500">
          Editar Chamado
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Overlay quando bottom sheet está aberto */}
        {isBottomSheetOpen && (
          <div
            className="bg-opacity-50 fixed inset-0 z-20 bg-black md:hidden"
            onClick={() => setIsBottomSheetOpen(false)}
          />
        )}

        {/* Bottom Sheet Mobile */}
        <div
          className={`fixed right-0 bottom-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:hidden ${
            isBottomSheetOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="rounded-t-2xl bg-white shadow-2xl dark:bg-gray-800">
            {/* Handle do Bottom Sheet */}
            <div className="flex justify-center py-3">
              <div className="h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>

            {/* Conteúdo do Bottom Sheet */}
            <div className="max-h-[70vh] overflow-y-auto px-4 pb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Ações Rápidas
                </h3>
                <FooterContent />
              </div>
            </div>
          </div>
        </div>

        {/* Botão para abrir Bottom Sheet (móvel) */}
        <button
          onClick={() => setIsBottomSheetOpen(true)}
          className="fixed right-4 bottom-4 z-20 rounded-full bg-blue-600 p-4 text-white shadow-lg transition-all hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 md:hidden dark:focus:ring-blue-500"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
            />
          </svg>
        </button>
      </>
    );
  }

  // Footer Desktop - Posição fixa original
  return (
    <div className="absolute bottom-0 z-10 flex w-full flex-col justify-between space-y-2 border-t border-gray-200 bg-white p-4 sm:flex-row sm:space-y-0 sm:space-x-3 sm:p-6 md:flex-row dark:border-gray-700 dark:bg-gray-800">
      <FooterContent />
    </div>
  );
};
