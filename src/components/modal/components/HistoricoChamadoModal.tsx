'use client';

import { usePessoaUsuario } from '@/hooks/usePessoaUsuario';
import { Chamado } from '@/types/chamado.type';
import { formatarData } from '@/utils/fomata-data';
import React, { useEffect } from 'react';
import { Collapse } from '../CollapseModal';

interface ChamadoModalHistoricoProps {
  chamado: Chamado;
}

export const ChamadoModalHistorico: React.FC<ChamadoModalHistoricoProps> = ({
  chamado,
}) => {
  const movimentos = chamado.movimentos || [];
  const { getById, selectUsuarioById } = usePessoaUsuario();

  useEffect(() => {
    // Carregar os dados dos usuários envolvidos nos movimentos
    movimentos.forEach((mov) => {
      if (mov.id_pessoa_usuario) {
        getById(mov.id_pessoa_usuario);
      }
    });
  }, [movimentos, getById]);

  return (
    <Collapse title="Histórico" count={movimentos.length}>
      <div className="max-h-80 space-y-3 overflow-y-auto p-4">
        {movimentos.map((item, index) => (
          <div key={item.id} className="relative">
            {index !== movimentos.length - 1 && (
              <div className="absolute top-8 left-4 h-full w-px bg-gray-200 dark:bg-gray-700"></div>
            )}
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.descricaoAcao}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatarData(item.createdAt || '', 'data')}{' '}
                    {formatarData(item.createdAt || '', 'hora')}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  por{' '}
                  {selectUsuarioById(item.id_pessoa_usuario)?.nome_login ||
                    'N/A'}
                </p>
                {item.motivo && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {item.motivo}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Collapse>
  );
};
