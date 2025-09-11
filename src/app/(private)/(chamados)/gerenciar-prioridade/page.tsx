'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { PrioridadeFormBase } from '@/components/form/prioridade/prioridadeForm';
import PrioridadeList from '@/components/tables/prioridadeList';
import { usePrioridade } from '@/hooks/usePrioridade';
import { StatusRegistro } from '@/types/enum';
import { useRouter } from 'next/navigation';

interface PrioridadeFormData {
  descricao: string;
  empresaId: number;
  cor: string;
  tempo: string;
  ativo: StatusRegistro;
  motivo?: string;
}

export default function TempoExecucao() {
  const router = useRouter();
  const { createPrioridade } = usePrioridade();

  const handleSubmit = async (data: PrioridadeFormData) => {
    const response = await createPrioridade(data);
    router.push('/tempo-execucao');
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Tempo de Execução" pageBefore="Chamados" />
      <PrioridadeFormBase mode="create" onSubmit={handleSubmit} />

      <br />

      <PrioridadeList />
    </>
  );
}
