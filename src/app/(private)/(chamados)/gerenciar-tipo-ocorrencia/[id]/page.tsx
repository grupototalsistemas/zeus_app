'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { TipoOcorrenciaFormBase } from '@/components/form/tipoOcorrencia/TipoOcorrenciaForm';
import TipoOcorrenciaList from '@/components/tables/TipoOcorrenciaList';
import { useOcorrenciaTipo } from '@/hooks/useOcorrenciaTipo';
import { TipoOcorrenciaService } from '@/service/ocorrenciaTipo.service';
import { OcorrenciaTipo } from '@/types/chamadoOcorrenciaTipo.type';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OcorrenciaPage() {
  const { id } = useParams();
  const router = useRouter();
  const { obterOcorrenciaTipoPorId, editarOcorrenciaTipo } =
    useOcorrenciaTipo();
  const [ocorrenciaTipo, setOcorrenciaTipo] = useState<OcorrenciaTipo>();

  useEffect(() => {
    if (id) {
      const ocorrencia = obterOcorrenciaTipoPorId(Number(id));
      if (ocorrencia) {
        setOcorrenciaTipo(ocorrencia);
      }
    }
  });
  const handleSubmit = async (data: any) => {
    console.log(data);
    const response = await TipoOcorrenciaService.updateOcorrenciaTipo(
      Number(id),
      data
    );
    console.log(response);
    router.push('/tipo-ocorrencia');
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Tipos de Ocorrências" pageBefore="Chamados" />
      <TipoOcorrenciaFormBase
        mode="edit"
        onSubmit={handleSubmit}
        initialData={ocorrenciaTipo}
        disabled={false}
      />
      <br />
      <TipoOcorrenciaList />
    </>
  );
}
