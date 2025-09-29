import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { TipoFormBase } from '@/components/form/tipo/TipoForm';
import TipoPessoaList from '@/components/tables/TipoList';

export const metadata = {
  title: 'Criar Função | Zeus',
  description: 'Criar nova função',
};

export default function CreateTipoPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Criar Função" pageBefore="Funções" />

      <TipoFormBase mode="create" id="" />
      <br />
      <TipoPessoaList />
    </>
  );
}
