import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { CategoriaEmpresaFormBase } from '@/components/form/categoria_empresa/CategoriaEmpresaForm';
import CategoriaEmpresaList from '@/components/tables/CategoriaEmpresaList';

export const metadata = {
  title: 'Criar Categorias | Zeus',
  description: 'Gerenciar categorias de empresas',
};

export default function CreateCategoriaEmpresaPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Categorias" pageBefore="Empresas" />
      <CategoriaEmpresaFormBase mode="create" id={''} />
      <br />
      <CategoriaEmpresaList />
    </>
  );
}
