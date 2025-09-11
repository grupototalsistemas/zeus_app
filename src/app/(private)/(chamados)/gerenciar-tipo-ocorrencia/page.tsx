'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { TipoOcorrenciaFormBase } from '@/components/form/tipoOcorrencia/TipoOcorrenciaForm';
import TipoOcorrenciaList from '@/components/tables/TipoOcorrenciaList';
import { TipoOcorrenciaService } from '@/service/ocorrenciaTipo.service';
import { useRouter } from 'next/navigation';

export default function OcorrenciaPage() {
  const router = useRouter();
  const handleSubmit = async (data: any) => {
    console.log(data);
    const response = await TipoOcorrenciaService.createOcorrenciaTipo(data);
    console.log(response);
    router.push('/tipo-ocorrencia');
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Tipos de Ocorrências" pageBefore="Chamados" />
      <TipoOcorrenciaFormBase
        mode="create"
        onSubmit={handleSubmit}
        disabled={false}
      />
      <br />
      <TipoOcorrenciaList />
    </>
  );
}
