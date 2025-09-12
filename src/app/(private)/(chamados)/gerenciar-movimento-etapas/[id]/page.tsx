'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { EtapaMovimentoFormBase } from '@/components/form/etapaMovimento/EtapaMovimentoForm';
import EtapaMovimentoList from '@/components/tables/EtapaMovimentoList';
import { useEtapaMovimento } from '@/hooks/useEtapaMovimento';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function EtapaMovimentoPage() {
  const { id } = useParams();

  const { fetchEtapaById, etapaAtual, updateEtapa } = useEtapaMovimento();
  const handleSubmit = async (data: any) => {
    updateEtapa(data.id, data);
  };

  useEffect(() => {
    fetchEtapaById(Number(id));
  });
  return (
    <>
      <PageBreadcrumb pageTitle="Tipos de Movimentos" pageBefore="Chamados" />
      {etapaAtual && (
        <EtapaMovimentoFormBase
          mode="edit"
          onSubmit={handleSubmit}
          initialData={etapaAtual}
          disabled={false}
        />
      )}
      <br />
      <EtapaMovimentoList />
    </>
  );
}
