import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { CategoriaEmpresaFormBase } from '@/components/form/categoria_empresa/CategoriaEmpresaForm';
import CategoriaEmpresaList from '@/components/tables/CategoriaEmpresaList';

interface PageProps {
  params: { id: string };
}

export const metadata = {
  title: 'Editar Categorias | Zeus',
  description: 'Gerenciar categorias de empresas',
};

export default function CreateCategoriaEmpresaPage({
  params: { id },
}: PageProps) {
  return (
    <>
      <PageBreadcrumb pageTitle="Categorias" pageBefore="Empresas" />
      <CategoriaEmpresaFormBase mode="edit" id={id} />
      <br />
      <CategoriaEmpresaList />
    </>
  );
}
