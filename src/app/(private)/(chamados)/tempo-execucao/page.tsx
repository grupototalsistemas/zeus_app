'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { PrioridadeFormBase } from '@/components/form/prioridade/prioridadeForm';
import PrioridadeList from '@/components/tables/prioridadeList';
import { StatusRegistro } from '@/types/enum';

interface PrioridadeFormData {
  descricao: string;
  idEmpresa: number;
  cor: string;
  tempoResolucao: string;
  ativo: StatusRegistro;
}

export default function TempoExecucao() {
  return (
    <>
      <PageBreadcrumb pageTitle="Tempo de Execução" pageBefore="Chamados" />
      <PrioridadeFormBase mode="create" onSubmit={() => {}} disabled />
      <PrioridadeList />
    </>
  );
}
