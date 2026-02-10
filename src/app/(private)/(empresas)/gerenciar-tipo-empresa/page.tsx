import PageBreadcrumb from '@/components/common/PageBreadCrumb';

import TipoEmpresaList from '@/components/tables/TipoEmpresaList';

export const metadata = {
  title: 'Criar Tipos de Empresa | Zeus',
  description: 'Lista e gerenciamento de tipos de empresa',
};

export default function TipoEmpresa() {
  return (
    <>
      <PageBreadcrumb pageTitle="Tipos de Empresas" pageBefore="Empresas" />
      <TipoEmpresaList />
    </>
  );
}
