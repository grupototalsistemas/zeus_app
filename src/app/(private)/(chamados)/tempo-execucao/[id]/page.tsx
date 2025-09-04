'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { PrioridadeFormBase } from '@/components/form/prioridade/prioridadeForm';
import PrioridadeList from '@/components/tables/prioridadeList';
import { usePrioridade } from '@/hooks/usePrioridade';
import { Prioridade } from '@/types/chamadoPrioridade.type';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditarPrioridadePage() {
  const { id } = useParams();
  const router = useRouter();
  const { selectPrioridadeById, editPrioridade } = usePrioridade();

  const [loading, setLoading] = useState(true);
  const [prioridade, setPrioridade] = useState<Prioridade | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const data = selectPrioridadeById(String(id));
          data && setPrioridade(data);
        }
      } catch (error) {
        console.error('Erro ao carregar prioridade:', error);
        router.push('/tempo-execucao');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, selectPrioridadeById, router]);

  const handleSubmit = async (data: Prioridade) => {
    console.log(' data: ', data);
    await editPrioridade(data);
    router.push('/tempo-execucao'); // volta para lista
  };

  if (loading) {
    return <div className="p-6">Carregando prioridade...</div>;
  }

  if (!prioridade) {
    return <div className="p-6">Prioridade não encontrada</div>;
  }

  return (
    <>
      <PageBreadcrumb
        pageTitle="Editar Tempo de Execução"
        pageBefore="Chamados"
      />
      <PrioridadeFormBase
        mode="edit"
        initialData={prioridade}
        onSubmit={handleSubmit}
      />
      <br />

      <PrioridadeList />
    </>
  );
}
