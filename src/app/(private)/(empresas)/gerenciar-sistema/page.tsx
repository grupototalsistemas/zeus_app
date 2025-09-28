import { SistemaFormBase } from '@/components/form/sistema/SistemaForm';
import SistemaList from '@/components/tables/SistemaList';

export const metadata = {
  title: 'Criar Sistema',
  description: 'Página para criar um novo sistema.',
};

export default function CreateUserPage() {
  return (
    <>
      <SistemaFormBase mode="create" id="" />
      <br />
      <SistemaList />
    </>
  );
}
