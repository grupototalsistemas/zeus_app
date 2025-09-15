'use client';

import { useChamado } from '@/hooks/useChamado';
import { useMovimentoMensagem } from '@/hooks/useMovimentoMensagem';
import { usePerfil } from '@/hooks/usePerfil';
import { usePrioridade } from '@/hooks/usePrioridade';
import { useSistema } from '@/hooks/useSistema';
import { RootState } from '@/store/rootReducer';
import { Chamado } from '@/types/chamado.type';
import { ChamadoMovimentoMensagem } from '@/types/chamadoMovimentoMensagem.type';
import { StatusRegistro } from '@/types/enum';
import {
  formataDataParaExibir,
  formataHoraParaExibir,
} from '@/utils/fomata-data';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Send from '../../../public/images/icons/send.svg';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import Select from '../form/Select';
import Badge from '../ui/badge/Badge';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { Collapse } from './CollapseModal';

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
  const { chamados, getAll } = useChamado();

  const chamado = chamados.find((c) => c.id === chamadoId);
  if (!chamado) return null;

  const { selectPerfilById } = usePerfil();
  const { selectPrioridadeById } = usePrioridade();
  const { findById } = useSistema();

  const mensagens = chamado.movimentos?.flatMap((mov) => mov.mensagens) || [];
  const anexos = chamado.movimentos?.flatMap((mov) => mov.anexos) || [];
  const movimentos = chamado.movimentos || [];
  const { pessoaInfo } = useSelector((state: RootState) => state.pessoa);
  const { empresas } = useSelector((state: RootState) => state.empresa);
  const { create } = useMovimentoMensagem();

  const [currentPanel, setCurrentPanel] = useState(0);

  const goToPreviousPanel = () => {
    setCurrentPanel((prev) => Math.max(0, prev - 1));
  };

  const goToNextPanel = () => {
    setCurrentPanel((prev) => Math.min(1, prev + 1));
  };

  const ultimoMovimento = (chamado: Chamado) => {
    if (chamado.movimentos && chamado.movimentos.length > 0) {
      return chamado.movimentos[chamado.movimentos.length - 1];
    } else {
      return null;
    }
  };

  let mensagem: ChamadoMovimentoMensagem = {
    ativo: StatusRegistro.ATIVO,
    movimentoId: ultimoMovimento(chamado)?.id || 0,
    usuarioEnvioId: Number(pessoaInfo?.id) || 0,
    usuarioLeituraId: chamado.usuarioId || 0,
    descricao: '',
  };
  const getFileIcon = (tipo: string) => {
    if (tipo.startsWith('image/')) {
      return (
        <svg
          className="h-8 w-8 text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (tipo === 'application/pdf') {
      return (
        <svg
          className="h-8 w-8 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return (
      <svg
        className="h-8 w-8 text-gray-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
          clipRule="evenodd"
        />
      </svg>
    );
  };
  const [novaMensagem, setNovaMensagem] = useState('');
  const handleEnviarMensagem = async () => {
    if (novaMensagem.trim() === '') return;
    try {
      create({
        ...mensagem,
        descricao: novaMensagem,
      });
      setNovaMensagem('');
      getAll();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  function selectEmpresasById(empresaId: number) {
    return empresas.find((empresa) => empresa.id === Number(empresaId));
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="mx-4 my-4 flex h-[calc(100vh-2rem)] max-w-7xl flex-col overflow-hidden"
      showCloseButton={true}
    >
      {/* Header Fixo */}
      <div className="sticky top-0 z-10 h-auto flex-shrink-0 border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="w-3/4 md:w-full">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Chamado #{chamado?.protocolo || 'N/A'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {chamado?.titulo}
          </p>
        </div>
      </div>

      {/* Conteúdo com Scroll */}
      <div className="flex h-full w-full flex-col overflow-x-auto overflow-y-auto pb-4 md:grid md:grid-cols-2">
        {/* Coluna Esquerda (scroll vertical interno) */}
        <div className="h-3/4 overflow-y-auto border-r border-b border-gray-200 p-6 lg:border-b-0 dark:border-gray-700">
          {/* Status e Prioridade */}
          <div className="flex flex-wrap gap-4 md:grid md:grid-cols-2 md:pb-4">
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
                {selectPrioridadeById(String(chamado.prioridadeId))
                  ?.descricao || 'N/A'}
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
                {formataDataParaExibir(chamado.createdAt || '')} às{' '}
                {formataHoraParaExibir(chamado.createdAt || '')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Última Atualização
              </p>
              <p className="text-gray-900 dark:text-white">
                {ultimoMovimento(chamado)?.createdAt
                  ? formataDataParaExibir(
                      ultimoMovimento(chamado)?.createdAt || ''
                    )
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Responsável
              </p>
              <p className="text-gray-900 dark:text-white">
                {selectPerfilById(ultimoMovimento(chamado)?.usuarioId || 0)
                  ?.descricao || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Código
              </p>
              <p className="text-gray-900 dark:text-white">
                {chamado.id || 'N/A'}
              </p>
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

        {/* Lado Direito - Mensagens, Histórico, Anexos */}
        <div className="h-6/9 space-y-4 overflow-y-auto px-6 pt-6">
          {/* Mensagens */}
          <Collapse
            title="Mensagens"
            count={mensagens.length}
            defaultOpen={true}
          >
            <div className="max-h-80 space-y-4 overflow-y-auto p-4">
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
                      {formataDataParaExibir(mensagem?.createdAt || '')} às{' '}
                      {formataHoraParaExibir(mensagem?.createdAt || '')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {mensagem?.descricao}
                  </p>
                </div>
              ))}
              {/* Input para nova mensagem */}
              <span className="flex flex-row text-white dark:text-gray-900">
                <Input
                  placeholder="Escreva uma nova mensagem..."
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                />
                <Button
                  className="mx-2"
                  onClick={handleEnviarMensagem}
                  disabled={novaMensagem.trim() === ''}
                >
                  <Send />
                </Button>
              </span>
            </div>
          </Collapse>

          {/* Histórico */}
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
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.descricaoAcao}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formataDataParaExibir(item.createdAt || '')}{' '}
                          {formataHoraParaExibir(item.createdAt || '')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        por {item.usuarioId}
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

          {/* Anexos */}
          <Collapse title="Anexos" count={anexos.length}>
            <div className="max-h-80 space-y-3 overflow-y-auto p-4">
              {anexos.map((anexo) => (
                <div
                  key={anexo?.id}
                  className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-900/50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(anexo?.mimeType || '')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {anexo?.nomeOriginal}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {anexo?.ativo} • {anexo?.usuarioId} •{' '}
                      {formataDataParaExibir(anexo?.createdAt || '')}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Collapse>
        </div>
      </div>

      {/* Footer Fixo */}
      <div className="absolute bottom-0 z-10 flex w-full justify-between space-y-2 border-t border-gray-200 bg-white p-4 sm:flex-row sm:space-y-0 sm:space-x-3 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex w-full flex-col md:flex-row md:space-x-3">
          <Label className="flex items-center justify-center">
            Opções Rapidas:{' '}
          </Label>
          <Select
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none sm:w-auto dark:focus:ring-blue-500"
            onChange={(value) => console.log(value)}
            options={[
              { value: 'opcao1', label: 'Opção 1' },
              { value: 'opcao2', label: 'Opção 2' },
              { value: 'opcao3', label: 'Opção 3' },
            ]}
          />

          <Button
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none sm:w-auto dark:focus:ring-blue-500"
            onClick={onClose}
          >
            Alterar Responsavel
          </Button>
          <Button
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none sm:w-auto dark:focus:ring-blue-500"
            onClick={onClose}
          >
            Alterar Status
          </Button>
        </div>
        <div className="flex w-full flex-col gap-3 md:flex-row-reverse">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:outline-none sm:w-auto dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-gray-500"
          >
            Fechar
          </button>
          <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none sm:w-auto dark:focus:ring-blue-500">
            Editar Chamado
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChamadoModal;
