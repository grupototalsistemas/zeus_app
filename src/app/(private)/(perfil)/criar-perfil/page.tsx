'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import {
  PerfilFormBase,
  PerfilFormData,
} from '@/components/form/perfil/PerfilForm';
import PerfilList from '@/components/tables/PerfilList';
import { usePerfil } from '@/hooks/usePerfil';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreatePerfilPage() {
  const router = useRouter();
  const { createPerfil, loading, error } = usePerfil();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: PerfilFormData) => {
    try {
      setIsSubmitting(true);

      // Usa o hook que já gerencia o Redux
      await createPerfil(data);

      // Redireciona após sucesso
      router.push('/listar-perfil');
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      // O erro já é tratado no hook, mas você pode adicionar notificação aqui
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Criar Perfil" pageBefore="Perfis" />

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
          mode="create"
          onSubmit={handleCreate}
          disabled={loading || isSubmitting}
        />
        <br />
        <PerfilList />
      </div>
    </>
  );
}
