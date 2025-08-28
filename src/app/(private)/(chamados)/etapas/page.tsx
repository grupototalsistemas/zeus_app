'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { EtapaMovimentoFormBase } from '@/components/form/etapaMovimento/EtapaMovimentoForm';
import EtapaMovimentoList from '@/components/tables/EtapaMovimentoList';

import { EtapaMovimentoService } from '@/service/etapaMovimento.service';

export default function EtapaMovimentoPage() {
  const handleSubmit = async (data: any) => {
    console.log(data);
    const response = await EtapaMovimentoService.createEtapa(data);
    console.log(response);
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Tipos de Movimentos" pageBefore="Chamados" />
      <EtapaMovimentoFormBase mode="create" onSubmit={handleSubmit} disabled={false} />
      <br />
      <EtapaMovimentoList />
    </>
  );
}
