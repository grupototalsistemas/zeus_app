'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { TipoFormBase, TipoFormData } from '@/components/form/tipo/TipoForm';
import { usePessoaTipo } from '@/hooks/usePessoaTipo';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditTipoPage() {
  const router = useRouter();
  const params = useParams();
  const {
    pessoasTiposSelecionado,
    editPessoaTipo,
    fetchPessoaTipoById,
    loading,
    error,
  } = usePessoaTipo();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const tipoId = Number(params.id);

  useEffect(() => {
    const loadTipo = async () => {
      try {
        if (tipoId && !isNaN(tipoId)) {
          await fetchPessoaTipoById(tipoId);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Erro ao carregar tipo:', error);
        setNotFound(true);
      }
    };

    loadTipo();
  }, [tipoId, fetchPessoaTipoById]);

  const handleEdit = async (data: TipoFormData) => {
    if (!pessoasTiposSelecionado) return;

    try {
      setIsSubmitting(true);

      // Usa o hook que já gerencia o Redux
      await editPessoaTipo({
        ...pessoasTiposSelecionado,
        ...data,
      });

      // Redireciona após sucesso
      router.push('/listar-tipo');
    } catch (error) {
      console.error('Erro ao editar tipo:', error);
      // O erro já é tratado no hook, mas você pode adicionar notificação aqui
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !pessoasTiposSelecionado) {
    return (
      <>
        <PageBreadcrumb pageTitle="Editar Função" pageBefore="Funções" />
        <div className="flex items-center justify-center py-10">
          <div className="text-gray-500 dark:text-gray-400">
            Carregando função...
          </div>
        </div>
      </>
    );
  }

  if (notFound || (!loading && !pessoasTiposSelecionado)) {
    return (
      <>
        <PageBreadcrumb
          pageTitle="Função não encontrada"
          pageBefore="Funções"
        />
        <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300">
          <h3 className="font-medium">Função não encontrada</h3>
          <p className="mt-1">
            A função solicitada não foi encontrada ou foi removida.
          </p>
          <button
            onClick={() => router.push('/listar-tipo')}
            className="mt-2 underline hover:no-underline"
          >
            Voltar para lista de funções
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb
        pageTitle={`Editar Função: ${pessoasTiposSelecionado?.descricao}`}
        pageBefore="Funções"
      />

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      <div
        className={
          loading || isSubmitting ? 'pointer-events-none opacity-50' : ''
        }
      >
        <TipoFormBase
          mode="edit"
          initialData={pessoasTiposSelecionado || undefined}
          onSubmit={handleEdit}
          disabled={loading || isSubmitting}
        />
      </div>
    </>
  );
}
