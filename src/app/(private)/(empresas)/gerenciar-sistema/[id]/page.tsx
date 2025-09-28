import { SistemaFormBase } from '@/components/form/sistema/SistemaForm';
import SistemaList from '@/components/tables/SistemaList';

export const metadata = {
  title: 'Editar Sistema',
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
      <SistemaFormBase mode="edit" id={id} />
      <br />
      <SistemaList />
    </>
  );
}
