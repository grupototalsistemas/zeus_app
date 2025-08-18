import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TipoList from '@/components/tables/TipoList';

export default function ListarTipo() {
  return (
    <>
      <PageBreadcrumb pageTitle="Listar Funções" pageBefore="Função" />
      <TipoList />
    </>
  );
}
