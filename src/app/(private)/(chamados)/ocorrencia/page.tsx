'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { OcorrenciaFormBase } from '@/components/form/ocorrencia/ocorrenciaForm';
import OcorrenciaList from '@/components/tables/OcorrenciaList';
import {useOcorrencia} from '@/hooks/useOcorrencia';

export default function OcorrenciaPage() {
  const {createOcorrencia} = useOcorrencia();

  const handleSubmit = async (data: any) => {
    console.log(data);
    const response = await createOcorrencia(data);
    console.log(response);
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Ocorrencias" pageBefore="Chamados" />
      <OcorrenciaFormBase mode="create" onSubmit={handleSubmit} disabled={false} />
      <br />
      <OcorrenciaList />
    </>
  );
}
