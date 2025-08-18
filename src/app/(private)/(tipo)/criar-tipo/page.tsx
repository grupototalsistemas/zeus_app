'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { TipoFormBase, TipoFormData } from '@/components/form/tipo/TipoForm';
import { useTipo } from '@/hooks/useTipo';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateTipoPage() {
  const router = useRouter();
  const { createTipo, loading, error } = useTipo();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: TipoFormData) => {
    try {
      setIsSubmitting(true);

      // Usa o hook que já gerencia o Redux
      await createTipo(data);

      // Redireciona após sucesso
      router.push('/listar-tipo');
    } catch (error) {
      console.error('Erro ao criar tipo:', error);
      // O erro já é tratado no hook, mas você pode adicionar notificação aqui
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Criar Função" pageBefore="Funções" />

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
          mode="create"
          onSubmit={handleCreate}
          disabled={loading || isSubmitting}
        />
      </div>
    </>
  );
}
