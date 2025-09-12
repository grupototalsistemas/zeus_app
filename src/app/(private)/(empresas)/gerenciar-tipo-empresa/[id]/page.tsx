'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import {
  TipoEmpresaFormBase,
  TipoEmpresaFormData,
} from '@/components/form/tipoEmpresa/TipoEmpresaForm';

import TipoEmpresaList from '@/components/tables/TipoEmpresaList';
import { useEmpresaTipo } from '@/hooks/useEmpresaTipo';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TipoEmpresaEdit() {
  const router = useRouter();
  const { update, getById, currentEmpresaTipo } = useEmpresaTipo();
  const { id } = useParams();

  const handleSubmit = async (data: TipoEmpresaFormData) => {
    //retirando o id
    const { id, motivo, ...rest } = data;
    update(id, rest);
    router.replace('/gerenciar-tipo-empresa');
  };

  useEffect(() => {
    if (id) {
      getById(Number(id));
    }
  }, []);

  return (
    <>
      <PageBreadcrumb pageTitle="Tipos de Empresas" pageBefore="Empresas" />
      {currentEmpresaTipo && (
        <TipoEmpresaFormBase
          mode="edit"
          onSubmit={handleSubmit}
          initialData={currentEmpresaTipo}
        />
      )}

      <br />

      <TipoEmpresaList />
    </>
  );
}
