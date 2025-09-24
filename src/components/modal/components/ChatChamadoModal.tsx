'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMovimentoMensagem } from '@/hooks/useMovimentoMensagem';
import Send from '@/icons/plus.svg';
import { RootState } from '@/store/rootReducer';
import { Chamado } from '@/types/chamado.type';
import { ChamadoMovimentoMensagem } from '@/types/chamadoMovimentoMensagem.type';
import { StatusRegistro } from '@/types/enum';
import { formatarData } from '@/utils/fomata-data';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Collapse } from '../CollapseModal';

interface ChamadoModalMensagensProps {
  chamado: Chamado;
  onRefresh: () => void;
}

export const ChamadoModalMensagens: React.FC<ChamadoModalMensagensProps> = ({
  chamado,
  onRefresh,
}) => {
  const { create } = useMovimentoMensagem();
  const { pessoaInfo } = useSelector((state: RootState) => state.pessoa);
  const [novaMensagem, setNovaMensagem] = useState('');

  const mensagens = chamado.movimentos?.flatMap((mov) => mov.mensagens) || [];

  const ultimoMovimento = (chamado: Chamado) => {
    if (chamado.movimentos && chamado.movimentos.length > 0) {
      return chamado.movimentos[chamado.movimentos.length - 1];
    } else {
      return null;
    }
  };

  const handleEnviarMensagem = async () => {
    if (novaMensagem.trim() === '') return;

    const mensagem: ChamadoMovimentoMensagem = {
      ativo: StatusRegistro.ATIVO,
      movimentoId: ultimoMovimento(chamado)?.id || 0,
      usuarioEnvioId: Number(pessoaInfo?.id) || 0,
      usuarioLeituraId: chamado.usuarioId || 0,
      descricao: novaMensagem,
    };

    try {
      await create(mensagem);
      setNovaMensagem('');
      onRefresh();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  return (
    <Collapse title="Mensagens" count={mensagens.length} defaultOpen={true}>
      <div className="scrollbar-stable h-6/9 space-y-4 px-6 pt-6">
        {mensagens.map((mensagem) => (
          <div
            key={mensagem?.id}
            className="border-l-4 border-blue-500 py-2 pl-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white">
                {mensagem?.usuarioEnvioId}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatarData(mensagem?.createdAt || '', 'data')} às{' '}
                {formatarData(mensagem?.createdAt || '', 'hora')}
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {mensagem?.descricao}
            </p>
          </div>
        ))}

        {/* Input para nova mensagem */}
        <div className="flex flex-row space-x-2 pb-4">
          <Input
            placeholder="Escreva uma nova mensagem..."
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            className="flex-1 text-black dark:text-white"
          />
          <Button
            onClick={handleEnviarMensagem}
            disabled={novaMensagem.trim() === ''}
            className="px-4"
          >
            <Send className="h-4 w-4" color="#fff dark:#cccc" />
          </Button>
        </div>
      </div>
    </Collapse>
  );
};
