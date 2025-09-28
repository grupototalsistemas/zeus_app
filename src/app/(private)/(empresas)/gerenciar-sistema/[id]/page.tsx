import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { SistemaFormBase } from '@/components/form/sistema/SistemaForm';
import SistemaList from '@/components/tables/SistemaList';

export const metadata = {
  title: 'Editar Sistema | Zeus',
  description: 'Página para editar um sistema existente.',
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function CreateUserPage({ params: { id } }: PageProps) {
  return (
    <>
      <PageBreadcrumb pageTitle="Sistemas" pageBefore="Empresas" />
      <SistemaFormBase mode="edit" id={id} />
      <br />
      <SistemaList />
    </>
  );
}
