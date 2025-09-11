'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import {
  TipoEmpresaFormBase,
  TipoEmpresaFormData,
} from '@/components/form/tipoEmpresa/TipoEmpresaForm';

import TipoEmpresaList from '@/components/tables/TipoEmpresaList';
import { useEmpresaTipo } from '@/hooks/useEmpresaTipo';
import { useRouter } from 'next/navigation';

export default function TipoEmpresa() {
  const router = useRouter();
  const { create } = useEmpresaTipo();

  const handleSubmit = async (data: TipoEmpresaFormData) => {
    create(data);
    router.push('/gerenciar-tipo-empresa');
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Tipos de Empresas" pageBefore="Empresas" />
      <TipoEmpresaFormBase mode="create" onSubmit={handleSubmit} />

      <br />

      <TipoEmpresaList />
    </>
  );
}
