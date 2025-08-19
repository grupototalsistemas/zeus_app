'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { OcorrenciaFormBase } from '@/components/form/ocorrencia/ocorrenciaForm';
import OcorrenciaList from '@/components/tables/OcorrenciaList';

export default function OcorrenciaPage() {
  const handleSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Ocorrencias" pageBefore="Chamados" />
      <OcorrenciaFormBase mode="create" onSubmit={handleSubmit} />
      <br />
      <OcorrenciaList />
    </>
  );
}
