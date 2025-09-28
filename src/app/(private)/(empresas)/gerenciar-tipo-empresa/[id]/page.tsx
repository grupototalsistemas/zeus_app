// gerenciar-tipo-empresa/[id]/page.tsx
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { TipoEmpresaFormBase } from '@/components/form/tipoEmpresa/TipoEmpresaForm';
import TipoEmpresaList from '@/components/tables/TipoEmpresaList';
import { Metadata } from 'next';
interface PageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: 'Editar Tipo de Empresa',
  description: 'Edição de tipo de empresa',
};

// Server Component - recebe params como prop
export default function TipoEmpresaEdit({ params: { id } }: PageProps) {
  return (
    <>
      <PageBreadcrumb pageTitle="Tipos de Empresas" pageBefore="Empresas" />
      <TipoEmpresaFormBase mode="edit" id={id} />
      <br />
      <TipoEmpresaList />
    </>
  );
}
