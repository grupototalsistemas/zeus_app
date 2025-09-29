import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { TipoFormBase } from '@/components/form/tipo/TipoForm';
import TipoPessoaList from '@/components/tables/TipoList';

interface EditTipoPageProps {
  params: { id: string };
}

export const metadata = {
  title: 'Editar Função | Zeus',
  description: 'Editar função',
};

export default function EditTipoPage({ params: { id } }: EditTipoPageProps) {
  return (
    <>
      <PageBreadcrumb pageTitle={`Editar Função | Zeus`} pageBefore="Funções" />

      <TipoFormBase mode="edit" id={id} />
      <br />
      <TipoPessoaList />
    </>
  );
}
