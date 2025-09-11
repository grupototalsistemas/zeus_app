'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import {
  PerfilFormBase,
  PerfilFormData,
} from '@/components/form/perfil/PerfilForm';
import { usePerfil } from '@/hooks/usePerfil';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditPerfilPage() {
  const router = useRouter();
  const params = useParams();
  const { perfilSelecionado, editPerfil, fetchPerfilById, loading, error } =
    usePerfil();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const perfilId = Number(params.id);

  useEffect(() => {
    const loadPerfil = async () => {
      try {
        if (perfilId && !isNaN(perfilId)) {
          await fetchPerfilById(perfilId);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        setNotFound(true);
      }
    };

    loadPerfil();
  }, [perfilId, fetchPerfilById]);

  const handleEdit = async (data: PerfilFormData) => {
    if (!perfilSelecionado) return;

    try {
      setIsSubmitting(true);

      // Usa o hook que já gerencia o Redux
      await editPerfil({
        ...perfilSelecionado,
        ...data,
      });

      // Redireciona após sucesso
      router.push('/listar-perfil');
    } catch (error) {
      console.error('Erro ao editar perfil:', error);
      // O erro já é tratado no hook, mas você pode adicionar notificação aqui
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !perfilSelecionado) {
    return (
      <>
        <PageBreadcrumb pageTitle="Editar Perfil" pageBefore="Perfis" />
        <div className="flex items-center justify-center py-10">
          <div className="text-gray-500 dark:text-gray-400">
            Carregando perfil...
          </div>
        </div>
      </>
    );
  }

  if (notFound || (!loading && !perfilSelecionado)) {
    return (
      <>
        <PageBreadcrumb pageTitle="Perfil não encontrado" pageBefore="Perfis" />
        <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300">
          <h3 className="font-medium">Perfil não encontrado</h3>
          <p className="mt-1">
            O perfil solicitado não foi encontrado ou foi removido.
          </p>
          <button
            onClick={() => router.push('/listar-perfil')}
            className="mt-2 underline hover:no-underline"
          >
            Voltar para lista de perfis
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb
        pageTitle={`Editar Perfil: ${perfilSelecionado?.descricao}`}
        pageBefore="Perfis"
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
        <PerfilFormBase
          mode="edit"
          initialData={perfilSelecionado || undefined}
          onSubmit={handleEdit}
          disabled={loading || isSubmitting}
        />
      </div>
    </>
  );
}
