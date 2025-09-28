'use client';

import { usePerfil } from '@/hooks/usePerfil';
import { usePrioridade } from '@/hooks/usePrioridade';
import { useSistema } from '@/hooks/useSistema';
import { RootState } from '@/store/rootReducer';
import { Chamado } from '@/types/chamado.type';
import { StatusRegistro } from '@/types/enum';
import { formatarData } from '@/utils/fomata-data';
import { useSelector } from 'react-redux';

import Badge from '@/components/ui/badge/Badge';
import { usePessoa } from '@/hooks/usePessoa';
import React from 'react';

interface ChamadoModalInformacoesProps {
  chamado: Chamado;
}

export const ChamadoModalInformacoes: React.FC<
  ChamadoModalInformacoesProps
> = ({ chamado }) => {
  const { selectPerfilById } = usePerfil();
  const { selectPrioridadeById } = usePrioridade();
  const { findById } = useSistema();
  const { selectPessoaById } = usePessoa();
  const { empresas } = useSelector((state: RootState) => state.empresa);

  const ultimoMovimento = (chamado: Chamado) => {
    if (chamado.movimentos && chamado.movimentos.length > 0) {
      return chamado.movimentos[chamado.movimentos.length - 1];
    } else {
      return null;
    }
  };

  const selectEmpresasById = (empresaId: number) => {
    return empresas.find((empresa) => empresa.id === Number(empresaId));
  };

  return (
    <div className="border-r border-b border-gray-200 p-6 md:h-3/4 md:overflow-y-auto lg:border-b-0 dark:border-gray-700">
      {/* Status e Prioridade */}
      <div className="flex flex-wrap gap-4 pb-4 md:grid md:grid-cols-2">
        <div>
          <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Status
          </p>
          <Badge
            size="md"
            color={
              chamado.ativo === StatusRegistro.ATIVO
                ? 'success'
                : chamado.ativo === StatusRegistro.INATIVO
                  ? 'warning'
                  : 'error'
            }
          >
            {ultimoMovimento(chamado)?.etapa?.descricao || 'N/A'}
          </Badge>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Prioridade
          </p>
          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
            {selectPrioridadeById(String(chamado.prioridadeId))?.descricao ||
              'N/A'}
          </span>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Criado em
          </p>
          <p className="text-gray-900 dark:text-white">
            {formatarData(chamado.createdAt || '', 'data')} às{' '}
            {formatarData(chamado.createdAt || '', 'hora')}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Última Atualização
          </p>
          <p className="text-gray-900 dark:text-white">
            {ultimoMovimento(chamado)?.createdAt
              ? formatarData(ultimoMovimento(chamado)?.createdAt || '', 'data')
              : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Responsável
          </p>
          <p className="text-gray-900 dark:text-white">
            {selectPessoaById(ultimoMovimento(chamado)?.usuarioId || 0)
              ?.nomeSocial ||
              selectPessoaById(ultimoMovimento(chamado)?.usuarioId || 0)?.nome}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Código
          </p>
          <p className="text-gray-900 dark:text-white">{chamado.id || 'N/A'}</p>
        </div>
      </div>

      {/* Informações do Sistema */}
      <div className="rounded-lg bg-gray-50 py-4 dark:bg-gray-900/50">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Sistema
            </p>
            <p className="text-gray-900 dark:text-white">
              {findById(chamado.sistemaId)?.descricao}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Empresa
            </p>
            <p className="text-gray-900 dark:text-white">
              {selectEmpresasById(chamado.empresaId)?.nomeFantasia}
            </p>
          </div>
        </div>
      </div>
      {/*Requerente e Técnico */}
      <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Requerente
          </p>
          <p className="text-gray-900 dark:text-white">
            {selectPessoaById(chamado.pessoaId)?.nomeSocial ||
              selectPessoaById(chamado.pessoaId)?.nome ||
              'N/A'}
          </p>
        </div>
      </div>
      {/* Descrição */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          Descrição
        </p>
        <div className="max-h-40 overflow-y-auto rounded-lg bg-gray-50 pb-4 dark:bg-gray-900/50">
          <p className="whitespace-pre-wrap text-gray-900 dark:text-white">
            {chamado.descricao}
          </p>
        </div>
      </div>
    </div>
  );
};
