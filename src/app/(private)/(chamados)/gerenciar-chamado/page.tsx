'use client';

import {
  TicketFormBase,
  TicketFormData,
} from '@/components/form/ticket/TicketForm';
import { mapChamados } from '@/helpers/mapChamados';
import { ChamadoService } from '@/service/chamado.service';
import { CreateChamadoDto } from '@/types/chamado.type';
import { useState } from 'react';

export default function CreateTicketPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (data: TicketFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Form Data:', data);

      // Mapear dados do formulário para o DTO do chamado
      const chamadoData = mapChamados(data);
      console.log('Chamado Data:', chamadoData);

      // Separar anexos dos dados do chamado
      const { anexos, ...chamadoSemAnexos } = chamadoData;

      // Criar o chamado com movimento inicial se há anexos
      const chamadoComMovimento: CreateChamadoDto = {
        ...chamadoSemAnexos,
        movimento:
          anexos && anexos.length > 0
            ? {
                etapaId: 1,
                usuarioId: Number(data.usuarioId),
                descricaoAcao: 'Chamado criado com anexos',
                observacaoTec: 'Movimento inicial para upload de anexos',
              }
            : undefined,
      };

      // Criar chamado usando o service
      const response = await ChamadoService.createChamado({
        ...chamadoComMovimento,
        anexos,
      });

      console.log('Chamado criado com sucesso:', response);
      setSuccess(true);

      //  A limpeza dos campos acontece automaticamente no TicketFormBase
      // quando onSubmit é resolvido com sucesso

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      //  Em caso de erro, os campos NÃO são limpos
      let errorMessage = 'Erro desconhecido ao criar chamado';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('Erro axios:', axiosError);
        console.error('Erro response:', axiosError.response?.data?.message);
        errorMessage = axiosError.response?.data?.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TicketFormBase mode="create" onSubmit={handleCreate} />
      {success && (
        <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Chamado criado com sucesso!
              </h3>
              <p className="mt-1 text-sm text-green-700">
                Seu chamado foi registrado e você receberá atualizações em
                breve.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem de Erro */}
      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erro ao criar chamado
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 underline hover:text-red-500"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-600">
          <div className="flex items-center space-x-4 rounded-lg bg-white p-6">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Criando chamado...
              </h3>
              <p className="text-sm text-gray-600">
                Por favor, aguarde enquanto processamos sua solicitação
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
