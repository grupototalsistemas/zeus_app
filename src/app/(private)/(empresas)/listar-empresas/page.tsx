import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import EmpresaList from '@/components/tables/EmpresaList';

export const metadata = {
  title: 'Listar Empresas | Zeus',
  description: 'Lista e gerenciamento de empresas',
};

export default function CreateUserPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Empresas" />
      <EmpresaList />
    </>
  );
}
