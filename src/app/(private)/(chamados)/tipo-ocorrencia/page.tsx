'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { OcorrenciaFormBase } from '@/components/form/ocorrencia/ocorrenciaForm';
import { TipoOcorrenciaFormBase } from '@/components/form/tipoOcorrencia/TipoOcorrenciaForm';
import OcorrenciaList from '@/components/tables/OcorrenciaList';
import TipoOcorrenciaList from '@/components/tables/TipoOcorrenciaList';
import { TipoOcorrenciaService } from '@/service/ocorrenciaTipo.service';

export default function OcorrenciaPage() {
  const handleSubmit = async (data: any) => {
    console.log(data);
    const response = await TipoOcorrenciaService.createOcorrenciaTipo(data);
    console.log(response);
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Tipos de Ocorrências" pageBefore="Chamados" />
      <TipoOcorrenciaFormBase mode="create" onSubmit={handleSubmit} disabled={false} />
      <br />
      <TipoOcorrenciaList />
    </>
  );
}
