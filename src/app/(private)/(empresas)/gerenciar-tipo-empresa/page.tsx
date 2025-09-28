import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { TipoEmpresaFormBase } from '@/components/form/tipoEmpresa/TipoEmpresaForm';

import TipoEmpresaList from '@/components/tables/TipoEmpresaList';

export const metadata = {
  title: 'Gerenciar Tipos de Empresa',
  description: 'Lista e gerenciamento de tipos de empresa',
};

export default function TipoEmpresa() {
  return (
    <>
      <PageBreadcrumb pageTitle="Tipos de Empresas" pageBefore="Empresas" />
      <TipoEmpresaFormBase mode="create" id="" />

      <br />

      <TipoEmpresaList />
    </>
  );
}
