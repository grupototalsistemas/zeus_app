import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CategoriaEmpresaList from '@/components/tables/CategoriaEmpresaList';

export const metadata = {
  title: 'Criar Categorias | Zeus',
  description: 'Gerenciar categorias de empresas',
};

export default function CreateCategoriaEmpresaPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Categorias" pageBefore="Empresas" />
      <CategoriaEmpresaList />
    </>
  );
}
