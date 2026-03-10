'use client';

import { useChamado } from '@/hooks/useChamado';
import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { ChamadoModalAnexos } from './components/AnexoChamadoModal';
import { ChamadoModalMensagens } from './components/ChatChamadoModal';
import { ChamadoModalFooter } from './components/FooterChamadoModal';
import { ChamadoModalHeader } from './components/HeaderChamadoModal';
import { ChamadoModalHistorico } from './components/HistoricoChamadoModal';
import { ChamadoModalInformacoes } from './components/InformacoesChamadoModal';

interface ChamadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  chamadoId: number;
}

const ChamadoModal: React.FC<ChamadoModalProps> = ({
  isOpen,
  onClose,
  chamadoId,
}) => {
  const { chamados, update, optimisticUpdate } = useChamado();
  const chamado = chamados.find((c) => c.id === chamadoId);
  const [updateError, setUpdateError] = useState<string | null>(null);

  if (!chamado) return null;

  const handleAtualizarChamadoRapido = async (
    partePraAtualizar: any,
    payloadApi?: any
  ) => {
    const previous = {
      ...chamado,
      movimentos: chamado.movimentos ? [...chamado.movimentos] : [],
    };
    const merged = { ...chamado, ...partePraAtualizar };

    optimisticUpdate(merged);
    setUpdateError(null);

    try {
      if (chamado.id) {
        await update(chamado.id, payloadApi ?? partePraAtualizar);
      }
    } catch (error) {
      console.error('Erro ao atualizar chamado:', error);
      optimisticUpdate(previous);
      setUpdateError(
        'Erro ao atualizar chamado. As alterações foram revertidas.'
      );
    }
  };

  const handleRefresh = () => {
    // no longer needed after optimistic updates; keep for manual refresh use-cases
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="safe-area-insets mx-4 my-4 flex h-11/12 max-w-6xl flex-col overflow-hidden"
      showCloseButton={true}
    >
      {/* Header Component */}
      <ChamadoModalHeader chamado={chamado} />

      {/* Conteúdo com Scroll */}
      <div className="flex h-full w-full flex-col overflow-x-auto pb-30 md:grid md:grid-cols-2 md:overflow-y-auto md:pb-4">
        {/* Coluna Esquerda - Informações */}
        <ChamadoModalInformacoes chamado={chamado} />

        {/* Coluna Direita - Mensagens, Histórico, Anexos */}
        <div className="space-y-4 px-6 pt-6 md:h-6/9 md:overflow-y-auto">
          <ChamadoModalMensagens chamado={chamado} onRefresh={handleRefresh} />
          <ChamadoModalHistorico chamado={chamado} />
          <ChamadoModalAnexos chamado={chamado} />
        </div>
      </div>

      {/* Footer Component */}
      <ChamadoModalFooter
        chamado={chamado}
        onClose={onClose}
        onUpdateChamado={handleAtualizarChamadoRapido}
        updateError={updateError}
        onClearError={() => setUpdateError(null)}
      />
    </Modal>
  );
};

export default ChamadoModal;
