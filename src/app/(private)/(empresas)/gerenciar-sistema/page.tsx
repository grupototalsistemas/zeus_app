import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { SistemaFormBase } from '@/components/form/sistema/SistemaForm';
import SistemaList from '@/components/tables/SistemaList';

export const metadata = {
  title: 'Criar Sistema | Zeus',
  description: 'Página para criar um novo sistema.',
};

export default function CreateUserPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Sistemas" pageBefore="Empresas" />
      <SistemaFormBase mode="create" id="" />
      <br />
      <SistemaList />
    </>
  );
}
