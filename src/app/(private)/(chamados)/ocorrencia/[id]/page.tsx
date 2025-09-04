'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { OcorrenciaFormBase } from '@/components/form/ocorrencia/ocorrenciaForm';
import OcorrenciaList from '@/components/tables/OcorrenciaList';
import { useOcorrencia } from '@/hooks/useOcorrencia';
import { Ocorrencia } from '@/types/chamadoOcorrencia.type';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OcorrenciaPage() {
  const { id } = useParams();
  const { editOcorrencia, selectOcorrenciaById } = useOcorrencia();
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia>();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const ocorrencia = selectOcorrenciaById(String(id));
      if (ocorrencia) {
        setOcorrencia(ocorrencia);
      } else {
        console.log('Ocorrencia nao encontrada');
      }
    }
  }, [id]);

  const handleSubmit = async (data: any) => {
    console.log(data);
    const response = await editOcorrencia(data);
    console.log(response);
    router.push('/ocorrencia');
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Ocorrencias" pageBefore="Chamados" />
      <OcorrenciaFormBase
        mode="edit"
        onSubmit={handleSubmit}
        initialData={ocorrencia}
        disabled={false}
      />
      <br />
      <OcorrenciaList />
    </>
  );
}
